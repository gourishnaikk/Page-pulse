# 🚀 Page Pulse

**Page Pulse** is a lightweight web auditing application that analyzes any publicly accessible webpage and returns essential SEO and content metrics. It consists of a RESTful Express.js backend API and a responsive React frontend that provides an intuitive interface for auditing websites.

> Built as part of the **Digital Heroes Training Task**.

---

## 🌐 Live Demo

### Frontend
🔗 https://page-pulse-one-sigma.vercel.app

### Backend API
🔗 https://page-pulse-api-i7vl.onrender.com

---

## ✨ Features

- 🌍 Analyze any publicly accessible webpage
- ⚡ Measure response status and response time
- 📝 Extract page title
- 📄 Extract meta description
- 🔠 Count H1 headings
- 🖼️ Detect images missing `alt` attributes
- 📚 Calculate approximate word count
- ❌ Comprehensive error handling
- 📱 Fully responsive user interface
- 🧪 Backend unit testing with Jest & Supertest

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- Axios
- Cheerio
- CORS
- dotenv

### Testing

- Jest
- Supertest

### Deployment

- Frontend → Vercel
- Backend → Render

---

## 📁 Project Structure

```text
page-pulse/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tests/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.template
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.template
│
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/page-pulse.git
cd page-pulse
```

---

# Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development
```

Run the backend:

```bash
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Run the frontend:

```bash
npm run dev
```

Application runs on:

```
http://localhost:5173
```

---

# API Endpoint

## POST `/api/v1/audit`

Analyzes a webpage and returns audit metrics.

### Request

```json
{
  "url": "https://example.com"
}
```

### Successful Response

```json
{
  "success": true,
  "data": {
    "status": 200,
    "responseTime": "214ms",
    "title": "Example Domain",
    "metaDescription": "...",
    "h1Count": 1,
    "imagesWithoutAlt": 0,
    "wordCount": 156
  }
}
```

---

## Health Check

```
GET /health
```

Response

```json
{
  "status": "ok"
}
```

---

# Running Tests

```bash
cd backend
npm test
```

or

```bash
npm run test:unit
```

---

# Environment Variables

### Backend

```env
PORT=5000
NODE_ENV=development
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

# Deployment

### Frontend

Hosted on **Vercel**

```
https://page-pulse-one-sigma.vercel.app
```

### Backend

Hosted on **Render**

```
https://page-pulse-api-i7vl.onrender.com
```

---

# Design Decisions

- RESTful API architecture
- Modular Express project structure
- Separation of concerns using controllers, services, routes, and middleware
- Axios for reliable HTTP requests
- Cheerio for efficient HTML parsing
- Centralized error handling middleware
- Responsive React frontend with reusable components
- Environment-based configuration using dotenv

---

# Future Improvements

- Lighthouse performance integration
- SEO score calculation
- Broken link detection
- Accessibility audit
- Download audit report as PDF
- Authentication and user history
- Rate limiting and request caching

---

# Acknowledgements

Built for the **Digital Heroes Training Task**.

Digital Heroes:
https://digitalheroesco.com

---

## 👨‍💻 Author

**Gourish Naik**

GitHub: https://github.com/<your-username>

LinkedIn: https://linkedin.com/in/<your-profile>

---

⭐ If you found this project useful, consider giving it a star!
