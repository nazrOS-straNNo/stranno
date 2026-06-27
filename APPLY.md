# fix6_straNNo_nazrOS — Инструкция применения

## Что добавляется

### Новые модули
- МодульЛавка — маркетплейс (витрина, корзина, фильтры, продажи)
- МодульКлуб — комьюнити (лента, посты, лайки, события, участники)

### Авторизация
- СтраницаВхода.tsx + .module.css — экран логина/регистрации
- App.tsx обновлён — показывает СтраницаВхода если не авторизован

### Тема
- theme-light.css — светлая тема через [data-тема="светлая"]
- TopBar — кнопка переключения темы 🌙/☀️

### Zoom UI
- TopBar — кнопки −/100%/+ для масштаба интерфейса
- WorkspaceArea — обработка Ctrl++/- /0 для масштаба

### appStore обновлён
- Добавлены: тема, авторизован, переключитьТему, войти, выйти

## Файлы для добавления на GitHub

### НОВЫЕ
- src/ui/src/components/modules/МодульЛавка.tsx
- src/ui/src/components/modules/МодульЛавка.module.css
- src/ui/src/components/modules/МодульКлуб.tsx
- src/ui/src/components/modules/МодульКлуб.module.css
- src/ui/src/components/auth/СтраницаВхода.tsx
- src/ui/src/components/auth/СтраницаВхода.module.css
- src/ui/src/styles/theme-light.css

### ЗАМЕНИТЬ
- src/ui/src/App.tsx
- src/ui/src/store/appStore.ts
- src/ui/src/components/layout/WorkspaceArea.tsx
- src/ui/src/components/layout/TopBar.tsx

### ДОБАВИТЬ В КОНЕЦ существующего файла
- src/ui/src/components/layout/TopBar.module.css
  → вставить содержимое TopBar-additions.module.css в конец файла

## После применения

Теперь все 12 модулей живые:
РУКИ, МУЛЬТ, ЯБЛОЧКО, ТОЧКИ, ГЛЮК, СТУДИЯ, ПОЛЕ, ШИНА, КОЛОДЕЦ, БИБЛИОТЕКА, ЛАВКА, КЛУБ

Плюс:
- Логин-экран перед входом в приложение
- Светлая/тёмная тема
- Масштаб UI через кнопки или Ctrl+/-
- Горячие клавиши работают везде (1-0, Tab, ?, Ctrl+S/Z/Y)
