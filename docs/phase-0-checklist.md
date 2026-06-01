# СТРАННО — Чеклист Фазы 0

## Организационное

- [ ] Зарегистрировать юрлицо (ООО / Ltd)
- [ ] Открыть корпоративный банковский счёт
- [ ] Зарегистрировать торговую марку СТРАННО (ЕАПО)
- [ ] Зарегистрировать торговую марку nazrOS (ЕАПО)
- [ ] Подписать NDA + IP-соглашения с командой
- [ ] Настроить корпоративную почту (@nazros.io или аналог)

## Домен и бренд

- [ ] Зарегистрировать домен (stranno.io / nazros.io)
- [ ] Настроить Cloudflare для DNS + защиты
- [ ] Создать GitHub Organization `nazrOS`
- [ ] Создать репозитории (stranno-core, stranno-modules, stranno-ui, ...)

## Репозиторий (этот архив — старт)

- [x] README.md с описанием проекта
- [x] .gitignore
- [x] Workspace Cargo.toml (Rust)
- [x] src/ui/package.json (Tauri/React)
- [x] .github/workflows/ci.yml (CI/CD)
- [x] docs/adr/ADR-0001 — выбор языка
- [x] docs/adr/ADR-0002 — десктопный shell
- [x] docs/adr/ADR-0003 — форматы файлов
- [x] docs/core-architecture.md
- [x] src/core/ — nazrOS CORE v0.1 (Scene Graph, Events, Undo/Redo, Formats)
- [x] src/ui/tokens.css — Design System токены
- [x] src/infra/README.md

## Инфраструктура

- [ ] Создать Hetzner Cloud аккаунт
- [ ] Поднять k3s кластер (3 ноды)
- [ ] Настроить RunPod для GPU рендера
- [ ] Подключить Backblaze B2 (object storage)
- [ ] Настроить Neon PostgreSQL
- [ ] Настроить Infisical для секретов
- [ ] Подключить Grafana Cloud (мониторинг)

## Команда

- [ ] Tech Lead / Архитектор — 1
- [ ] Rust/C++ инженер (ядро) — 2
- [ ] Graphics Engineer (GPU/рендер) — 2
- [ ] Full-stack (React + Rust) — 2
- [ ] UI/UX дизайнер — 1
- [ ] DevOps/SRE — 1
- [ ] Product Manager — 1

## Следующий этап (Фаза 1 — nazrOS CORE)

После завершения Фазы 0:
1. Полный парсер `.нзр` (TLV-секции, сжатие zstd)
2. GPU Memory Manager (wgpu / Vulkan)
3. Plugin Registry с dylib загрузкой
4. Базовый Tauri-проект с главным окном СТРАННО
5. Первый viewport-заглушка (РУКИ)
