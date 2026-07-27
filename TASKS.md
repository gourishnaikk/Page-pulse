# Page Pulse — Project Development Roadmap (TASKS.md)

This document is the official, comprehensive roadmap for the development of Page Pulse. It breaks down the system implementation into structured milestones and sprints to guide consecutive coding sessions.

---

## Sprint 1: Project Initialization

### Goal
Establish a clean Node.js environment with version control, script configurations, and code formatting rules.

### Description
Initialize package configurations, install base and development dependencies, set up environment configuration files (`.env`), prepare Git exclusions, and configure ESLint and Prettier formatting standard rules.

### Deliverables
- Configured `package.json` with dependency list and script runners.
- Environment variables template (`.env`).
- Custom ESLint and Prettier rules configurations.
- Initial Git boundary config (`.gitignore`).

### Files to Create
- `backend/package.json`
- `backend/.env`
- `backend/.env.template`
- `backend/.gitignore`
- `backend/.eslintrc.json`
- `backend/.prettierrc`
- `backend/README.md`

### Files to Modify
- None

### Dependencies
- None

### Acceptance Criteria
- Running `npm install` runs without security or versioning errors.
- ESLint and Prettier configure successfully and identify style details.

### Definition of Done
- Configurations successfully parsed by node.
- Scripts section handles `start` and `dev` runners.

### Testing Requirements
- Confirm that configuring a file with improper spaces fails linter checks and successfully auto-formats upon running layout utilities.

### Estimated Complexity
- **Low** (1 Story Point)

### Sprint 1 Checklist
- [x] Initialize `package.json` inside the backend directory.
- [x] Configure `dependencies` and `devDependencies` mapping.
- [x] Establish `.env` template properties.
- [x] Set up rules inside `.eslintrc.json` and `.prettierrc`.
- [x] Create `.gitignore` to protect node modules/credentials.
- [x] Write introductory setup instructions in `README.md`.

---

## Sprint 2: Backend Folder Structure

### Goal
Define the file-system footprint complying with the standard MVC codebase structure.

### Description
Create the module subdirectories inside the `src/` backend root directory. Ensure all folders needed to house controllers, models/DTOs, services, middleware, routes, validators, utilities, and tests are placed correctly.

### Deliverables
- Clean folder structure corresponding to AGENTS.md requirements.
- Standard placeholder module structures or basic entry files.

### Files to Create
- `backend/src/controllers/.gitkeep`
- `backend/src/routes/.gitkeep`
- `backend/src/services/.gitkeep`
- `backend/src/middleware/.gitkeep`
- `backend/src/validators/.gitkeep`
- `backend/src/utils/.gitkeep`
- `backend/src/tests/.gitkeep`

### Files to Modify
- None

### Dependencies
- None

### Acceptance Criteria
- Directory structure matches the MVC layout specifications.

### Definition of Done
- Git directories populated and pushed into version control.

### Testing Requirements
- Basic filesystem checks to ensure path availability and module loading.

### Estimated Complexity
- **Low** (1 Story Point)

### Sprint 2 Checklist
- [ x] Create `controllers`, `routes`, and `services` directories.
- [x ] Create `middleware`, `validators`, and `utils` directories.
- [x ] Create `tests` directory.
- [x ] Place `.gitkeep` files inside folders to enforce folder structure tracking.

---

## Sprint 3: Express Server Setup

### Goal
Initialize the core Express web server and bind lifecycle hooks to the configured network port.

### Description
Instantiate the base applications, configure standard body parsers, configure CORS rules, write the startup configuration, and read the `PORT` property out of the active environment variables.

### Deliverables
- Bootable Express framework pipeline.
- Global middleware handles for data payload parsing.

### Files to Create
- `backend/src/app.js`
- `backend/src/server.js`

### Files to Modify
- `backend/package.json` (Verify startup entry script mapping)

### Dependencies
- `express`
- `cors`
- `dotenv`
- `nodemon` (dev dependency)

### Acceptance Criteria
- Server starts successfully using `npm run dev` on default port `5000`.
- Incoming HTTP requests receive response headers successfully.

### Definition of Done
- Database-less server listening on the configured Port without syntax errors or runtime exceptions.

### Testing Requirements
- Perform standard connectivity testing targeting `http://localhost:5000` to confirm loopback responsiveness (e.g. GET response).

### Estimated Complexity
- **Low-Medium** (2 Story Points)

### Sprint 3 Checklist
- [x] Code network port configuration fallback inside `server.js`.
- [x] Instantiate Express application wrapper within `app.js`.
- [x] Hook JSON and urlencoded body parsers into the web server.
- [x] Configure global CORS setup using strict permitted origin mappings.
- [x] Verify nodemon config processes updates and boots cleanly.

---

## Sprint 4: Routing

### Goal
Register the root API routes and map client request patterns to endpoints.

### Description
Create the base router instance and register the target endpoint pattern map (`POST /api/v1/audit`). Secure route mapping by wiring routing middleware into the central Express application configuration.

### Deliverables
- Endpoint path router configuration.
- Base API mapping middleware integrations.

### Files to Create
- `backend/src/routes/audit.routes.js`

### Files to Modify
- `backend/src/app.js`

### Dependencies
- `express`

### Acceptance Criteria
- Issuing a HTTP request (e.g., POST) to `/api/v1/audit` triggers a hit (returns placeholder responses rather than standard 404).

### Definition of Done
- Endpoint requests correctly route through the Express router to route handler delegates.

### Testing Requirements
- Verify route configurations return a temporary `200 OK` or placeholder mock response when targeted via cURL.

### Estimated Complexity
- **Low** (1 Story Point)

### Sprint 4 Checklist
- [x] Define the Express route instance in `audit.routes.js`.
- [x] Configure the route path targeting `POST /api/v1/audit`.
- [x] Map route logic mapping to call stub controller modules.
- [x] Import and mount the audit router under the `/api/v1` namespace inside `app.js`.

---

## Sprint 5: Controller Layer

### Goal
Implement the request orchestration layer (controllers) to handle JSON payloads.

### Description
Write the logic verifying incoming request shapes, extracting required parameters (the target audit URL), dispatching work orders to downstream service layers, and returning API responses.

### Deliverables
- Controller handler logic separating client parameters from processing implementations.

### Files to Create
- `backend/src/controllers/audit.controller.js`

### Files to Modify
- `backend/src/routes/audit.routes.js`

### Dependencies
- None (Uses routing packages)

### Acceptance Criteria
- Controllers correctly capture URL properties submitted within the body payload and pass them to downstream services.
- Controller relies on `next(error)` to propagate runtime failures.

### Definition of Done
- Controller code exists, handles inputs, forwards exceptions safely, and conforms to coding style standards.

### Testing Requirements
- Unit test the controller layer using mock request/response parameters.

### Estimated Complexity
- **Low-Medium** (2 Story Points)

### Sprint 5 Checklist
- [x] Create `audit.controller.js` file with an async `runAudit` controller method.
- [x] Parse requests to capture `req.body.url` safely.
- [x] Mount middleware error catches wrapped in standard try/catch blocks.
- [x] Link routes config to invoke the controller method.

---

## Sprint 6: URL Validation

### Goal
Implement strict pre-flight URL verification rules to prevent SSRF and block bad requests.

### Description
Write input validators checking incoming formats, parsing structures containing protocol specifications (`http://` or `https://`), verifying URL syntax validity, and rejecting malicious localhost, loopback, or private network host IP ranges.

### Deliverables
- Request validation middleware.
- SSRF prevention filters.

### Files to Create
- `backend/src/validators/url.validator.js`

### Files to Modify
- `backend/src/routes/audit.routes.js`

### Dependencies
- Standard Node `url` library

### Acceptance Criteria
- Submission of invalid URLs, blank inputs, or localhost targets instantly yields HTTP status `400 Bad Request` with structured error code `INVALID_URL`.
- Passing URLs successfully route to the next middleware.

### Definition of Done
- No SSRF vulnerability vectors pass validation.
- All validation exceptions return standardized JSON structures.

### Testing Requirements
- Unit tests validating all valid and invalid URL formats (localhost, private, link-local, well-formed public names).

### Estimated Complexity
- **Medium** (3 Story Points)

### Sprint 6 Checklist
- [x] Write `validateUrl` validator middleware.
- [x] Code parsing checker validating protocol constraints (`http:` and `https:`).
- [x] Code host filter rejecting loopback, link-local, and private IP blocks (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).
- [x] Bind validation middleware inside the audit routes file before targeting controller endpoints.

---

## Sprint 7: Audit Service

### Goal
Implement the central audit service to orchestrate remote data gathering and local parsing processes.

### Description
Write service layer abstractions containing orchestrating code pathways. The service coordinates remote connections, computes connection latency measurements, triggers target document fetches, and parses returned contents into formatted properties.

### Deliverables
- Central logic layer coordinate operations.

### Files to Create
- `backend/src/services/audit.service.js`

### Files to Modify
- `backend/src/controllers/audit.controller.js`

### Dependencies
- None

### Acceptance Criteria
- Services cleanly receive parsed arguments, dispatch fetches, run parsing modules, and return structured output.

### Definition of Done
- Audits run, compute timings, parse documents, and format outputs cleanly.

### Testing Requirements
- Service layers testable with mock remote resources and mocking dependencies.

### Estimated Complexity
- **Medium** (3 Story Points)

### Sprint 7 Checklist
- [x] Write `audit.service.js` class/service interface containing the main audit function.
- [x] Instantiate timing counters (e.g. before/after fetch blocks).
- [x] Code clean return mapping properties structures.
- [x] Link controller processing block to invoke service handlers through async execution.

---

## Sprint 8: Axios Integration

### Goal
Securely fetch raw HTML documents from remote endpoints.

### Description
Implement HTTP network client interactions using Axios. Configure network request details, establish safe timeout configurations, parse target HTTP headers, and enforce unsupported media content blocks.

### Deliverables
- Remote HTTP fetching module code.
- Remote server connection error catcher.

### Files to Create
- `backend/src/utils/timer.js`

### Files to Modify
- `backend/src/services/audit.service.js`

### Dependencies
- `axios`

### Acceptance Criteria
- Request timeout occurs at exactly 10,000ms.
- URLs delivering non-HTML structures fail fast and raise `UNSUPPORTED_CONTENT` exceptions.

### Definition of Done
- Network fetches safely capture remote site markups or raise appropriate status codes depending on runtime responses (e.g. 404, 504 status values).

### Testing Requirements
- Simulated slow-responding endpoints triggering timeouts.
- Content checks rejecting PDF or JSON streams.

### Estimated Complexity
- **Low-Medium** (2 Story Points)

### Sprint 8 Checklist
- [x] Create timer utility to measure latency in milliseconds.
- [x] Configure Axios instance containing request limits (10s timeout, custom User-Agent).
- [x] Code response headers inspection validating content type context (`text/html`).
- [x] Handle target HTTP exceptions (DNS failures, server HTTP error codes).

---

## Sprint 9: Cheerio HTML Parsing

### Goal
Implement pure function HTML document parser queries using Cheerio.

### Description
Create processing helper utilities that load HTML content and map DOM selectors onto targeted metrics: page title, description meta, heading elements (`<h1>`), missing alternative tags on image nodes, and approximate text word counts.

### Deliverables
- HTML metadata extraction utilities.

### Files to Create
- `backend/src/utils/parser.js`

### Files to Modify
- `backend/src/services/audit.service.js`

### Dependencies
- `cheerio`

### Acceptance Criteria
- Metrics extracted align exactly with PRD requirements:
  - Page Title (fallback: `""`)
  - Meta Description (fallback: `""`)
  - H1 count
  - Images missing `alt` or containing empty `alt` attributes
  - Word count (with script, style, nav, noscript, and svg contents removed)

### Definition of Done
- Parser runs successfully, processes invalid structures without throwing crashes, and exports fully verified indicators.

### Testing Requirements
- Unit testing against mock HTML documents containing missing, incomplete, empty, or normal tag layouts.

### Estimated Complexity
- **Medium** (3 Story Points)

### Sprint 9 Checklist
- [x] Write selector targeting page `<title>` rules.
- [x] Write case-insensitive selector checking `<meta name="description">` or fallback `og:description` properties.
- [x] Write logic counting `<h1>` tags.
- [x] Write logic identifying invalid image target alt properties.
- [x] Write body word extractor filtering out non-visual containers (`<script>`, `<style>`, `<nav>`, `<noscript>`, `<svg>`).

---

## Sprint 10: Response Builder

### Goal
Construct and serialize API response contracts complying with the JSON API specification.

### Description
Format final success outputs mapping returned properties to the API spec format structure (success indicators, status integers, latency markers, metrics objects).

### Deliverables
- Success response serializer template.

### Files to Modify
- `backend/src/controllers/audit.controller.js`

### Dependencies
- None

### Acceptance Criteria
- Successful requests yield HTTP status `200 OK` and match the API contract structure:
  ```json
  {
    "success": true,
    "data": {
      "status": 200,
      "responseTime": "312ms",
      "title": "...",
      "metaDescription": "...",
      "h1Count": 0,
      "imagesWithoutAlt": 0,
      "wordCount": 0
    }
  }
  ```

### Definition of Done
- Success payloads return consistent key structures.

### Testing Requirements
- Check integration test outputs for response payload syntax compliance.

### Estimated Complexity
- **Low** (1 Story Point)

### Sprint 10 Checklist
- [x] Format data schema structure inside the controller handler.
- [x] Verify timing responses are formatted with `"ms"` suffixes.
- [x] Confirm no trace/debug information leaks to the user.

---

## Sprint 11: Centralized Error Middleware

### Goal
Implement global Express application error catcher modules.

### Description
Develop a centralized, unified exception parser catching runtime routing and execution failures, mapping exception types to standardized exception JSON layouts, and providing appropriate HTTP response statuses.

### Deliverables
- Centralized error boundaries middleware.

### Files to Create
- `backend/src/middleware/error.middleware.js`

### Files to Modify
- `backend/src/app.js`

### Dependencies
- None

### Acceptance Criteria
- Raised exceptions correctly result in standardized JSON error schemas:
  ```json
  {
    "success": false,
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
  ```
- No stack traces leak out under production environment conditions.

### Definition of Done
- Centralized error handler captures all exceptions thrown in routes, controllers, and services.

### Testing Requirements
- Mock route triggers showing error status codes matching schema bindings (400, 404, 415, 504, 500).

### Estimated Complexity
- **Low-Medium** (2 Story Points)

### Sprint 11 Checklist
- [x] Implement `error.middleware.js` middleware handler.
- [x] Code logic mapping application exceptions to status codes and standardized error codes.
- [x] Implement production node check conditions safeguarding stack trace context.
- [x] Wire the error middleware app-wide at the bottom of the middleware stack inside `app.js`.

---

## Sprint 12: Logging

### Goal
Implement a structured logging system to track application events and errors.

### Description
Add structured, environment-aware console logs for debugging and operational monitoring. Log server status changes, incoming request targets, validation failures, and internal error conditions without cluttering stdout with unwanted logs in test runner environments.

### Deliverables
- Logging configuration.

### Files to Modify
- `backend/src/app.js`
- `backend/src/middleware/error.middleware.js`
- `backend/src/services/audit.service.js`

### Dependencies
- None (Use structural Console logs)

### Acceptance Criteria
- Incoming routing events and error conditions log to stdout.
- Environment variables control log visibility (mute logs in `test` environment).

### Definition of Done
- No raw, unformatted `console.log()` statements remain.

### Testing Requirements
- Run test suites and verify console output remains clean.

### Estimated Complexity
- **Low** (1 Story Point)

### Sprint 12 Checklist
- [x] Configure conditional log wrapper checking `process.env.NODE_ENV !== 'test'`.
- [x] Add entry log strings capturing endpoint requests.
- [x] Log caught details inside error handler middleware.

---

## Sprint 13: Unit Tests

### Goal
Establish test assertions confirming business logic and URL validation correctness.

### Description
Write unit test suites directly checking isolated function outputs: parser content extractions, input syntax validations, formatting helpers, and timer utilities.

### Deliverables
- Unit test assertions configurations.

### Files to Create
- `backend/src/tests/unit/parser.test.js`
- `backend/src/tests/unit/url.validator.test.js`

### Files to Modify
- `backend/package.json`

### Dependencies
- `jest`

### Acceptance Criteria
- Validation and parsing tests cover 100% of paths.
- Running `npm run test` executes all unit tests successfully.

### Definition of Done
- All test runners complete without syntax issues, module failures, or test suite hangs.

### Testing Requirements
- Code test setups isolating dependencies using Jest Mock functions.

### Estimated Complexity
- **Medium** (3 Story Points)

### Sprint 13 Checklist
- [x] Configure testing scripts mapping to Jest runners.
- [x] Write unit tests verifying URL format filters (happy path / SSRF prevention targets).
- [x] Write mock parser tests passing structured HTML files (title extraction, word counting).

---

## Sprint 14: Integration Tests

### Goal
Establish end-to-end API pipeline integration tests using Supertest.

### Description
Produce integration tests mocking network calls, mimicking slow connection times to trigger gateway timeout responses, evaluating support boundaries for varying MIME types, and verifying success payloads return matches.

### Deliverables
- Express application endpoint test configurations.

### Files to Create
- `backend/src/tests/integration/audit.test.js`

### Files to Modify
- None

### Dependencies
- `supertest`

### Acceptance Criteria
- End-to-end tests cover all HTTP error status outputs (400, 404, 415, 504, 200).
- Test runners run in isolation without port collision failures.

### Definition of Done
- Full pipeline integration verification suite completes successfully.

### Testing Requirements
- Leverage `supertest` mapping to run local mock Express instances.

### Estimated Complexity
- **Medium** (3 Story Points)

### Sprint 14 Checklist
- [x] Code setup blocks configuring a mock Express application interface.
- [x] Write test cases targeting successful audits (200).
- [x] Write tests verifying validation rejections (400).
- [x] Write tests asserting MIME-type restrictions (415).
- [x] Write tests validating request timeouts (504).

---

## Sprint 15: Deployment

### Goal
Deploy the application to the production hosting environment.

### Description
Configure base configuration properties on the production host, verify CORS origin configurations allow only trusted frontend connections, configure environmental properties mapping, and monitor build outputs.

### Deliverables
- Configured production deployment instances.
- Verifiable API endpoint status mapping checks.

### Files to Modify
- `backend/package.json` (Verify start script configurations)
- `backend/README.md` (Update deployment status)

### Dependencies
- None

### Acceptance Criteria
- API deployed to hosting platform (Render).
- Outgoing API is responsive and validates incoming request origins correctly.

### Definition of Done
- Live public URL resolves and processes incoming audits correctly.

### Testing Requirements
- Trigger remote audits using a live URL payload.

### Estimated Complexity
- **Low-Medium** (2 Story Points)

### Sprint 15 Checklist
- [ ] Set environment values on the hosting console dashboard (`PORT`, `NODE_ENV = production`).
- [ ] Verify CORS settings permit only specified clients.
- [ ] Run production checklist validations.
- [ ] Perform a remote post-deployment validation audit check.

---

## Master Project Checklist

```markdown
- [ ] Sprint 1: Project Initialization Setup
  - [ ] package.json initialized
  - [ ] .env / .env.template created
  - [ ] ESLint and Prettier configs structured
- [ ] Sprint 2: Backend Folder Structure
  - [ ] MVC folder structure created
  - [ ] .gitkeep placeholders locked
- [ ] Sprint 3: Express Server Setup
  - [ ] App and server initialization files created
  - [ ] CORS and JSON parsers mounted
- [ ] Sprint 4: Routing
  - [ ] Base routes file mapped
  - [ ] Root namespace configured in app.js
- [ ] Sprint 5: Controller Layer
  - [ ] Audit controller code structured
  - [ ] Async try/catch middleware hooks set
- [ ] Sprint 6: URL Validation
  - [ ] Validation middleware written
  - [ ] Host, protocol, and SSRF rules verified
- [ ] Sprint 7: Audit Service
  - [ ] Audit service module coded
  - [ ] Timing structures integrated
- [ ] Sprint 8: Axios Integration
  - [ ] Axios clients structured
  - [ ] Timeout limits and Content-Type verifies configured
- [ ] Sprint 9: Cheerio HTML Parsing
  - [ ] DOM parsers and metadata extractors coded
  - [ ] Normalizations and filters integrated
- [ ] Sprint 10: Response Builder
  - [ ] Standardized success output format mapped
- [x] Sprint 11: Centralized Error Middleware
  - [x] Global error catcher middleware implemented
  - [x] Stack trace safety guards operational
- [x] Sprint 12: Logging System
  - [x] event status loggers configured
- [x] Sprint 13: Unit Tests
  - [x] Jest configured and run
  - [x] Validator and Parser tests completing
- [x] Sprint 14: Integration Tests
  - [x] Supertest integration suite operational
  - [x] API status flow codes covered (200, 400, 415, 504, 500)
- [ ] Sprint 15: Deployment
  - [ ] Production servers verified on Render
  - [ ] Live verification check complete
```
