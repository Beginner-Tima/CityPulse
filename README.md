# CityPulse AI - Smart City Dashboard

![GitHub stars](https://img.shields.io/github/stars/Beginner-Tima/CityPulse)
![GitHub forks](https://img.shields.io/github/forks/Beginner-Tima/CityPulse)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Real-time AI-driven smart city monitoring system with anomaly detection for Almaty, Kazakhstan**

---

## 🎯 Реализованные функции

### Dashboard (Главная страница)
- ✅ **4 KPI карточки** — Air Quality (PM2.5), Traffic Flow, Active Alerts, System Health
- ✅ **Главный график** — совмещённый Line Chart (PM2.5 + Traffic Speed) с выбором зон
- ✅ **Air Quality Chart** — Bar Chart с цветовой индикацией (красный/жёлтый/зелёный)
- ✅ **Traffic Speed Chart** — Line Chart с историей скорости трафика
- ✅ **AI Dispatcher** — панель с реальными alerts от AI

### AI и Аналитика
- ✅ **Anomaly Detection Engine** — автоматическое обнаружение аномалий (PM2.5 > 100, Speed < 15)
- ✅ **AI Insights** — генерация рекомендаций через Gemini API
- ✅ **AI Chatbot** — чат с AI для вопросов о метриках города
- ✅ **Real-time обновление** — данные обновляются каждые 15 секунд

### Навигация и UI
- ✅ **Sidebar** — боковое меню с переходами между страницами
- ✅ **Dashboard** — главная страница с метриками
- ✅ **Zones** — мониторинг по районам (Alatau, Bostandyk, Medeu)
- ✅ **AI Chat** — интерактивный чат с AI ассистентом
- ✅ **AI Settings** — настройки thresholds и интервалов
- ✅ **Settings** — системные настройки (город, часовой пояс, подключение к БД)

### Дополнительные функции
- ✅ **Trigger Demo** — кнопка для симуляции аномалии
- ✅ **Timezone** — отображение времени в формате Almaty (UTC+6)
- ✅ **Responsive Design** — адаптивный интерфейс
- ✅ **Dark Theme** — современный тёмный дизайн

---

## 🏗 Архитектура проекта

```
CityPulse/
├── server.js              # Express сервер (главная точка входа)
├── dashboard.html         # Standalone frontend (всё в одном файле)
├── index.js              # Альтернативный сервер
├── package.json          # Node.js зависимости
├── .env                  # Переменные окружения
│
├── routes/               # API маршруты
│   ├── dashboard.js      # /api/dashboard/*
│   ├── metrics.js        # /api/metrics/*
│   ├── debug.js         # /api/debug/*
│   └── chat.js          # /api/chat/* (AI Chatbot)
│
├── services/             # Бизнес-логика
│   ├── anomalyEngine.js # Движок обнаружения аномалий
│   ├── llmService.js    # Интеграция с Gemini AI
│   ├── metricsGenerator.js # Генератор тестовых метрик
│   └── supabaseClient.js   # Подключение к Supabase
│
├── frontend/             # React исходники (альтернативный UI)
│   ├── src/
│   │   ├── components/  # React компоненты
│   │   └── lib/         # Утилиты
│   └── dist/            # Скомпилированный билд
│
└── database.sql          # SQL схема для Supabase
```

---

## 🚀 Как запустить проект

### Вариант 1: Быстрый запуск (Frontend + Backend вместе)

```bash
# 1. Клонируй репозиторий
git clone https://github.com/Beginner-Tima/CityPulse.git
cd CityPulse

# 2. Установи зависимости
npm install

# 3. Запусти сервер (frontend уже встроен в server.js)
node server.js
```

**Открой в браузере:** `http://localhost:5000`

---

### Вариант 2: Только Frontend (открыть файл)

Просто открой `dashboard.html` в браузере — он работает автономно и подключается к API на `localhost:5000`.

---

### Вариант 3: Backend отдельно

```bash
# Запуск только backend
node server.js

# API будет доступен на:
# - http://localhost:5000/health
# - http://localhost:5000/api/dashboard/summary
# - и т.д.
```

---

## 📡 API Endpoints

| Endpoint | Method | Описание |
|----------|--------|----------|
| `/` | GET | Frontend (dashboard.html) |
| `/health` | GET | Проверка работы сервера |
| `/api/dashboard/summary` | GET | KPIs и метрики всех зон |
| `/api/dashboard/insights/active` | GET | Активные AI alerts (за последний час) |
| `/api/metrics/history` | GET | История всех метрик |
| `/api/metrics/history/:zoneId` | GET | Метрики конкретной зоны |
| `/api/metrics/live` | GET | Последние метрики для каждой зоны |
| `/api/debug/trigger` | POST | Создать тестовую аномалию |
| `/api/chat` | POST | AI Chatbot (отправка вопроса) |

---

## 🔧 Настройка .env

Создай файл `.env` в корне проекта:

```env
# Supabase (обязательно)
SUPABASE_URL=https://nzruaharqytobdtpttnn.supabase.co
SUPABASE_ANON_KEY=sb_publishable_9lbPjYsR53ZaWcP2QmiqjA_liFUcMMS

# Server
PORT=5000

# Gemini AI (опционально, для AI Chat и Insights)
GEMINI_API_KEY=AIzaSyBNvAjGn4jM8w4jcY7r1owoWfnLA_zAnp8
```

---

## 🛠 Технологический стек

**Backend:**
- Node.js 18+
- Express.js
- Supabase (PostgreSQL)
- Gemini API (Google AI)

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Chart.js (графики)
- Tailwind CSS (стили)
- Font Awesome (иконки)

**Tools:**
- Git, GitHub
- Vite (сборка React)
- npm

---

## 🎮 Демонстрация функций

### 1. Мониторинг метрик
После запуска на Dashboard автоматически отображаются:
- Текущий уровень PM2.5
- Скорость трафика
- Активные алерты
- Статус системы

### 2. AI Dispatcher
AI автоматически генерирует insights когда:
- PM2.5 превышает 100 μg/m³
- Скорость трафика падает ниже 15 km/h

### 3. Trigger Demo
Нажми кнопку "Trigger Demo" для симуляции критической ситуации:
- Создаётся аномалия с PM2.5 = 180
- AI генерирует action plan
- Alert отображается в AI Dispatcher

### 4. AI Chat
Перейди на вкладку "AI Chat" и спроси:
- "What's the air quality?"
- "Why is PM2.5 high in Alatau?"
- "What are the traffic conditions?"

---

## 📊 Зоны мониторинга

Проект настроен для Almaty, Казахстан:

| Зона | Описание |
|------|----------|
| **Alatau District** | Южный жилой район с высокой растительностью |
| **Bostandyk District** | Центральный бизнес-район с интенсивным движением |
| **Medeu District** | Горный район с туристической активностью |

---

## 🚀 Деплой

### На Vercel (Frontend + Functions)
1. Подключи GitHub репозиторий к Vercel
2. Настрой build command: `npm run build`
3. Добавь environment variables
4. Деплой

### На Railway/Render (Backend)
1. Подключи репозиторий
2. Настрой команду запуска: `node server.js`
3. Добавь переменные окружения
4. Деплой

---

## 📝 License

MIT License — свободное использование для хакатонов и образовательных целей.

---

## 👤 Авторы

**CityPulse AI Team** — команда разработки для хакатона

---

**Made with ❤️ for Smart Cities**