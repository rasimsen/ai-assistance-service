# AI Conversations Service

A **NestJS microservice** for managing AI assistant conversations and transcripts across multiple channels (Twilio, Telegram, Web, WhatsApp).

Built with **NestJS**, **Prisma 7**, **PostgreSQL**, and **TypeScript**, following **clean architecture**, **least-privilege security**, and **production-ready practices**.

---

## ✨ Features

- Store AI conversation transcripts (text & voice)
- Support multiple channels (Twilio, Telegram, Web, WhatsApp)
- Clean REST API with Swagger/OpenAPI
- Strong input validation
- Prisma 7 with **Postgres driver adapter**
- Multi-schema Postgres (`conv`)
- Least-privilege database access
- Dockerized Postgres for local development

---

## 🧱 Tech Stack

| Layer      | Technology              |
| ---------- | ----------------------- |
| Runtime    | Node.js 24 (LTS)        |
| Framework  | NestJS                  |
| Language   | TypeScript              |
| ORM        | Prisma 7                |
| Database   | PostgreSQL              |
| DB Driver  | `@prisma/adapter-pg`    |
| Validation | class-validator         |
| API Docs   | Swagger / OpenAPI       |
| Containers | Docker & docker-compose |

---

## 📁 Project Structure

```text
src/
├── app.module.ts
├── main.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── conversations/
│   ├── conversations.controller.ts
│   ├── conversations.service.ts
│   ├── conversations.module.ts
│   └── dto/
│       ├── conversation.enums.ts
│       ├── create-conversation.dto.ts
│       └── update-conversation.dto.ts
prisma/
├── schema.prisma
├── prisma.config.ts
├── migrations/
docker/
├── postgres/
│   └── init/
│       └── 001-roles.sql
```

---

## 🗄️ Database Design

### Schema

- Uses **PostgreSQL schema `conv`**
- Enforced via Prisma multi-schema support

### Conversation Model

| Field                | Type                                  |
| -------------------- | ------------------------------------- |
| id                   | UUID                                  |
| startedAt            | DateTime                              |
| endedAt              | DateTime?                             |
| durationSeconds      | Int?                                  |
| conversation         | Text                                  |
| conversationType     | VOICE \| TEXT                         |
| conversationVoiceUrl | String?                               |
| direction            | CUSTOMER \| COMPANY                   |
| channel              | TWILIO \| TELEGRAM \| WEB \| WHATSAPP |
| channelUserId        | String?                               |
| displayName          | String?                               |
| displayPhotoUrl      | String?                               |
| externalId           | String? (unique)                      |
| metadata             | JSON                                  |
| createdAt            | DateTime                              |
| updatedAt            | DateTime                              |

---

## 🔐 Database Security (Least Privilege)

Two separate DB roles are used:

| Role            | Purpose                |
| --------------- | ---------------------- |
| `conv_migrator` | Schema migrations only |
| `conv_app`      | Runtime CRUD access    |

- No superuser access at runtime
- Explicit schema ownership
- Controlled privileges on tables & sequences

---

## ⚙️ Environment Variables

### Runtime (`.env`)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://conv_app:conv_app_password@localhost:5432/conversations"
```

### Migration (`.env.migrate`)

```env
DATABASE_URL="postgresql://conv_migrator:conv_migrator_password@localhost:5432/conversations"
SHADOW_DATABASE_URL="postgresql://conv_migrator:conv_migrator_password@localhost:5432/conversations_shadow"
```

---

## 🐳 Local Development (Docker)

### Start Postgres

```bash
docker compose up -d
```

### Stop & Reset

```bash
docker compose down -v
```

---

## 🧬 Prisma

### Generate Client

```bash
npx prisma generate
```

### Run Migrations (Dev)

```bash
set -a && source .env.migrate && set +a
npx prisma migrate dev
```

---

## 🚀 Running the Service

```bash
npm install
npm run start:dev
```

---

## 📚 API Documentation (Swagger)

Once running, open:

```
http://localhost:3000/docs
```

---

## 🔌 REST API Endpoints

### Create Conversation

`POST /conversations`

### Get Conversation by ID

`GET /conversations/{id}`

### List Conversations (paged)

`GET /conversations?take=20&skip=0`

### Update Conversation

`PATCH /conversations/{id}`

---

## 🧪 Validation & Error Handling

- DTO-based validation (`class-validator`)
- Whitelisted payloads only
- Meaningful HTTP errors:
  - `400` invalid input
  - `404` not found
  - `409` unique constraint violation
- No internal DB details leaked

---

## 🧠 Design Principles

- **YAGNI** – no premature abstractions
- **DRY** – centralized Prisma & validation
- **Single Responsibility**
- **Infrastructure ≠ Business Logic**
- **Production-first Prisma setup**

---

## 🔜 Next Steps (Planned)

- Structured logging (pino)
- Correlation IDs
- Global exception filter
- Integration tests
- Postman collection
- CI/CD pipeline
- Auth & multi-tenancy
- Event-driven ingestion (Twilio, Telegram webhooks)

---

## 📘 Vibe Coding Practice

This project includes a real-world AI-assisted development archive
covering architecture, debugging, and production decisions:

→ documentations/ai-conversations-service-full.html

---

## 📄 License

MIT (or your preferred license)
