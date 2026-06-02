# fix1_straNNo_nazrOS — Что изменилось

## Фиксы CORE
- `нзр.rs` → переименован в `nzr.rs` + `#[path]` атрибут в mod.rs
- borrow-checker в `scene/mod.rs` (привязать функция)
- serde деривы на SceneGraph, Node, Transform3D
- убраны [[bench]] и [profile.*] из src/core/Cargo.toml
- profiles перенесены в workspace Cargo.toml

## Новое
- Полный парсер .нзр (TLV + zstd + CRC32 + метаданные)
- Tauri UI оболочка:
  - TopBar (16 модулей, статус ядра, память, пользователь)
  - StatusBar (полигоны, FPS, autosave)
  - WorkspaceArea (роутер модулей)
  - МодульРуки (3 панели: инструменты, viewport, свойства)
  - appStore (Zustand)

## Применить
```bash
# В Codespace — просто распаковать архив поверх репо
unzip -o fix1_straNNo_nazrOS.zip -d .
git add .
git commit -m "fix: полный накат fix1 — парсер .нзр + Tauri UI"
git push origin dev
```
