# nazrOS — Инфраструктура

## Текущая конфигурация (Фаза 0 — старт)

### Облачные провайдеры

| Сервис | Провайдер | Назначение |
|--------|-----------|-----------|
| Compute (CPU) | Hetzner Cloud | API, бэкенд, очереди |
| Compute (GPU) | RunPod | Рендер-ферма (pay-per-use) |
| CDN | Cloudflare | Дистрибуция ассетов, защита |
| Object Storage | Backblaze B2 | Файлы сцен (.нзр), ассеты |
| Database | Neon (Postgres) | Метаданные, пользователи |
| Secrets | Infisical | Секреты и env-переменные |
| Monitoring | Grafana Cloud | Метрики, логи, алерты |

### Kubernetes

Кластер: Hetzner k3s (3 ноды для старта)
- `nazros-api` — бэкенд API (Rust/Axum)
- `nazros-worker` — воркеры задач
- `nazros-render-proxy` — прокси к GPU-ферме

### Terraform

```bash
cd src/infra/terraform
terraform init
terraform plan -var-file="env/staging.tfvars"
terraform apply
```

### GPU-рендеринг

Старт: RunPod Serverless
- Образ: `nazros/render-worker:latest`
- VRAM минимум: 16 GB (RTX 3090 / A5000)
- Биллинг: $0.0002/GPU-сек

## Дорожная карта инфраструктуры

```
Фаза 0  [сейчас]   Hetzner + RunPod + Cloudflare (облако, аренда)
Фаза 1  [год 1]    Масштабирование k8s, добавить регионы EU/US
Фаза 2  [год 2]    Hetzner Dedicated GPU (постоянная нагрузка дешевле)
Фаза 3  [год 3]    Colocation — своё железо в стороннем ЦОД (Tier 3)
Фаза 4  [год 4+]   Мультирегиональная ферма (EU + Asia + US)
```

## Требования к ЦОД (когда придёт время)

При выходе на ~500 GPU-часов/день стабильно:
- Tier 3 ЦОД (99.982% uptime)
- Зелёная энергетика (важно для бренда)
- Пиринг с крупными CDN
- Минимум 2 независимых канала связи
- ИБП + дизель-генератор
- Физическая охрана
