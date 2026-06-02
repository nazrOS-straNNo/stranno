# nazrOS CORE — Архитектура ядра

**Версия**: 0.1  
**Статус**: Проектирование

---

## Обзор

nazrOS CORE — центральная шина и граф сцены, через которую взаимодействуют
все модули СТРАННО. Ни один модуль не обращается к другому напрямую —
только через CORE.

```
┌─────────────────────────────────────────────────────────┐
│                      nazrOS CORE                        │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Scene   │  │  Event   │  │    Memory Manager    │  │
│  │  Graph   │  │   Bus    │  │    (GPU / CPU)       │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Undo/    │  │  Plugin  │  │    File I/O          │  │
│  │ Redo     │  │ Registry │  │    (.нзр и др.)      │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
        ↑              ↑              ↑              ↑
     РУКИ           МУЛЬТ          ТОЧКИ          ШИНА
   (модуль)       (модуль)       (модуль)       (модуль)
```

---

## Компоненты CORE

### 1. Scene Graph (Граф сцены)

Дерево узлов, описывающих мир.

```
Узел (Node) {
    uuid:        UUID             // уникальный ID
    name:        String           // имя (например "голова_мейн")
    parent:      Option<UUID>     // родитель
    children:    Vec<UUID>        // дети
    transform:   Transform3D      // позиция, поворот, масштаб
    components:  Vec<Component>   // прикреплённые компоненты
    layer:       String           // слой ("персонаж", "декорации" и т.д.)
    visible:     bool
    locked:      bool
}

Transform3D {
    position:  Vec3   // x, y, z
    rotation:  Quat   // кватернион
    scale:     Vec3   // x, y, z
}
```

Компоненты (Component) — данные модулей, прикреплённые к узлу:
- `MeshComponent` — геометрия (РУКИ)
- `AnimationComponent` — анимация (МУЛЬТ)
- `PhysicsComponent` — физика (ЯБЛОЧКО)
- `LightComponent` — свет (СТУДИЯ)
- `CameraComponent` — камера (СТУДИЯ)
- `AudioComponent` — звук (ШИНА)
- `ScriptComponent` — логика (ПОЛЕ)

---

### 2. Event Bus (Шина событий)

Publish/subscribe система. Модули публикуют события — другие подписываются.

```
Событие (Event) {
    id:        UUID
    timestamp: u64         // микросекунды
    source:    ModuleId    // кто отправил
    kind:      EventKind   // тип события
    payload:   Bytes       // данные (сериализованные)
}

EventKind:
    НодДобавлен(UUID)
    НодУдалён(UUID)
    НодИзменён { uuid: UUID, поле: String }
    КомпонентИзменён { нод: UUID, тип: ComponentType }
    СохранитьСцену
    ЗагрузитьСцену(PathBuf)
    ОтправитьВРендер(RenderJob)
    АудиоСобытие(AudioEvent)
    ...
```

---

### 3. Undo/Redo (История действий)

Command Pattern. Каждое действие — команда с методами `выполнить()` и `отменить()`.

```rust
trait Команда {
    fn выполнить(&mut self, граф: &mut SceneGraph) -> Result<()>;
    fn отменить(&mut self, граф: &mut SceneGraph) -> Result<()>;
    fn описание(&self) -> &str;
}

// Стек: до 500 команд по умолчанию (настраивается)
struct ИсторияДействий {
    стек_отмены: Vec<Box<dyn Команда>>,
    стек_повтора: Vec<Box<dyn Команда>>,
    лимит: usize,
}
```

---

### 4. Memory Manager

Управляет GPU и CPU буферами через модули.

- Выделяет VRAM для мешей, текстур, буферов рендера
- LRU-кэш: выгружает неиспользуемые ресурсы
- Стриминг больших ассетов по требованию
- Отображается в статус-баре ("память мира 72%")

---

### 5. Plugin Registry (Реестр модулей)

Модули загружаются как динамические библиотеки (`.so` / `.dll` / `.dylib`).

```
ModuleManifest {
    id:         ModuleId      // "руки", "мульт", "шина" и т.д.
    version:    SemVer
    api_version: u32          // версия CORE API
    entry:      Symbol        // точка входа
    событий:    Vec<EventKind> // на что подписывается
}
```

---

### 6. File I/O

Чтение/запись форматов nazrOS (`.нзр`, `.звк`, `.эфф` и др.)
+ конвертеры из/в индустриальные форматы:
- Импорт: GLTF 2.0, FBX, OBJ, Alembic, USD
- Экспорт: GLTF, FBX, EXR (изображения), WAV/FLAC (аудио)

Автосохранение: каждые N минут (настраивается, по умолчанию 5 мин).

---

## Структура кода (src/core/)

```
src/core/
├── lib.rs                    # публичный API ядра
├── scene/
│   ├── mod.rs
│   ├── graph.rs              # Scene Graph
│   ├── node.rs               # Node + Component
│   └── transform.rs          # Transform3D
├── events/
│   ├── mod.rs
│   ├── bus.rs                # Event Bus
│   └── kinds.rs              # EventKind enum
├── history/
│   ├── mod.rs
│   ├── команда.rs            # trait Команда
│   └── история.rs            # ИсторияДействий
├── memory/
│   ├── mod.rs
│   └── manager.rs            # Memory Manager
├── plugins/
│   ├── mod.rs
│   └── registry.rs           # Plugin Registry
└── formats/
    ├── mod.rs
    ├── нзр.rs                # .нзр parser/writer
    ├── звк.rs                # .звк parser/writer
    └── convert/
        ├── gltf.rs
        ├── fbx.rs
        └── alembic.rs
```

---

## Порядок реализации CORE

```
Этап 1  Node + Transform3D (базовые типы)
Этап 2  Scene Graph (CRUD операции с деревом)
Этап 3  Event Bus (pub/sub, синхронный для начала)
Этап 4  Undo/Redo (trait Команда + история)
Этап 5  File I/O — .нзр v0.1 (только Scene Graph)
Этап 6  Memory Manager (базовый, без GPU)
Этап 7  Plugin Registry (загрузка dylib)
Этап 8  Первый модуль-заглушка (РУКИ) через Plugin Registry
```
