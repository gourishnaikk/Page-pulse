# Page Pulse — Backend API

A lightweight web auditing API that analyzes publicly accessible webpages and returns structured SEO and content metrics.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **HTTP Client**: Axios
- **HTML Parser**: Cheerio
- **Testing**: Jest + Supertest
- **Linting**: ESLint + Prettier

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm (included with Node.js)

### Installation

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install
```

### Environment Setup

```bash
# Copy the environment template
cp .env.template .env

# Edit .env with your values (defaults are fine for local development)
```

### Running the Server

```bash
# Development mode (with hot-reload via nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` by default.

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `npm run dev` | Start with nodemon (auto-restart on changes) |
| **start** | `npm start` | Start in production mode |
| **lint** | `npm run lint` | Run ESLint checks |
| **lint:fix** | `npm run lint:fix` | Auto-fix ESLint issues |
| **format** | `npm run format` | Format code with Prettier |
| **test** | `npm test` | Run Jest test suite |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server listening port |
| `NODE_ENV` | `development` | Environment mode (`development`, `production`, `test`) |

---

## Project Structure

```text
backend/
├── src/
│   ├── controllers/       # Request handlers (thin layer)
│   ├── routes/            # Express route definitions
│   ├── services/          # Business logic layer
│   ├── middleware/         # Error handling, logging
│   ├── validators/        # URL validation & SSRF prevention
│   ├── utils/             # Parser, timer utilities
│   ├── tests/             # Jest & Supertest test suites
│   ├── app.js             # Express app configuration
│   └── server.js          # Server entry point
├── .env                   # Environment variables (not committed)
├── .env.template          # Environment variables template
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier configuration
├── .gitignore             # Git exclusion rules
├── package.json           # Dependencies & scripts
└── README.md              # This file
```

---

## API Endpoint

### `POST /api/v1/audit`

Analyzes a webpage URL and returns SEO metrics.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "status": 200,
    "responseTime": "312ms",
    "title": "Example Domain",
    "metaDescription": "Example description",
    "h1Count": 1,
    "imagesWithoutAlt": 2,
    "wordCount": 964
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "code": "INVALID_URL",
  "message": "Please provide a valid HTTP or HTTPS URL."
}
```

---

## License

ISC
