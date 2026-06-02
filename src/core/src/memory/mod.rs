//! Менеджер памяти nazrOS (заглушка v0.1)
//!
//! Полная реализация — Фаза 1, после базового рендера.

pub struct MemoryManager {
    использовано_мб: u64,
    всего_мб: u64,
}

impl MemoryManager {
    pub fn новый() -> Self {
        Self {
            использовано_мб: 0,
            всего_мб: 0,
        }
    }

    pub fn использовано_мб(&self) -> u64 {
        self.использовано_мб
    }
    pub fn всего_мб(&self) -> u64 {
        self.всего_мб
    }

    pub fn процент_использования(&self) -> f32 {
        if self.всего_мб == 0 {
            return 0.0;
        }
        (self.использовано_мб as f32 / self.всего_мб as f32) * 100.0
    }
}

impl Default for MemoryManager {
    fn default() -> Self {
        Self::новый()
    }
}
