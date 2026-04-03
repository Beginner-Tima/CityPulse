# CityPulse AI - Smart City Dashboard


![CityPulse AI](https://img.shields.io/badge/CityPulse-AI-green)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-purple)
![Gemini](https://img.shields.io/badge/Gemini-API-orange)

Real-time AI-driven smart city monitoring system with anomaly detection.



---

## 🚀 О проекте

**CityPulse AI** — это интеллектуальная система мониторинга городской среды в реальном времени. Проект разработан для хакатона и демонстрирует возможности AI в управлении умным городом.

### Ключевые функции

- 📊 **Real-time мониторинг** — отслеживание PM2.5 и скорости трафика
- 🤖 **AI Anomaly Detection** — автоматическое обнаружение аномалий
- 🧠 **Gemini AI Integration** — интеллектуальные рекомендации
- 📈 **Интерактивные графики** — визуализация данных с Chart.js
- 🔔 **AI Dispatcher** — лента уведомлений с планами действий

---

## 🏗 Архитектура

```
citypulse-ai/
├── backend/                 # Node.js + Express API
│   ├── index.js            # Main server
│   ├── services/           # Business logic
│   │   ├── anomalyEngine.js    # Anomaly detection
│   │   ├── llmService.js       # Gemini AI integration
│   │   └── supabaseClient.js   # Database client
│   ├── routes/             # API endpoints
│   │   ├── dashboard.js
│   │   ├── metrics.js
│   │   └── debug.js
│   ├── database.sql        # SQL schema
│   ├── seed.js             # Demo data generator
│   └── .env                # Environment variables
│
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/     # UI components
│   │   └── lib/           # Utilities
│   └── dist/              # Production build
│
└── dashboard.html         # Standalone demo version
```

---

## 🛠 Технологический стек

### Backend
- **Node.js** — Runtime
- **Express** — Web framework
- **Supabase** — PostgreSQL database
- **Gemini API** — AI/LLM

### Frontend
- **HTML/CSS/JS** — Standalone version
- **Chart.js** — Data visualization
- **Tailwind CSS** — Styling
- **Font Awesome** — Icons

---

## ⚡ Быстрый старт

### Требования
- Node.js 18+
- Supabase аккаунт
- Gemini API key (опционально)

### Backend

```bash
cd backend
npm install
# Добавь переменные окружения в .env
cp .env.example .env
# Отредактируй .env с твоими данными

npm run dev
# Server: http://localhost:5000
```

### Frontend (Standalone)

Просто открой файл `dashboard.html` в браузере:

```
backend/dashboard.html
```

---

## 📡 API Endpoints

| Endpoint | Method | Описание |
|----------|--------|----------|
| `/api/dashboard/summary` | GET | KPIs и метрики зон |
| `/api/dashboard/insights/active` | GET | Активные AI alerts |
| `/api/metrics/history` | GET | История метрик (50 записей) |
| `/api/metrics/history/:zoneId` | GET | Метрики конкретной зоны |
| `/api/debug/trigger` | POST | Создать тестовую аномалию |
| `/health` | GET | Проверка работы сервера |

---

## 🎯 Функционал

### Dashboard
- 4 KPI карточки (Air Quality, Traffic Flow, Active Alerts, System Health)
- Главный график (PM2.5 + Traffic)
- Air Quality bar chart
- Traffic Speed line chart

### AI Dispatcher
- Real-time alerts
- Severity levels: low, med, high, critical
- Action plans от Gemini AI
- Pulsing red border для high alerts

### Demo Mode
Кнопка "Trigger Demo" создаёт аномалию:
- PM2.5 = 180 μg/m³
- Traffic Speed = 8 km/h

---

## 📝 Переменные окружения

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Server
PORT=5000

# Gemini AI (опционально)
GEMINI_API_KEY=your-gemini-api-key
```

---

## 🔧 Разработка

### Запуск в режиме разработки

```bash
# Backend
cd backend
npm run dev

# Frontend (открой dashboard.html)
```

### Создание БД

Выполни SQL в Supabase SQL Editor:

```sql
-- Включить UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблицы
CREATE TABLE zones (...);
CREATE TABLE metrics_log (...);
CREATE TABLE ai_insights (...);

-- Данные
INSERT INTO zones VALUES (...);
```

### Seed данные

```bash
cd backend
node seed.js
```

---

## 🚀 Деплой

### Vercel (Frontend)

1. Подключи GitHub репозиторий
2. Настрой `frontend/` как отдельный проект
3. Добавь environment variables

### Railway (Backend)

1. Подключи репозиторий
2. Настрой `backend/` как проект
3. Добавь environment variables
4. Деплой

---

## 📄 License

MIT License

---

## 👤 Автор

**CityPulse AI Team** — [Website](https://citypulse.ai)

---


**Made with ❤️ for Smart Cities**
