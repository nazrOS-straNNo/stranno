//! Трансформация объекта в 3D-пространстве

use glam::{Mat4, Quat, Vec3};

/// Позиция, поворот и масштаб объекта в пространстве.
///
/// Соответствует панели "ТРАНСФОРМАЦИЯ" в UI СТРАННО
/// (поля X/Y/Z для позиции, поворота, масштаба).
#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct Transform3D {
    /// Позиция в мировых единицах
    pub позиция: Vec3,
    /// Поворот (кватернион, конвертируется в градусы для UI)
    pub поворот: Quat,
    /// Масштаб (1.0 = нормальный)
    pub масштаб: Vec3,
}

impl Default for Transform3D {
    fn default() -> Self {
        Self {
            позиция: Vec3::ZERO,
            поворот: Quat::IDENTITY,
            масштаб: Vec3::ONE,
        }
    }
}

impl Transform3D {
    /// Создать трансформацию из позиции
    pub fn из_позиции(x: f32, y: f32, z: f32) -> Self {
        Self {
            позиция: Vec3::new(x, y, z),
            ..Default::default()
        }
    }

    /// Создать трансформацию из позиции и поворота по осям (в градусах)
    pub fn из_позиции_и_поворота(
        pos: Vec3,
        rx_градусы: f32,
        ry_градусы: f32,
        rz_градусы: f32,
    ) -> Self {
        let поворот = Quat::from_euler(
            glam::EulerRot::XYZ,
            rx_градусы.to_radians(),
            ry_градусы.to_radians(),
            rz_градусы.to_radians(),
        );
        Self {
            позиция: pos,
            поворот,
            масштаб: Vec3::ONE,
        }
    }

    /// Матрица 4×4 (для GPU / рендера)
    pub fn матрица(&self) -> Mat4 {
        Mat4::from_scale_rotation_translation(self.масштаб, self.поворот, self.позиция)
    }

    /// Поворот в углах Эйлера (градусы) — для отображения в UI
    pub fn поворот_эйлер_градусы(&self) -> Vec3 {
        let (rx, ry, rz) = self.поворот.to_euler(glam::EulerRot::XYZ);
        Vec3::new(rx.to_degrees(), ry.to_degrees(), rz.to_degrees())
    }

    /// Установить поворот из углов Эйлера (градусы) — из UI
    pub fn установить_поворот_эйлер(&mut self, rx: f32, ry: f32, rz: f32) {
        self.поворот = Quat::from_euler(
            glam::EulerRot::XYZ,
            rx.to_radians(),
            ry.to_radians(),
            rz.to_radians(),
        );
    }

    /// Применить к другой трансформации (для локальных координат)
    pub fn применить_к(&self, дочерний: &Transform3D) -> Transform3D {
        Transform3D {
            позиция: self.позиция + self.поворот * (self.масштаб * дочерний.позиция),
            поворот: self.поворот * дочерний.поворот,
            масштаб: self.масштаб * дочерний.масштаб,
        }
    }

    /// Является ли трансформация единичной (объект не перемещён/повёрнут/масштабирован)
    pub fn единичная(&self) -> bool {
        self.позиция == Vec3::ZERO && self.поворот == Quat::IDENTITY && self.масштаб == Vec3::ONE
    }
}

impl std::fmt::Display for Transform3D {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let (rx, ry, rz) = self.поворот.to_euler(glam::EulerRot::XYZ);
        write!(
            f,
            "pos({:.3}, {:.3}, {:.3}) rot({:.1}°, {:.1}°, {:.1}°) scale({:.3}, {:.3}, {:.3})",
            self.позиция.x,
            self.позиция.y,
            self.позиция.z,
            rx.to_degrees(),
            ry.to_degrees(),
            rz.to_degrees(),
            self.масштаб.x,
            self.масштаб.y,
            self.масштаб.z,
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn единичная_трансформация_по_умолчанию() {
        let т = Transform3D::default();
        assert!(т.единичная());
    }

    #[test]
    fn матрица_единичной_трансформации_равна_identity() {
        let т = Transform3D::default();
        let м = т.матрица();
        assert!((м - Mat4::IDENTITY).abs_diff_eq(Mat4::ZERO, 1e-6));
    }

    #[test]
    fn поворот_туда_и_обратно() {
        let mut т = Transform3D::default();
        т.установить_поворот_эйлер(45.0, -30.0, 90.0);
        let угол = т.поворот_эйлер_градусы();
        assert!((угол.x - 45.0).abs() < 0.01);
        assert!((угол.y + 30.0).abs() < 0.01);
        assert!((угол.z - 90.0).abs() < 0.01);
    }
}
