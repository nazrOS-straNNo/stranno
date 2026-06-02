//! Граф сцены nazrOS
//!
//! Дерево узлов (Node), описывающих мир.
//! Это основная структура данных всей платформы СТРАННО.

use std::collections::HashMap;
use uuid::Uuid;

use crate::error::CoreError;

pub mod component;
pub mod node;
pub mod transform;

pub use component::Component;
pub use node::Node;
pub use transform::Transform3D;

/// Граф сцены — центральное дерево объектов.
///
/// Все модули (РУКИ, МУЛЬТ, ПОЛЕ и т.д.) работают
/// с объектами через этот граф.
#[derive(Debug, Default, serde::Serialize, serde::Deserialize)]
pub struct SceneGraph {
    /// Все узлы по UUID
    узлы: HashMap<Uuid, Node>,
    /// Корневые узлы (без родителя)
    корни: Vec<Uuid>,
    /// Имя сцены
    pub имя: String,
}

impl SceneGraph {
    /// Создать пустой граф
    pub fn новый() -> Self {
        Self {
            узлы: HashMap::new(),
            корни: Vec::new(),
            имя: String::from("Без названия"),
        }
    }

    /// Добавить узел в сцену
    pub fn добавить(&mut self, узел: Node) -> Uuid {
        let id = узел.id;
        if узел.родитель.is_none() {
            self.корни.push(id);
        }
        self.узлы.insert(id, узел);
        id
    }

    /// Получить узел по UUID
    pub fn получить(&self, id: Uuid) -> Option<&Node> {
        self.узлы.get(&id)
    }

    /// Получить мутабельный узел
    pub fn получить_мут(&mut self, id: Uuid) -> Option<&mut Node> {
        self.узлы.get_mut(&id)
    }

    /// Удалить узел (и всех его потомков)
    pub fn удалить(&mut self, id: Uuid) -> Result<(), CoreError> {
        let узел = self.узлы.get(&id).ok_or(CoreError::УзелНеНайден(id))?;

        // Собрать всех потомков
        let потомки: Vec<Uuid> = узел.дети.clone();

        // Удалить из корней если нужно
        self.корни.retain(|&r| r != id);

        // Убрать из родителя
        if let Some(родитель_id) = узел.родитель {
            if let Some(родитель) = self.узлы.get_mut(&родитель_id) {
                родитель.дети.retain(|&c| c != id);
            }
        }

        // Удалить узел
        self.узлы.remove(&id);

        // Рекурсивно удалить потомков
        for потомок_id in потомки {
            self.удалить(потомок_id)?;
        }

        Ok(())
    }

    /// Привязать узел к родителю
    pub fn привязать(
        &mut self, дочерний: Uuid, родитель: Uuid
    ) -> Result<(), CoreError> {
        if !self.узлы.contains_key(&родитель) {
            return Err(CoreError::УзелНеНайден(родитель));
        }
        if !self.узлы.contains_key(&дочерний) {
            return Err(CoreError::УзелНеНайден(дочерний));
        }

        // Читаем старого родителя до мутабельных операций
        let старый_родитель = self.узлы[&дочерний].родитель;

        // Убрать из старого родителя / корней
        if let Some(ст_р) = старый_родитель {
            if let Some(р) = self.узлы.get_mut(&ст_р) {
                р.дети.retain(|&c| c != дочерний);
            }
        } else {
            self.корни.retain(|&r| r != дочерний);
        }

        // Установить нового родителя
        self.узлы.get_mut(&дочерний).unwrap().родитель = Some(родитель);

        // Добавить в дети нового родителя
        self.узлы.get_mut(&родитель).unwrap().дети.push(дочерний);

        Ok(())
    }

    /// Количество узлов в сцене
    pub fn количество_узлов(&self) -> usize {
        self.узлы.len()
    }

    /// Итератор по всем узлам
    pub fn все_узлы(&self) -> impl Iterator<Item = &Node> {
        self.узлы.values()
    }

    /// Корневые узлы сцены
    pub fn корневые_узлы(&self) -> Vec<&Node> {
        self.корни
            .iter()
            .filter_map(|id| self.узлы.get(id))
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn добавить_и_получить_узел() {
        let mut граф = SceneGraph::новый();
        let узел = Node::новый("тест".to_string());
        let id = граф.добавить(узел);

        let найденный = граф.получить(id);
        assert!(найденный.is_some());
        assert_eq!(найденный.unwrap().имя, "тест");
    }

    #[test]
    fn удалить_узел() {
        let mut граф = SceneGraph::новый();
        let узел = Node::новый("удаляемый".to_string());
        let id = граф.добавить(узел);

        граф.удалить(id).unwrap();
        assert!(граф.получить(id).is_none());
        assert_eq!(граф.количество_узлов(), 0);
    }

    #[test]
    fn привязать_к_родителю() {
        let mut граф = SceneGraph::новый();
        let родитель_id = граф.добавить(Node::новый("родитель".to_string()));
        let дочерний_id = граф.добавить(Node::новый("дочерний".to_string()));

        граф.привязать(дочерний_id, родитель_id).unwrap();

        let родитель = граф.получить(родитель_id).unwrap();
        assert!(родитель.дети.contains(&дочерний_id));

        let дочерний = граф.получить(дочерний_id).unwrap();
        assert_eq!(дочерний.родитель, Some(родитель_id));
    }
}
