//! Узел графа сцены nazrOS

use super::component::Component;
use super::transform::Transform3D;
use uuid::Uuid;

/// Узел сцены — базовая единица графа.
///
/// Каждый объект в сцене (меш, камера, свет, аудио-источник и т.д.)
/// — это узел с набором компонентов.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Node {
    /// Уникальный идентификатор
    pub id: Uuid,
    /// Имя объекта (например "голова_мейн", "кабель_система")
    pub имя: String,
    /// UUID родительского узла
    pub родитель: Option<Uuid>,
    /// UUID дочерних узлов
    pub дети: Vec<Uuid>,
    /// Позиция, поворот, масштаб в пространстве
    pub трансформ: Transform3D,
    /// Компоненты (данные модулей)
    pub компоненты: Vec<Component>,
    /// Слой ("персонаж", "декорации", "свет" и т.д.)
    pub слой: String,
    /// Видимость в сцене
    pub видимый: bool,
    /// Блокировка (нельзя выделить/изменить в UI)
    pub заблокирован: bool,
    /// Теги для поиска и фильтрации
    pub теги: Vec<String>,
}

impl Node {
    /// Создать новый узел с именем
    pub fn новый(имя: String) -> Self {
        Self {
            id: Uuid::new_v4(),
            имя,
            родитель: None,
            дети: Vec::new(),
            трансформ: Transform3D::default(),
            компоненты: Vec::new(),
            слой: String::from("по умолчанию"),
            видимый: true,
            заблокирован: false,
            теги: Vec::new(),
        }
    }

    /// Создать узел с заданным UUID (при загрузке из файла)
    pub fn с_id(id: Uuid, имя: String) -> Self {
        Self {
            id,
            имя,
            ..Self::новый(String::new())
        }
    }

    /// Добавить компонент к узлу
    pub fn добавить_компонент(&mut self, компонент: Component) {
        self.компоненты.push(компонент);
    }

    /// Получить компонент по типу (первый совпадающий)
    pub fn компонент<T: 'static>(&self) -> Option<&Component> {
        self.компоненты.iter().find(|c| c.тип_совпадает::<T>())
    }

    /// Удалить компоненты заданного типа
    pub fn удалить_компонент<T: 'static>(&mut self) {
        self.компоненты.retain(|c| !c.тип_совпадает::<T>());
    }

    /// Является ли узел корневым (нет родителя)
    pub fn корневой(&self) -> bool {
        self.родитель.is_none()
    }

    /// Добавить тег
    pub fn добавить_тег(&mut self, тег: impl Into<String>) {
        let тег = тег.into();
        if !self.теги.contains(&тег) {
            self.теги.push(тег);
        }
    }
}

impl std::fmt::Display for Node {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Node({}, \"{}\")", self.id, self.имя)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn новый_узел_видимый_и_не_заблокирован() {
        let узел = Node::новый("тест".to_string());
        assert!(узел.видимый);
        assert!(!узел.заблокирован);
        assert!(узел.корневой());
    }

    #[test]
    fn теги_без_дублей() {
        let mut узел = Node::новый("тест".to_string());
        узел.добавить_тег("персонаж");
        узел.добавить_тег("персонаж");
        assert_eq!(узел.теги.len(), 1);
    }
}
