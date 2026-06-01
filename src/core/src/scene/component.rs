//! Компоненты узлов сцены nazrOS
//!
//! Каждый компонент — данные конкретного модуля,
//! прикреплённые к узлу графа сцены.

use serde::{Serialize, Deserialize};
use uuid::Uuid;
use glam::Vec3;

/// Компонент — данные модуля, прикреплённые к узлу.
///
/// Архитектура ECS (Entity-Component-System):
/// узел — entity, компонент — данные, модуль — система.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[non_exhaustive]
pub enum Component {
    /// РУКИ — геометрия (меш)
    Меш(МешКомпонент),
    /// РУКИ — скульпт-данные
    Скульпт(СкульптКомпонент),
    /// РУКИ — материал
    Материал(МатериалКомпонент),
    /// МУЛЬТ — анимация
    Анимация(АнимацияКомпонент),
    /// МУЛЬТ — риг (скелет)
    Риг(РигКомпонент),
    /// СТУДИЯ — камера
    Камера(КамераКомпонент),
    /// СТУДИЯ — источник света
    Свет(СветКомпонент),
    /// ШИНА — аудио-источник
    Аудио(АудиоКомпонент),
    /// ЯБЛОЧКО — физика
    Физика(ФизикаКомпонент),
    /// ПОЛЕ — игровая логика
    Логика(ЛогикаКомпонент),
    /// ПОЛЕ — NPC
    НПС(НПСКомпонент),
    /// Произвольные данные (для сторонних модулей)
    Пользовательский {
        тип: String,
        данные: Vec<u8>,
    },
}

impl Component {
    /// Проверить совпадение типа (для поиска компонента)
    pub fn тип_совпадает<T: 'static>(&self) -> bool {
        // В реальности используем TypeId через Any
        // Пока — заглушка для компиляции
        false
    }

    /// Имя типа для отладки и UI
    pub fn имя_типа(&self) -> &str {
        match self {
            Component::Меш(_)               => "Меш",
            Component::Скульпт(_)           => "Скульпт",
            Component::Материал(_)          => "Материал",
            Component::Анимация(_)          => "Анимация",
            Component::Риг(_)               => "Риг",
            Component::Камера(_)            => "Камера",
            Component::Свет(_)              => "Свет",
            Component::Аудио(_)             => "Аудио",
            Component::Физика(_)            => "Физика",
            Component::Логика(_)            => "Логика",
            Component::НПС(_)               => "НПС",
            Component::Пользовательский {тип, ..} => тип.as_str(),
        }
    }
}

// ─── Данные компонентов ──────────────────────────────────────────────────────

/// РУКИ: ссылка на геометрию меша
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct МешКомпонент {
    /// UUID ассета меша в БИБЛИОТЕКЕ
    pub ассет_id: Uuid,
    /// Тип отображения в viewport
    pub режим_отображения: РежимОтображения,
    /// Видимость в рендере (может отличаться от видимости узла)
    pub в_рендере: bool,
    /// Видимость тени
    pub тень: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub enum РежимОтображения {
    #[default]
    Твёрдое,       // solid
    Каркас,         // wireframe
    ТвёрдоеПлюсКаркас,
}

/// РУКИ: скульпт-слои
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct СкульптКомпонент {
    /// Слои скульпта (как в скриншоте: детали_лица, имплант, кабели, основа)
    pub слои: Vec<СкульптСлой>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct СкульптСлой {
    pub имя: String,
    pub интенсивность: f32,   // 0.0–1.0 (аналог 100 в UI)
    pub видимый: bool,
    pub данные_id: Uuid,      // ссылка на дельта-меш в хранилище
}

/// РУКИ: материал
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct МатериалКомпонент {
    pub материал_id: Uuid,
    pub слот: u8,             // слот материала (для мульти-материалов)
}

/// МУЛЬТ: анимация
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct АнимацияКомпонент {
    pub клип_id: Uuid,
    pub скорость: f32,
    pub цикл: bool,
    pub текущий_кадр: f32,
}

/// МУЛЬТ: риг
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct РигКомпонент {
    pub скелет_id: Uuid,
    /// Контроллеры (CTRL_head, CTRL_neck, и т.д.)
    pub контроллеры: Vec<String>,
}

/// СТУДИЯ: параметры камеры
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct КамераКомпонент {
    pub тип_камеры: ТипКамеры,
    pub фокусное_расстояние: f32,   // мм
    pub диафрагма: f32,              // f/2.8 и т.д.
    pub выдержка: f32,               // 1/50 и т.д.
    pub iso: u32,
    pub баланс_белого: u32,          // Кельвины
    pub стабилизация: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub enum ТипКамеры {
    #[default]
    Перспективная,
    Ортогональная,
    VirtualCinemaCam,
}

/// СТУДИЯ: источник света
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct СветКомпонент {
    pub тип_света: ТипСвета,
    pub интенсивность: f32,      // 0.0–1.0+
    pub цвет: [f32; 3],          // RGB
    pub температура_к: Option<u32>,
    pub радиус: f32,
    pub тени: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ТипСвета {
    Точечный,
    Направленный,
    Прожектор { угол_конуса: f32 },
    Площадной { ширина: f32, высота: f32 },
    НеонТрубка { длина: f32 },
}

/// ШИНА: аудио-источник
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct АудиоКомпонент {
    pub клип_id: Uuid,
    pub громкость: f32,
    pub панорама: f32,           // -1.0 (лево) .. 1.0 (право)
    pub пространственный: bool,  // 3D-звук
    pub радиус_слышимости: f32,
    pub автовоспроизведение: bool,
    pub цикл: bool,
}

/// ЯБЛОЧКО: физика
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ФизикаКомпонент {
    pub тип_тела: ТипТела,
    pub масса: f32,
    pub упругость: f32,
    pub трение: f32,
    pub кинематический: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ТипТела {
    Статичный,
    Динамичный,
    Кинематичный,
}

/// ПОЛЕ: скриптовая логика
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ЛогикаКомпонент {
    pub скрипт_id: Uuid,
    pub параметры: std::collections::HashMap<String, String>,
}

/// ПОЛЕ: NPC-данные
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct НПСКомпонент {
    pub тип_нпс: String,         // "NPC_Citizen", "NPC_Guard", и т.д.
    pub точки_спавна: Vec<Vec3>,
    pub поведение_id: Uuid,      // Blueprint поведения
    pub активен: bool,
}
