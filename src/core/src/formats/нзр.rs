//! Формат .нзр — основной формат сцены nazrOS
//!
//! Структура файла (v0.1):
//! ┌─────────────────────────────────────────────────┐
//! │ Заголовок (32 байта)                            │
//! │  [0..4]   Magic: b"\xD0\xBD\xD0\xB7\xD1\x80\0" │  "нзр\0" в UTF-8
//! │  [4..8]   Версия формата: u32 LE                │
//! │  [8..24]  UUID сцены: 128-bit                   │
//! │  [24..32] Timestamp создания: u64 LE (Unix ms)  │
//! ├─────────────────────────────────────────────────┤
//! │ Секции (TLV — Type-Length-Value):               │
//! │  type:   u16 LE                                 │
//! │  length: u32 LE (байт)                          │
//! │  value:  [u8; length] (zstd-сжато опционально)  │
//! ├─────────────────────────────────────────────────┤
//! │ Конец файла:                                    │
//! │  type:   0x00FF                                 │
//! │  length: 4                                      │
//! │  value:  CRC32 всего файла (u32 LE)             │
//! └─────────────────────────────────────────────────┘

use std::path::Path;
use crate::error::CoreError;
use crate::scene::SceneGraph;

/// Magic-байты файла .нзр ("нзр" в UTF-8 + null)
pub const НЗР_MAGIC: &[u8] = b"\xD0\xBD\xD0\xB7\xD1\x80\0\0";

/// Текущая версия формата
pub const НЗР_ВЕРСИЯ: u32 = 1;

/// Коды секций
pub mod секции {
    pub const ГРАФ:   u16 = 0x0001;
    pub const ГЕОМ:   u16 = 0x0002;
    pub const МАТЛ:   u16 = 0x0003;
    pub const АНМ:    u16 = 0x0004;
    pub const ФИЗ:    u16 = 0x0005;
    pub const СВЕТ:   u16 = 0x0006;
    pub const КАМ:    u16 = 0x0007;
    pub const МЕТА:   u16 = 0x0008;
    pub const КОН:    u16 = 0x00FF;  // конец файла
}

/// Читатель формата .нзр
pub struct НзрЧитатель;

impl НзрЧитатель {
    /// Загрузить граф сцены из файла .нзр
    pub fn загрузить(путь: &Path) -> Result<SceneGraph, CoreError> {
        let данные = std::fs::read(путь).map_err(CoreError::IO)?;

        // Проверить magic
        if данные.len() < 8 || &данные[0..8] != НЗР_MAGIC {
            return Err(CoreError::НеверныйФормат {
                ожидался: "нзр".to_string(),
                получен: "неизвестный".to_string(),
            });
        }

        // Проверить версию
        let версия = u32::from_le_bytes(данные[8..12].try_into().unwrap());
        if версия > НЗР_ВЕРСИЯ {
            return Err(CoreError::НеподдерживаемаяВерсия(версия));
        }

        // TODO: парсинг секций (TLV) — Фаза 1
        // Пока возвращаем пустой граф
        Ok(SceneGraph::новый())
    }
}

/// Писатель формата .нзр
pub struct НзрПисатель;

impl НзрПисатель {
    /// Сохранить граф сцены в файл .нзр
    pub fn сохранить(граф: &SceneGraph, путь: &Path) -> Result<(), CoreError> {
        let mut данные: Vec<u8> = Vec::new();

        // Заголовок
        данные.extend_from_slice(НЗР_MAGIC);                // magic (8 байт)
        данные.extend_from_slice(&НЗР_ВЕРСИЯ.to_le_bytes()); // версия (4 байта)
        // UUID + timestamp (24 байта) — TODO Фаза 1
        данные.extend_from_slice(&[0u8; 24]);

        // TODO: секции TLV — Фаза 1

        // Конец файла + CRC32
        let crc = crc32fast::hash(&данные);
        данные.extend_from_slice(&(секции::КОН as u32).to_le_bytes());
        данные.extend_from_slice(&4u32.to_le_bytes());
        данные.extend_from_slice(&crc.to_le_bytes());

        std::fs::write(путь, данные).map_err(CoreError::IO)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn сохранить_и_загрузить_пустой_граф() {
        let dir = tempdir().unwrap();
        let путь = dir.path().join("тест.нзр");
        let граф = SceneGraph::новый();

        НзрПисатель::сохранить(&граф, &путь).unwrap();
        assert!(путь.exists());

        let загруженный = НзрЧитатель::загрузить(&путь).unwrap();
        assert_eq!(загруженный.количество_узлов(), 0);
    }

    #[test]
    fn неверный_magic_отклоняется() {
        let dir = tempdir().unwrap();
        let путь = dir.path().join("фейк.нзр");
        std::fs::write(&путь, b"NOT_NZR_FILE").unwrap();

        let результат = НзрЧитатель::загрузить(&путь);
        assert!(matches!(результат, Err(CoreError::НеверныйФормат { .. })));
    }
}
