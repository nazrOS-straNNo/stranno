//! nazrOS CORE — ядро платформы СТРАННО
//!
//! Центральная шина и граф сцены, через которую взаимодействуют
//! все модули: РУКИ, МУЛЬТ, ТОЧКИ, СТУДИЯ, ПОЛЕ, ШИНА, ГЛЮК...

#![forbid(unsafe_code)] // безопасность по умолчанию
#![warn(missing_docs)]
#![warn(clippy::all)]
#![allow(non_ascii_idents)] // разрешить кириллические идентификаторы

pub mod error;
pub mod events;
pub mod formats;
pub mod history;
pub mod memory;
pub mod plugins;
pub mod scene;

// Публичный пре-импорт для удобства
pub use error::CoreError;
pub use events::{Event, EventBus, EventKind};
pub use history::{ИсторияДействий, Команда};
pub use scene::{Component, Node, SceneGraph, Transform3D};

use tracing::info;

/// Версия nazrOS CORE API.
/// Модули проверяют совместимость при загрузке.
pub const CORE_API_VERSION: u32 = 1;

/// Версия платформы СТРАННО
pub const STRANNO_VERSION: &str = env!("CARGO_PKG_VERSION");

/// Главная точка входа — экземпляр ядра.
///
/// Создаётся один раз при запуске приложения.
/// Все модули получают ссылку на это ядро.
pub struct НазрОСCore {
    /// Граф сцены — дерево всех объектов
    pub граф: SceneGraph,
    /// Шина событий
    pub шина: EventBus,
    /// История действий (undo/redo)
    pub история: ИсторияДействий,
}

impl НазрОСCore {
    /// Создать новое ядро с пустой сценой
    pub fn новое() -> Self {
        info!("nazrOS CORE v{} инициализирован", STRANNO_VERSION);
        Self {
            граф: SceneGraph::новый(),
            шина: EventBus::новая(),
            история: ИсторияДействий::новая(500), // 500 уровней отмены
        }
    }

    /// Версия API ядра
    pub fn версия_api(&self) -> u32 {
        CORE_API_VERSION
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ядро_создаётся() {
        let ядро = НазрОСCore::новое();
        assert_eq!(ядро.версия_api(), CORE_API_VERSION);
    }
}
