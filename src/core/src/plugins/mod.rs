//! Реестр модулей nazrOS (заглушка v0.1)
//!
//! Полная реализация с dylib загрузкой — Фаза 2.

use crate::events::IdМодуля;
use std::collections::HashMap;

/// Манифест модуля — метаданные при регистрации
#[derive(Debug, Clone)]
pub struct МанифестМодуля {
    pub id: IdМодуля,
    pub версия: String,
    pub версия_api: u32,
    pub описание: String,
}

/// Реестр зарегистрированных модулей
#[derive(Debug, Default)]
pub struct PluginRegistry {
    модули: HashMap<String, МанифестМодуля>,
}

impl PluginRegistry {
    pub fn новый() -> Self {
        Self::default()
    }

    /// Зарегистрировать модуль
    pub fn зарегистрировать(
        &mut self, манифест: МанифестМодуля
    ) {
        let ключ = манифест.id.to_string();
        self.модули.insert(ключ, манифест);
    }

    /// Список зарегистрированных модулей
    pub fn список(&self) -> Vec<&МанифестМодуля> {
        self.модули.values().collect()
    }

    /// Проверить наличие модуля
    pub fn есть(&self, id: &IdМодуля) -> bool {
        self.модули.contains_key(&id.to_string())
    }
}
