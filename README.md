# RenderMeter

Инструмент для честного сравнения серверных шаблонизаторов Node.js по скорости рендеринга и стабильности под нагрузкой.

Поддерживаемые движки: **Handlebars**, **Mustache**, **Pug**, **EJS**

---

## Содержание

- [Что делает приложение](#что-делает-приложение)
- [Архитектура](#архитектура)
  - [Клиент](#клиент)
  - [Сервер](#сервер)
- [Как работают замеры](#как-работают-замеры)
  - [Benchmark — сравнение движков](#benchmark--сравнение-движков)
  - [Playground — одиночный рендер](#playground--одиночный-рендер)
- [API](#api)
- [Быстрый запуск](#быстрый-запуск)

---

## Что делает приложение

RenderMeter запускает одинаковые тесты для четырёх шаблонизаторов, каждый из которых получает одни и те же данные и выполняет одну задачу — сгенерировать HTML. Приложение измеряет время выполнения и отображает сравнительную статистику.

Два режима работы:
- **Benchmark** — сравнивает несколько движков на стандартных сценариях с разным объёмом данных
- **Playground** — позволяет написать свой шаблон и тут же измерить время его рендеринга

---

## Архитектура

```
RenderMeter/
├── client/          # React + TypeScript (Vite)
└── server/          # Express + TypeScript (Node.js)
```

### Клиент

```
client/src/
├── features/
│   ├── benchmark/           # Страница сравнения движков
│   │   ├── BenchmarkPage.tsx
│   │   ├── api.ts
│   │   └── components/
│   │       ├── BarChart/         # Визуализация результатов
│   │       ├── ComparisonTable/  # Таблица со статистикой
│   │       ├── EngineMultiSelect/ # Выбор движков
│   │       ├── ScenarioDataViewer/ # Просмотр тестовых данных
│   │       ├── ScenarioSelector/ # Выбор сложности
│   │       ├── SummaryBlock/     # Краткий итог
│   │       └── TemplateViewer/   # Просмотр шаблонов
│   ├── playground/          # Страница с редактором шаблонов
│   │   ├── PlaygroundPage.tsx
│   │   ├── api.ts
│   │   └── components/
│   │       ├── BenchmarkRunner/  # Запуск замера
│   │       ├── EditorTabs/       # Вкладки редактора
│   │       ├── EngineSelector/   # Выбор движка
│   │       ├── HistoryList/      # История запусков
│   │       ├── PreviewPanel/     # HTML-превью
│   │       └── TemplateEditor/   # Monaco Editor
│   └── docs/                # Документация
├── shared/
│   ├── api/axios.ts         # Настроенный Axios-инстанс
│   ├── components/          # ErrorBoundary, Sidebar, LangSwitcher
│   ├── constants/           # engines, scenarios
│   └── types/index.ts       # Общие TypeScript-типы
└── i18n/                    # Локализация (ru, en, fr)
```

**Стек:** React 18, React Router, TanStack Query, Monaco Editor, i18next, Axios, Vite

TanStack Query используется для кэширования запросов и управления состоянием загрузки — каждый результат бенчмарка сохраняется в кэше и не запрашивается повторно при возврате на страницу.

### Сервер

```
server/src/
├── app.ts               # Express-приложение, подключение роутов
├── server.ts            # Точка входа, подключение к MongoDB
├── config/db.ts         # Настройка Mongoose
├── routes/              # Маршруты
│   ├── benchmark.routes.ts
│   ├── render.routes.ts
│   ├── results.routes.ts
│   └── health.routes.ts
├── controllers/         # Валидация запроса → вызов сервиса → ответ
│   ├── benchmark.controller.ts
│   ├── render.controller.ts
│   ├── results.controller.ts
│   └── health.controller.ts
├── services/            # Бизнес-логика и замеры
│   ├── benchmark.service.ts  # Ядро замеров
│   ├── render.service.ts     # Одиночный рендер для Playground
│   └── results.service.ts    # История результатов
├── models/              # Mongoose-схемы
│   ├── BenchmarkRun.ts  # Результат бенчмарка
│   └── BenchmarkResult.ts
└── scenarios/
    ├── data.ts          # Тестовые данные четырёх сценариев
    └── templates.ts     # Шаблоны для каждого движка
```

**Стек:** Express 4, TypeScript, Mongoose, Pug, EJS, Handlebars, Mustache

---

## Как работают замеры

### Benchmark — сравнение движков

Ядро замеров — [`server/src/services/benchmark.service.ts`](server/src/services/benchmark.service.ts).

#### Шаг 1: Компиляция шаблона

Перед измерением каждый движок **компилирует** шаблон в функцию. Это однократная операция, и её время (`compileMs`) фиксируется отдельно — чтобы отличать стоимость компиляции от стоимости рендеринга:

```
pug.compile(template)        → fn(data)
ejs.compile(template)        → fn(data)
Handlebars.compile(template) → fn(data)
Mustache.parse(template)     → Mustache.render(template, data)
```

#### Шаг 2: Прогрев (warm-up)

Перед измерением шаблон рендерится **10 раз вхолостую**. Это позволяет V8 JIT-компилятору оптимизировать горячий код до начала замеров, иначе первые итерации были бы аномально медленными.

#### Шаг 3: Измерение

Рендеринг выполняется `runs` раз (по умолчанию 100, максимум 500). Время каждой итерации фиксируется через `performance.now()` с точностью до микросекунд:

```
для каждой итерации:
  start = performance.now()
  render()
  times.push(performance.now() - start)
```

#### Шаг 4: Статистика

По массиву времён вычисляются четыре метрики (в миллисекундах, округление до 3 знаков):

| Метрика    | Что показывает                            |
|------------|-------------------------------------------|
| `avg`      | Среднее время — общая производительность  |
| `median`   | Медиана — типичное время без выбросов     |
| `min`      | Лучший результат                          |
| `max`      | Худший результат, показывает нестабильность |
| `compileMs`| Время компиляции шаблона                  |

Медиана надёжнее среднего: редкие всплески GC или планировщика ОС не искажают картину.

#### Сценарии (объём данных)

| Сценарий  | items | users | departments       |
|-----------|-------|-------|-------------------|
| `simple`  | 5     | 5     | —                 |
| `medium`  | 100   | 100   | —                 |
| `heavy`   | 500   | 200   | 10 × 20 сотрудников |
| `extreme` | 1 000 | 500   | 20 × 50 сотрудников |

Данные детерминированы — генерируются один раз при старте сервера и не меняются между запусками. Это исключает влияние случайности данных на результат.

Также можно передать **собственные данные** (`customData`) — тогда стандартные данные сценария заменяются полностью.

#### Сохранение в MongoDB

После завершения замера результат сохраняется в коллекцию `BenchmarkRun`. История последних 10 запусков доступна через `/api/benchmark/history`.

---

### Playground — одиночный рендер

Сервис [`render.service.ts`](server/src/services/render.service.ts) отвечает за одиночный рендер в Playground.

Отличия от бенчмарка:
- Нет прогрева и нет повторов — только один рендер
- Движки: только `pug` и `ejs` (серверные)
- Возвращает HTML-результат для предпросмотра
- Время фиксируется через `performance.now()` так же, как в бенчмарке

Playground сохраняет историю запусков в отдельную коллекцию для сравнения между сессиями.

---

## API

| Метод | Путь                       | Описание                                 |
|-------|----------------------------|------------------------------------------|
| POST  | `/api/benchmark`           | Запустить бенчмарк                       |
| GET   | `/api/benchmark/history`   | Последние 10 запусков                    |
| GET   | `/api/benchmark/templates` | Шаблоны для каждого движка               |
| GET   | `/api/benchmark/scenarios` | Тестовые данные всех сценариев           |
| POST  | `/api/render`              | Одиночный рендер (Playground)            |
| GET   | `/api/results`             | История результатов Playground           |
| GET   | `/api/health`              | Состояние сервера                        |

**Тело POST `/api/benchmark`:**

```json
{
  "engines": ["handlebars", "pug"],
  "scenarios": ["simple", "heavy"],
  "runs": 100,
  "customData": null
}
```

---

## Быстрый запуск

**Адреса после запуска:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- MongoDB: `mongodb://localhost:27017/rendermeter`

**Требования:** Docker, Node.js 18+

**1. MongoDB:**

```bash
docker start mongo 2>/dev/null || docker run -d --name mongo -p 27017:27017 mongo:7
```

**2. Backend** (отдельный терминал):

```bash
cd server
cp .env.example .env   # при первом запуске
npm install
npm run dev
```

**3. Frontend** (отдельный терминал):

```bash
cd client
npm install
npm run dev
```
