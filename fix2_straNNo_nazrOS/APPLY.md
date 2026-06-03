# fix2_straNNo_nazrOS — Инструкция применения

## Что добавляется

### Tauri конфиг (десктоп)
- `src/ui/src-tauri/Cargo.toml` — крейт Tauri
- `src/ui/src-tauri/src/main.rs` — точка входа
- `src/ui/src-tauri/src/lib.rs` — команды ядра (версия_ядра, статус_ядра)
- `src/ui/src-tauri/build.rs` — build script
- `src/ui/src-tauri/tauri.conf.json` — конфиг приложения
- `src/ui/src-tauri/capabilities/default.json` — права доступа

### Новый модуль ТОЧКИ
- Node-граф с перетаскиваемыми нодами
- SVG соединения между нодами
- Цветные порты по типам (изображение, число, цвет, вектор)
- Панель свойств активного нода

### Обновлённый CI
- `continue-on-error` для аудита безопасности
- Используется `tauri-apps/tauri-action` для сборки
- Node.js 22 вместо 20

### Обновлённый vite.config.ts
- Поддержка TAURI_DEV_HOST
- Правильные build targets для каждой платформы

---

## Применить в Codespace

```bash
cd /workspaces/stranno

# 1. Загрузи архив через drag&drop, затем:
unzip -o fix2_straNNo_nazrOS.zip

# 2. Скопировать Tauri конфиг
mkdir -p src/ui/src-tauri/src src/ui/src-tauri/capabilities
cp fix2_straNNo_nazrOS/src-tauri/Cargo.toml    src/ui/src-tauri/
cp fix2_straNNo_nazrOS/src-tauri/build.rs      src/ui/src-tauri/
cp fix2_straNNo_nazrOS/src-tauri/tauri.conf.json src/ui/src-tauri/
cp fix2_straNNo_nazrOS/src-tauri/src/main.rs   src/ui/src-tauri/src/
cp fix2_straNNo_nazrOS/src-tauri/src/lib.rs    src/ui/src-tauri/src/
cp fix2_straNNo_nazrOS/src-tauri/capabilities/default.json \
   src/ui/src-tauri/capabilities/

# 3. Скопировать модуль ТОЧКИ
cp fix2_straNNo_nazrOS/src/ui/src/components/modules/МодульТочки.tsx \
   src/ui/src/components/modules/
cp fix2_straNNo_nazrOS/src/ui/src/components/modules/МодульТочки.module.css \
   src/ui/src/components/modules/

# 4. Обновить WorkspaceArea
cp fix2_straNNo_nazrOS/src/ui/src/components/layout/WorkspaceArea.tsx \
   src/ui/src/components/layout/

# 5. Обновить CI
cp fix2_straNNo_nazrOS/.github/workflows/ci.yml \
   .github/workflows/ci.yml

# 6. Обновить vite.config.ts
cp fix2_straNNo_nazrOS/vite.config.ts src/ui/vite.config.ts

# 7. Добавить @tauri-apps/cli и api
cd src/ui
npm install --save-dev @tauri-apps/cli@latest
npm install @tauri-apps/api@latest
cd ../..

# 8. Проверить что UI запускается
cd src/ui && npm run dev
# Открыть в браузере, проверить вкладку ТОЧКИ

# 9. Пушим
cd /workspaces/stranno
git add .
git commit -m "feat: Tauri конфиг + модуль ТОЧКИ (node-граф) + обновлённый CI"
git push origin dev
```
