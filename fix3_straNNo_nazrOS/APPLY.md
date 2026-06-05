# fix3_straNNo_nazrOS — Инструкция применения

## Что добавляется

- МодульСтудия (виртуальный павильон, таймлайн, камеры, дубли, цветокоррекция)
- МодульШина (DAW: треки, синтезатор, микшер, волновые формы)
- Обновлённый WorkspaceArea (подключены все 4 модуля)

## Применить в Codespace

```bash
cd /workspaces/stranno

unzip -o fix3_straNNo_nazrOS.zip

# Скопировать модули (используй find из-за кириллики)
find fix3_straNNo_nazrOS -name "МодульСтудия*" | while read f; do
  cp "$f" src/ui/src/components/modules/
done

find fix3_straNNo_nazrOS -name "МодульШина*" | while read f; do
  cp "$f" src/ui/src/components/modules/
done

cp fix3_straNNo_nazrOS/src/ui/src/components/layout/WorkspaceArea.tsx \
   src/ui/src/components/layout/

# Проверить
cd src/ui && npm run dev

# Пушим
cd /workspaces/stranno
git add .
git commit -m "feat: модули СТУДИЯ + ШИНА (DAW)"
git push origin dev
```
