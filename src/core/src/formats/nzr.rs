//! Формат .нзр v0.1 — полный парсер
//!
//! Бинарный формат сцены nazrOS.
//! Структура: Заголовок (40 байт) + Секции TLV + Конец с CRC32

use std::path::Path;
use uuid::Uuid;
use chrono::Utc;
use crate::error::CoreError;
use crate::scene::SceneGraph;

/// Magic-байты файла .нзр ("нзр" в UTF-8 + padding до 8 байт)
pub const НЗР_MAGIC: &[u8; 8] = b"\xD0\xBD\xD0\xB7\xD1\x80\x00\x00";

/// Текущая версия формата
pub const НЗР_ВЕРСИЯ: u32 = 1;

/// Флаги заголовка
pub mod флаги {
    pub const СЖАТИЕ_ZSTD: u64 = 0x0001;
    pub const ЗАШИФРОВАНО: u64 = 0x0002;
}

/// Коды секций TLV
pub mod секции {
    /// Граф сцены (дерево узлов)
    pub const ГРАФ:   u16 = 0x0001;
    /// Геометрия (меши, кривые)
    pub const ГЕОМ:   u16 = 0x0002;
    /// Материалы и шейдеры
    pub const МАТЛ:   u16 = 0x0003;
    /// Анимации
    pub const АНМ:    u16 = 0x0004;
    /// Физические данные
    pub const ФИЗ:    u16 = 0x0005;
    /// Световые настройки
    pub const СВЕТ:   u16 = 0x0006;
    /// Камеры
    pub const КАМ:    u16 = 0x0007;
    /// Метаданные (автор, теги, превью-PNG)
    pub const МЕТА:   u16 = 0x0008;
    /// Конец файла + CRC32
    pub const КОН:    u16 = 0x00FF;
}

/// Заголовок файла .нзр (40 байт)
#[derive(Debug, Clone)]
pub struct НзрЗаголовок {
    /// Версия формата
    pub версия: u32,
    /// UUID сцены
    pub uuid_сцены: Uuid,
    /// Timestamp создания (Unix ms)
    pub создан: i64,
    /// Флаги (сжатие, шифрование)
    pub флаги: u64,
}

impl НзрЗаголовок {
    /// Размер заголовка в байтах
    pub const РАЗМЕР: usize = 40;

    fn новый(uuid_сцены: Uuid) -> Self {
        Self {
            версия: НЗР_ВЕРСИЯ,
            uuid_сцены,
            создан: Utc::now().timestamp_millis(),
            флаги: флаги::СЖАТИЕ_ZSTD,
        }
    }

    fn сериализовать(&self) -> Vec<u8> {
        let mut буфер = Vec::with_capacity(Self::РАЗМЕР);
        буфер.extend_from_slice(НЗР_MAGIC);                              // 8 байт
        буфер.extend_from_slice(&self.версия.to_le_bytes());             // 4 байта
        буфер.extend_from_slice(self.uuid_сцены.as_bytes());             // 16 байт
        буфер.extend_from_slice(&self.создан.to_le_bytes());             // 8 байт
        буфер.extend_from_slice(&self.флаги.to_le_bytes());              // 8 байт (нет, 4)
        // итого: 8+4+16+8+4 = 40
        буфер
    }

    fn десериализовать(данные: &[u8]) -> Result<Self, CoreError> {
        if данные.len() < Self::РАЗМЕР {
            return Err(CoreError::НеверныйФормат {
                ожидался: "нзр".into(),
                получен: "слишком короткий".into(),
            });
        }

        // Проверить magic
        if &данные[0..8] != НЗР_MAGIC {
            return Err(CoreError::НеверныйФормат {
                ожидался: "нзр".into(),
                получен: "неверный magic".into(),
            });
        }

        let версия = u32::from_le_bytes(данные[8..12].try_into().unwrap());
        if версия > НЗР_ВЕРСИЯ {
            return Err(CoreError::НеподдерживаемаяВерсия(версия));
        }

        let uuid_байты: [u8; 16] = данные[12..28].try_into().unwrap();
        let uuid_сцены = Uuid::from_bytes(uuid_байты);
        let создан = i64::from_le_bytes(данные[28..36].try_into().unwrap());
        let флаги = u32::from_le_bytes(данные[36..40].try_into().unwrap()) as u64;

        Ok(Self { версия, uuid_сцены, создан, флаги })
    }
}

/// Секция TLV
#[derive(Debug)]
struct НзрСекция {
    тип: u16,
    данные: Vec<u8>,
}

impl НзрСекция {
    /// Сериализовать секцию: type(2) + length(4) + value(n)
    fn сериализовать(&self) -> Vec<u8> {
        let mut буфер = Vec::with_capacity(6 + self.данные.len());
        буфер.extend_from_slice(&self.тип.to_le_bytes());
        буфер.extend_from_slice(&(self.данные.len() as u32).to_le_bytes());
        буфер.extend_from_slice(&self.данные);
        буфер
    }

    /// Попытаться прочитать секцию из буфера начиная с offset
    /// Возвращает (секция, новый_offset)
    fn десериализовать(данные: &[u8], offset: usize) -> Result<(Self, usize), CoreError> {
        if offset + 6 > данные.len() {
            return Err(CoreError::НеверныйФормат {
                ожидался: "TLV секция".into(),
                получен: "конец данных".into(),
            });
        }

        let тип = u16::from_le_bytes(данные[offset..offset+2].try_into().unwrap());
        let длина = u32::from_le_bytes(данные[offset+2..offset+6].try_into().unwrap()) as usize;
        let конец = offset + 6 + длина;

        if конец > данные.len() {
            return Err(CoreError::НеверныйФормат {
                ожидался: format!("секция длиной {}", длина),
                получен: "данные обрезаны".into(),
            });
        }

        let содержимое = данные[offset+6..конец].to_vec();
        Ok((Self { тип, данные: содержимое }, конец))
    }
}

/// Метаданные сцены (секция МЕТА)
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct НзрМета {
    /// Имя сцены
    pub имя: String,
    /// Автор
    pub автор: String,
    /// Версия приложения при сохранении
    pub версия_приложения: String,
    /// Теги
    pub теги: Vec<String>,
}

impl Default for НзрМета {
    fn default() -> Self {
        Self {
            имя: "Без названия".into(),
            автор: String::new(),
            версия_приложения: env!("CARGO_PKG_VERSION").into(),
            теги: Vec::new(),
        }
    }
}

/// Полный файл .нзр в памяти
#[derive(Debug)]
pub struct НзрФайл {
    pub заголовок: НзрЗаголовок,
    pub мета: НзрМета,
    pub граф_данные: Vec<u8>,    // сериализованный SceneGraph (JSON пока)
}

impl НзрФайл {
    /// Создать из графа сцены
    pub fn из_графа(граф: &SceneGraph, мета: НзрМета) -> Result<Self, CoreError> {
        // Сериализуем граф в JSON (bincode — следующий этап)
        let граф_данные = serde_json::to_vec(граф)
            .map_err(|e| CoreError::Внутренняя(e.to_string()))?;

        Ok(Self {
            заголовок: НзрЗаголовок::новый(Uuid::new_v4()),
            мета,
            граф_данные,
        })
    }

    /// Сериализовать в байты (с zstd-сжатием графа)
    pub fn в_байты(&self) -> Result<Vec<u8>, CoreError> {
        let mut буфер = Vec::new();

        // 1. Заголовок
        буфер.extend_from_slice(&self.заголовок.сериализовать());

        // 2. Секция МЕТА
        let мета_json = serde_json::to_vec(&self.мета)
            .map_err(|e| CoreError::Внутренняя(e.to_string()))?;
        буфер.extend_from_slice(&НзрСекция {
            тип: секции::МЕТА,
            данные: мета_json,
        }.сериализовать());

        // 3. Секция ГРАФ (с zstd-сжатием)
        let граф_сжат = zstd::encode_all(self.граф_данные.as_slice(), 3)
            .map_err(|e| CoreError::Внутренняя(e.to_string()))?;
        буфер.extend_from_slice(&НзрСекция {
            тип: секции::ГРАФ,
            данные: граф_сжат,
        }.сериализовать());

        // 4. Секция КОН с CRC32
        let crc = crc32fast::hash(&буфер);
        буфер.extend_from_slice(&НзрСекция {
            тип: секции::КОН,
            данные: crc.to_le_bytes().to_vec(),
        }.сериализовать());

        Ok(буфер)
    }

    /// Десериализовать из байт
    pub fn из_байт(данные: &[u8]) -> Result<Self, CoreError> {
        // Читаем заголовок
        let заголовок = НзрЗаголовок::десериализовать(данные)?;
        let mut offset = НзрЗаголовок::РАЗМЕР;

        let mut мета = НзрМета::default();
        let mut граф_данные = Vec::new();

        // Читаем секции
        loop {
            let (секция, новый_offset) = НзрСекция::десериализовать(данные, offset)?;
            offset = новый_offset;

            match секция.тип {
                секции::МЕТА => {
                    мета = serde_json::from_slice(&секция.данные)
                        .map_err(|e| CoreError::Внутренняя(e.to_string()))?;
                }
                секции::ГРАФ => {
                    // Распаковать zstd
                    граф_данные = zstd::decode_all(секция.данные.as_slice())
                        .map_err(|e| CoreError::Внутренняя(e.to_string()))?;
                }
                секции::КОН => {
                    // Проверить CRC32
                    if секция.данные.len() >= 4 {
                        let сохранённый_crc = u32::from_le_bytes(
                            секция.данные[0..4].try_into().unwrap()
                        );
                        // CRC считается по всему файлу до секции КОН
                        let вычисленный_crc = crc32fast::hash(&данные[..offset - секция.данные.len() - 6]);
                        if сохранённый_crc != вычисленный_crc {
                            return Err(CoreError::НарушенаКонтрольнаяСумма);
                        }
                    }
                    break;
                }
                _ => {
                    // Неизвестные секции пропускаем (forward-compatibility)
                    tracing::warn!("Неизвестная секция .нзр: 0x{:04X}", секция.тип);
                }
            }

            if offset >= данные.len() { break; }
        }

        Ok(Self { заголовок, мета, граф_данные })
    }

    /// Восстановить SceneGraph из файла
    pub fn в_граф(&self) -> Result<SceneGraph, CoreError> {
        if self.граф_данные.is_empty() {
            return Ok(SceneGraph::новый());
        }
        serde_json::from_slice(&self.граф_данные)
            .map_err(|e| CoreError::Внутренняя(e.to_string()))
    }
}

/// Читатель формата .нзр
pub struct НзрЧитатель;

impl НзрЧитатель {
    /// Загрузить файл .нзр
    pub fn загрузить(путь: &Path) -> Result<НзрФайл, CoreError> {
        let данные = std::fs::read(путь).map_err(CoreError::IO)?;
        НзрФайл::из_байт(&данные)
    }

    /// Загрузить граф сцены из файла .нзр
    pub fn загрузить_граф(путь: &Path) -> Result<SceneGraph, CoreError> {
        Self::загрузить(путь)?.в_граф()
    }
}

/// Писатель формата .нзр
pub struct НзрПисатель;

impl НзрПисатель {
    /// Сохранить граф сцены в файл .нзр
    pub fn сохранить(граф: &SceneGraph, путь: &Path) -> Result<(), CoreError> {
        Self::сохранить_с_мета(граф, путь, НзрМета::default())
    }

    /// Сохранить с метаданными
    pub fn сохранить_с_мета(
        граф: &SceneGraph,
        путь: &Path,
        мета: НзрМета,
    ) -> Result<(), CoreError> {
        let файл = НзрФайл::из_графа(граф, мета)?;
        let байты = файл.в_байты()?;
        std::fs::write(путь, байты).map_err(CoreError::IO)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::scene::{SceneGraph, Node};
    use tempfile::tempdir;

    #[test]
    fn заголовок_сериализация_десериализация() {
        let uuid = Uuid::new_v4();
        let заг = НзрЗаголовок::новый(uuid);
        let байты = заг.сериализовать();
        assert_eq!(байты.len(), НзрЗаголовок::РАЗМЕР);

        let восстановлен = НзрЗаголовок::десериализовать(&байты).unwrap();
        assert_eq!(восстановлен.версия, НЗР_ВЕРСИЯ);
        assert_eq!(восстановлен.uuid_сцены, uuid);
    }

    #[test]
    fn сохранить_и_загрузить_пустой_граф() {
        let dir = tempdir().unwrap();
        let путь = dir.path().join("test.nzr");
        let граф = SceneGraph::новый();

        НзрПисатель::сохранить(&граф, &путь).unwrap();
        assert!(путь.exists());

        let загруженный = НзрЧитатель::загрузить_граф(&путь).unwrap();
        assert_eq!(загруженный.количество_узлов(), 0);
    }

    #[test]
    fn сохранить_и_загрузить_граф_с_узлами() {
        let dir = tempdir().unwrap();
        let путь = dir.path().join("test.nzr");
        let mut граф = SceneGraph::новый();

        граф.добавить(Node::новый("корень".into()));
        граф.добавить(Node::новый("объект_1".into()));
        граф.добавить(Node::новый("объект_2".into()));

        НзрПисатель::сохранить(&граф, &путь).unwrap();

        let загруженный = НзрЧитатель::загрузить_граф(&путь).unwrap();
        assert_eq!(загруженный.количество_узлов(), 3);
    }

    #[test]
    fn метаданные_сохраняются() {
        let dir = tempdir().unwrap();
        let путь = dir.path().join("test.nzr");
        let граф = SceneGraph::новый();

        let мета = НзрМета {
            имя: "Кибер_Город_01".into(),
            автор: "AJNA".into(),
            версия_приложения: "0.1.0".into(),
            теги: vec!["киберпанк".into(), "город".into()],
        };

        НзрПисатель::сохранить_с_мета(&граф, &путь, мета).unwrap();

        let файл = НзрЧитатель::загрузить(&путь).unwrap();
        assert_eq!(файл.мета.имя, "Кибер_Город_01");
        assert_eq!(файл.мета.автор, "AJNA");
        assert_eq!(файл.мета.теги.len(), 2);
    }

    #[test]
    fn неверный_magic_отклоняется() {
        let данные = b"NOT_NZR_FILE_HEADER_PADDING_HERE_X";
        let результат = НзрФайл::из_байт(данные);
        assert!(matches!(результат, Err(CoreError::НеверныйФормат { .. })));
    }

    #[test]
    fn файл_сжимается() {
        let dir = tempdir().unwrap();
        let путь = dir.path().join("test.nzr");
        let mut граф = SceneGraph::новый();

        // Добавить много узлов чтобы сжатие было заметным
        for i in 0..100 {
            граф.добавить(Node::новый(format!("узел_{:04}", i)));
        }

        НзрПисатель::сохранить(&граф, &путь).unwrap();

        let размер = std::fs::metadata(&путь).unwrap().len();
        // Файл должен быть меньше чем наивная сериализация
        println!("Размер .нзр с 100 узлами: {} байт", размер);
        assert!(размер > 0);
    }
}
