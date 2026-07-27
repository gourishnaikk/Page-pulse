# Page Pulse — Project Knowledge Base & AI Coding Assistant Guide (AGENTS.md)

This document serves as the single, authoritative knowledge base and coding guide for the **Page Pulse** project. It consolidates all requirements, architectural patterns, schemas, validation rules, parsing logic, and coding standards. 

All future AI-driven editing and developer sessions must strictly adhere to the guidelines set forth in this document.

---

## 1. Project Overview

### Product Vision
Page Pulse is a lightweight, high-performance web auditing application that analyzes publicly accessible webpages and returns a clean, structured report containing essential SEO and content accessibility metrics.

### Business Problem
Modern SEO auditing tools are frequently monolithic, feature-heavy, expensive, and require user registration for simple tasks. Developers, marketers, and content creators often need a quick, instant, and frictionless way to inspect basic page parameters—such as page titles, meta descriptions, word counts, and missing alt attributes—without the bloat of Lighthouse audits or full search rankings integrations. Page Pulse fills this gap by offering a streamlined API and a fast, responsive user interface.

### Project Goals
- **Reliable Page Auditing**: Build a resilient backend API capable of requesting and parser-analyzing any public URL.
- **Accurate Metadata & Metrics Extraction**: Pull core tags, count headers, detect basic accessibility omissions, and approximate word counts.
- **Frictionless UI/UX**: Deliver a beautiful, responsive, and minimalist frontend where users can paste a URL and receive instant visual metrics.
- **Production-Ready & Stable**: Establish robust error boundaries, thorough test coverage (unit and integration), and auto-deployable configurations.

### Project Scope
The initial release covers the following:
- Backend REST API (`POST /api/v1/audit`) checking single URLs.
- Basic HTML parsing (Title, Meta Description, H1 Count, Images without `alt` attribute, and Word Count).
- URL safety and validity validation.
- Standardized, informative error handling.
- React/Vite/Tailwind CSS frontend with visual metric displays.
- Full automated testing suite.

### Out of Scope
The following features are explicitly excluded from the current scope and must not be implemented unless explicitly added to this document:
- User registration, authentication, or session management.
- Persistent databases (no MySQL, PostgreSQL, MongoDB, etc.).
- Google Lighthouse or PageSpeed Insights integration.
- JavaScript rendering (processing single-page applications via headless browsers like Puppeteer/Playwright).
- Complex SEO scoring algorithms.

---

## 2. Product Requirements

### Functional Requirements
- **URL Submission**: The client must accept a target URL string from the user.
- **URL Validation**: The backend must instantly reject malformed, non-HTTP/HTTPS, private, loopback, or local IP addresses before executing a fetch.
- **Webpage Fetching**: The backend must fetch the raw HTML content of the validated URL with a strict timeout limit.
- **HTML Parsing**: The backend must parse the document structure to extract targeted SEO and accessibility metadata.
- **Response Generation**: The backend must compile the extracted metrics into a standardized JSON response format.
- **Error Propagation**: Any error (e.g., DNS resolution failure, HTTP errors, request timeouts, non-HTML page returns) must be caught and returned as clean JSON containing structured error codes.

### Non-Functional Requirements
- **Performance**: Fetches and parsing operations should add minimal processing overhead (< 100ms beyond target site response latency).
- **Security**: The server must block SSRF (Server-Side Request Forgery) by rejecting requests targeting `localhost` (IPv4 & IPv6), private IP subnets, or link-local ranges.
- **UX Responsiveness**: The frontend must provide clear loading states, handle slow audits gracefully, and render responsive, modern components using a rich dark-mode or polished theme.
- **CORS Constraints**: The backend must explicitly restrict or configure CORS to safely permit requested clients.

### Acceptance Criteria
- A paste of a valid, public HTML webpage URL returns a JSON object containing target response metadata with status code `200 OK`.
- Submission of invalid URLs, blank inputs, or localhost targets yields an HTTP status code `400 Bad Request` with code `INVALID_URL`.
- Fetch timeouts are handled gracefully within 10 seconds, yielding an HTTP status code `504 Gateway Timeout` with code `TIMEOUT`.
- Submission of URLs returning non-HTML formats (e.g. PDFs, images, JSON files) returns an HTTP status code `415 Unsupported Media Type` with code `UNSUPPORTED_CONTENT`.
- The system must possess passing test suites covering the happy path, DNS lookup failures, missing files, timeouts, and unsupported media types.

---

## 3. Technical Architecture

### Overall System Flow
```
[ Client / Frontend ]
         │
         ▼  (POST /api/v1/audit)
[ Express Router ] ──────► [ Validation Middleware ]
                                     │ (Passed)
                                     ▼
                          [ Audit Controller ]
                                     │
                                     ▼
                           [ Audit Service ]
                           ┌─────────┴─────────┐
                           ▼                   ▼
                     [ Axios Fetch ]     [ Cheerio Parser ]
                           │                   │
                           ▼                   ▼
                    (Raw HTML content)   (Structured Metrics)
                                └──────────────┬┘
                                               ▼
                                     [ Centralized Error MW ]
                                     (Produces final JSON)
```

### Backend-First Approach
The project follows a **Backend-First** development strategy. Crucial domain definitions, validation routines, error structures, and tests must be fully written, verified, and complete on the API server before implementing UI layouts.

### Frontend-Backend Communication
Communication is established via asynchronous HTTP REST requests. The frontend communicates with the backend's `/api/v1/audit` endpoint, transmitting a payload of type `application/json` and receiving standardized JSON payloads.

### MVC Implementation (Separation of Concerns)
A strict, modular Model-View-Controller pattern is enforced (with "Model" context represented by structured DTOs and JSON response objects as there is no database layer):
- **Routes Layer**: Handles ingestion of HTTP requests and points to specific controller functions. No business logic exists here.
- **Validators Layer**: Injected as middleware before the controller. Automatically validates incoming request payloads.
- **Controller Layer**: Coordinates the service call. Unpacks the request parameters and formats the success response. It thin-wraps operations and depends on the service for data generation.
- **Service Layer**: House of business logic. Coordinates fetching target HTML (via Axios) and initiating metadata parsing.
- **Utils Layer**: Functions carrying isolated parsing behaviors or time measurement logic.
- **Middleware Layer**: Houses cross-cutting concerns like custom CORS handles, logging, and application-wide centralized error catchers.

---

## 4. Folder Structure

```text
backend/
├── src/
│   ├── controllers/
│   │   └── audit.controller.js       # Unpacks req, calls service, sends standard response
│   ├── routes/
│   │   └── audit.routes.js           # Regulates HTTP mapping to controllers
│   ├── services/
│   │   └── audit.service.js          # Handles fetching, timing, and calls parser util
│   ├── middleware/
│   │   └── error.middleware.js       # Centralized Express error handler
│   ├── validators/
│   │   └── url.validator.js          # Middleware executing strict SSRF & format checks
│   ├── utils/
│   │   ├── parser.js                 # Pure functions dedicated to Cheerio parse mechanics
│   │   └── timer.js                  # Precision timer to compute response latency
│   ├── tests/
│   │   └── audit.test.js             # Integration and unit tests using Jest/Supertest
│   ├── app.js                        # Configures Express middleware, routes, and error catchers
│   └── server.js                     # Binds PORT, initializes server lifecycle listen
├── .env                              # Managed environment variables (PORT, NODE_ENV)
├── .gitignore                        # Git exclusion rules
├── package.json                      # Dependency and task scripts configuration
└── README.md                         # Project setup & usage details
```

---

## 5. API Standards

### Endpoint Specifications

#### `POST /api/v1/audit`
Analyzes a submitted webpage URL and returns extracted metrics.

**Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Success Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "status": 200,
    "responseTime": "312ms",
    "title": "Example Domain",
    "metaDescription": "Example description content here",
    "h1Count": 1,
    "imagesWithoutAlt": 2,
    "wordCount": 964
  }
}
```

**Error Response Layouts:**
All error responses from the API must share the exact structure below:
```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Human-readable error explanation message."
}
```

### Standardized Error Codes & Status Mappings
| Scenario | Code | HTTP Status | Description |
| :--- | :--- | :--- | :--- |
| **Invalid URL Path** | `INVALID_URL` | `400 Bad Request` | Missing or malformed URLs, non-HTTP/S, localhost/private targets |
| **Target Not Found** | `NOT_FOUND` | `404 Not Found` | Target server returned 404, or domain DNS failed to resolve |
| **Service Timeout** | `TIMEOUT` | `504 Gateway Timeout` | Target webpage fetch took longer than 10 seconds |
| **Non-HTML Return** | `UNSUPPORTED_CONTENT`| `415 Unsupported Media Type` | Content-Type header on target does not contain `text/html` |
| **Server Failures** | `INTERNAL_SERVER_ERROR`| `500 Internal Server Error` | Unexpected code or filesystem exceptions on the Node backend |

---

## 6. Coding Standards

- **Strict MVC Architecture**: Never merge service operations into controller classes, and never put route middleware details into router configuration scripts. Keep code paths decoupled.
- **Async/Await Only**: Do not use raw promises or callbacks. All asynchronous calls (network requests, FS, tests) must use modern async/await syntax wrapped in appropriate try/catch scopes.
- **DRY (Don't Repeat Yourself)**: Extract repeating logic (e.g. latency calculations, header sanitizations) into reusable utilities.
- **Thin Controllers**: Controllers must only serve to parse parameters, dispatch processing to the service layer, and output standardized responses or forward errors via `next()`.
- **Stateless Services**: Services should not store session, call state, or result cache in-memory across calls. They must accept inputs and return predictable outputs.
- **Readable Over "Clever" Code**: Code should be self-documenting. Implement descriptive variable names and functional comments. Prefer straightforward loops or array methods instead of complex, nested, one-line reductions.
- **Formatting Standards**:
  - Run **ESLint** and **Prettier** to inspect syntaxes.
  - Semicolons are required.
  - Use camelCase for functions and variables, UPPER_CASE for configuration constants.
  - strictly enforce a 2-space nesting indent.
- **Production-Ready Code**: No stray `console.log()` statements must be checked into version control. Implement structured logging where necessary.

---

## 7. Error Handling Standards

- **Centralized Middleware Handling**: All errors raised in routes, controllers, or services must be caught and forwarded to the central error catcher using Express's `next(error)`. No route must output error JSONs directly.
- **Consistent Response Templates**: The centralized error handler is the *only* source formatting error bodies. This ensures identical signatures.
- **No Stack Trace Leaks**: Under production environments (`process.env.NODE_ENV === 'production'`), error details must omit internal stack traces (`error.stack`) or Node internals to prevent system footprint exposure.
- **Graceful Failures**: If Axios fails to parse, or Cheerio finds no document structure, return standardized, empty metrics values (`""` or `0`) rather than throwing high-level crashes.

---

## 8. Validation Rules

Before initiating outgoing network connections, the input validation middleware must run the following checks on the target URL:

1. **Required Verification**: Reject with `INVALID_URL` if `url` is missing or is not a non-empty string.
2. **Protocol Rule**: The URL parsing must yield a protocol match of exactly `http:` or `https:`. Reject all other schemes (e.g. `ftp:`, `file:`, `javascript:`, `mailto:`).
3. **Well-formed syntax**: Use Node's built-in `new URL(urlString)` to verify parser compliance. Reject if instantiation fails.
4. **SSRF Prevention Rules**:
   - Extract the hostname.
   - Reject the request if the hostname resolves or expands to:
     - `localhost`, `127.0.0.1`, `::1` (Loopback addresses).
     - Private IP address blocks:
       - `10.0.0.0/8`
       - `172.16.0.0/12`
       - `192.168.0.0/16`
     - Link-local address block: `169.254.0.0/16`.
   - Implement hostname resolution checks (DNS lookup) if input uses direct IP formats to ensure the backend is not tricked by DNS rebinding attacks targeting local network resources.
5. **Content-Type Rules**: During the request lifecycle (upon fetching headers via Axios), inspect the `Content-Type` header return. If it does not contain `text/html`, immediately stop the request and throw `UNSUPPORTED_CONTENT` before downloading huge binaries.
6. **Timeout Rules**: Network requests must time out at exactly **10 seconds (10,000ms)** to prevent open sockets from exhausting server resources.

---

## 9. Parsing Rules (Cheerio)

Once target HTML content is downloaded successfully, the utility parser must apply the following specific logic metrics:

- **HTML Page Title**:
  - Locate the `<title>` tag.
  - Return its `.text().trim()` value.
  - If missing or empty, return an empty string `""`.
- **Meta Description**:
  - Search for `<meta name="description">` (case-insensitive on name attr).
  - Extract the content attribute value: `$('meta[name="description"]').attr('content')`.
  - Fall back to `<meta property="og:description">` if the primary description attribute is missing.
  - Return trimmed content, or an empty string `""` if not found.
- **H1 Header Count**:
  - Target all `<h1>` tags in the document: `$('h1')`.
  - Return the integer length of the selection: `$('h1').length`.
- **Images without Alternative Text**:
  - Target all image tags: `$('img')`.
  - Filter and count elements that do not possess an `alt` attribute, OR contain an `alt` attribute that is empty or contains only whitespace.
  - Selector match: `img:not([alt])` combined with validation checking on `alt` content.
- **Approximate Word Count**:
  - Target the main visible content (typically nested in `<body>`).
  - Strip element types that contain non-renderable text or structural elements: delete `<script>`, `<style>`, `<nav>`, `<noscript>`, and `<svg>` contents from the parsing tree.
  - Extract the text using cheerio's `.text()`.
  - Normalize whitespaces (replace line endings, double spaces, and tabs with a single space).
  - Split text by spaces and filter out empty elements. Return the length of the resulting array.
  - If text is empty, return `0`.

---

## 10. Testing Standards

- **Framework**: **Jest** is the primary test framework. **Supertest** is used for HTTP integration testing against the Express server route handlers.
- **Test Locations**: All tests must live in the `backend/src/tests/` folder.
- **Required Coverage Scenarios**:
  - **Happy Path Integration**: Direct hit with a mock server or known good URL returning mock HTML structure, producing standard output, status `200 OK`.
  - **URL Validator Suite**: Multi-case verification testing inputs like empty strings, non-http, loopbacks, internal IPs, and malformed strings.
  - **Network Timeout simulation**: Testing simulated slow responses exceeding 10 seconds to verify response is `504 Gateway Timeout`.
  - **Bad MIME-type Simulation**: Testing response with content type headers set to `application/json` or `application/octet-stream` to verify status `415 Unsupported Media Type` returns.
  - **Target Not Found Simulation**: Testing requests returning `404` statuses to evaluate output structure.
- **Coverage Expectation**: Ensure high code coverage metrics on the controller, validator, and parsing utility files.

---

## 11. Deployment Standards

### Environment Variables (.env)
The application relies on variable hooks:
- `PORT`: Binds the port for incoming connections (default: `5000` for local environment).
- `NODE_ENV`: Defines current build context. Values: `development`, `production`, `test`.

### Render / Vercel Host Deployments
- Configure the root path correctly if the backend is nested. Set the deploy base directory or build instruction command to point directly to backend dependencies.
- Enable `node backend/src/server.js` (or similar configured start script) as the main start command on Render.
- Verify CORS integration on Render allows access only from the production URL of the corresponding Vercel-deployed React client.

### Pre-deployment Production Checklist
- [ ] No local configuration values, database parameters, or passwords are hardcoded.
- [ ] All environment variables are correctly registered in the Render dashboard.
- [ ] `npm run lint` executes successfully and does not return warnings or exceptions.
- [ ] `npm run test` finishes with 100% path validation success.
- [ ] Build log is clear of warnings.

---

## 12. Future Enhancements

The architectural setup of Page Pulse must facilitate expansion of the metrics object to include these future enhancements without requiring refactoring of core controller, error routing, or validation mechanisms:
- Ingestion of SEO score calculations.
- Comprehensive accessibility auditing conforming to WCAG standards.
- Lighthouse performance integration.
- Full OpenGraph metadata checks (extraction of OpenGraph images, types, sites).
- Automated script-based viewport screenshot generation.

---

## 13. AI Coding Instructions

To ensure structural consistency across subsequent coding iterations, all AI assistants must conform to these strict rules:

- **Incremental Progress Only**: Stay strictly within the scope of the active Sprint. Never prepare or code parts of Sprint 4 during Sprint 2 tasks.
- **Scope Limitation**: Never edit or modify code files outside the context of the user request.
- **Feature Restraint**: Do not build unrequested functionalities. Stick strictly to the PRD requirements.
- **Contract Adherence**: Under no circumstance should the API JSON response contract (`success`, `data`, `code`, `message`, and keys nested under `data`) be mutated, renamed, or restructured without permission.
- **Code Modularity**: Write small, single-purpose functions. Avoid monolithic controller methods.
- **Documentation**: Document major logic implementations. Keep README and implementation plan checkpoints accurate and updated.
- **Architectural Approval**: Ask the user before introducing new external npm libraries or changing folder directories.

---

## 14. Definition of Done (DoD)

The Page Pulse backend is officially complete and production-ready when:
1. **API Operational**: The endpoint `POST /api/v1/audit` successfully accepts, fetches, and parses live target urls.
2. **Validator Passing**: Validation logic successfully blocks unauthorized URL strings and prevents SSRF exposures.
3. **Parsing Complete**: Title, Meta, H1 count, Image alt detection, and Word count calculations execute accurately.
4. **Resiliency Verified**: The centralized error handling catch matches timeouts, bad HTTP states, and unsupported media types cleanly.
5. **Full Test Success**: The suite runs and passes.
6. **Documentation Updated**: The main root README matches deployment commands and outlines clear running procedures.
