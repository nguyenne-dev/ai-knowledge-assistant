# 🎧 TechFashion AI Customer Support — Multi-Channel RAG Assistant

A production-grade, fullstack conversational customer intelligence platform engineered with **React (Vite + TypeScript)**, **Node.js/Express (TypeScript)**, **Retrieval-Augmented Generation (RAG)**, **Qdrant Vector Database**, and **Google Gemini LLM**.

Designed specifically for the **Tech-Fashion & E-Commerce** industry to automate customer consultation across multiple channels (**Web Chat UI, Facebook Messenger, and Zalo Official Account**) with 100% factual accuracy and zero hallucination.

---

## 🌟 Key Architecture & Capabilities

### 1. Semantic RAG & Vector Search
- **Document Ingestion & Chunking**: Automatically segments Markdown domain documents (product catalogs, sizing matrices, warranty, and return policies) into semantically cohesive chunks with metadata tagging.
- **High-Dimension Vector Store**: Integrates with **Qdrant Vector Database** (768 dimensions, Cosine distance) using **Google Gemini `text-embedding-004`**.
- **Similarity Threshold**: Implements top-$k$ retrieval with a minimum similarity threshold ($0.45+$) to prevent irrelevant matches.

### 2. Strict Anti-Hallucination & Citation
- **Grounded System Prompting**: Constrains LLM generation strictly to retrieved context. If requested information is outside the internal dataset, the assistant politely declines rather than fabricating answers.
- **Transparent Citations**: Every response returns exact source document and section reference badges (`source` + `section`).

### 3. Multi-Channel Webhook Adapters
- **Facebook Messenger Adapter**: Normalizes incoming Meta Graph webhook payloads into internal chat message schemas and formats outgoing replies into Facebook send-API format.
- **Zalo Official Account (OA) Adapter**: Normalizes incoming Zalo OA webhook events and converts AI responses back into Zalo message structures.
- **Web Client Interface**: Real-time RESTful chat interface with quick suggestion pills, status ping, and payload inspector.

### 4. Multi-Turn Contextual Memory
- **Session Memory Management**: Tracks conversation history per session (`conversationId`), enabling users to ask natural follow-up questions using pronouns (*"nó có màu gì?", "áo này còn size L không?"*).

### 5. Production Hardening & DevOps
- **Sliding-Window Rate Limiter**: Built-in middleware protecting inference and ingestion endpoints from abuse and DDoS.
- **Containerized Deployment**: Multi-stage `Dockerfile` and `docker-compose.yml` orchestrating 3 isolated services (Frontend Nginx, Backend Express, Vector DB Qdrant) ready for one-command deployment on Linux VPS.
- **Automated Test Suite**: Unit and integration test coverage for RAG ingestion, conversation memory, channel adapters, and chat services.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / CHANNEL LAYER                          │
├──────────────────────┬──────────────────────────┬──────────────────────┤
│  React Web UI (Vite) │  Facebook Messenger API  │   Zalo Official Acc  │
└──────────┬───────────┴────────────┬─────────────┴──────────┬───────────┘
           │                        │                        │
           ▼                        ▼                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    NODE.JS / EXPRESS BACKEND LAYER                     │
│                                                                        │
│   ┌─────────────────────┐          ┌───────────────────────────────┐   │
│   │   REST Controllers  │          │   Channel Webhook Adapters    │   │
│   │   /api/chat         │          │   • facebook.adapter.ts       │   │
│   │   /api/health       │          │   • zalo.adapter.ts           │   │
│   └──────────┬──────────┘          └───────────────┬───────────────┘   │
│              │                                     │                   │
│              └──────────────────┬──────────────────┘                   │
│                                 │                                      │
│                                 ▼                                      │
│                   ┌───────────────────────────┐                        │
│                   │       Chat Service        │                        │
│                   │ (Session Memory Manager)  │                        │
│                   └─────────────┬─────────────┘                        │
│                                 │                                      │
│                                 ▼                                      │
│                   ┌───────────────────────────┐                        │
│                   │        RAG Service        │                        │
│                   └──────┬─────────────┬──────┘                        │
└──────────────────────────┼─────────────┼───────────────────────────────┘
                           │             │
              Embeddings & │             │ Context Search
              Inference    │             │ (Top-k Cosine >= 0.45)
                           ▼             ▼
┌──────────────────────────────┐     ┌───────────────────────────────────┐
│     Google Gemini API        │     │       Qdrant Vector DB            │
│  • text-embedding-004        │     │  • Collection:                    │
│  • gemini-1.5-flash / pro    │     │    tech_fashion_knowledge         │
└──────────────────────────────┘     └───────────────────────────────────┘
```

---

## 📁 Project Directory Structure

```text
ai_chatbot/
├── backend/
│   ├── src/
│   │   ├── adapters/            # Multi-channel adapters (Facebook, Zalo)
│   │   ├── config/              # Environment & application config
│   │   ├── controllers/         # Webhook, Chat, Health & Ingestion controllers
│   │   ├── middlewares/         # Rate limiting & global error handlers
│   │   ├── providers/           # LLM & Embedding factory providers (Gemini, Mock)
│   │   ├── repositories/        # Qdrant Vector store repository
│   │   ├── routes/              # Express API & webhook route definitions
│   │   ├── scripts/             # CLI ingestion & database inspector scripts
│   │   ├── services/            # RAG, Conversation Memory & Chat services
│   │   ├── types/               # TypeScript interfaces & channel contracts
│   │   ├── app.ts               # Express application setup
│   │   └── server.ts            # Server entrypoint
│   ├── Dockerfile               # Multi-stage production container
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/          # ChatBox, Header, WebhookSimulator, SystemOverview
│   │   ├── services/            # Axios/Fetch API client
│   │   ├── types/               # Frontend TypeScript interfaces
│   │   ├── App.tsx              # Root dashboard view
│   │   ├── index.css            # Maximalism design tokens & layout
│   │   └── main.tsx
│   ├── Dockerfile               # Nginx static server container
│   ├── nginx.conf
│   └── vite.config.ts
├── knowledge/                   # Tech-Fashion domain knowledge Markdown files
│   ├── products.md              # Product specs, sizing, materials
│   └── policies.md              # Shipping, warranty, exchange policies
├── docker-compose.yml           # 3-tier service orchestration
├── .env.example
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20+
- **npm** or **pnpm**
- **Docker & Docker Compose** (Optional for container mode)
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))
- **Qdrant Cluster** (Local Docker instance or free cloud cluster at [Qdrant Cloud](https://cloud.qdrant.io/))

### 2. Environment Setup
Create `.env` in the root directory and in `backend/`:
```bash
cp .env.example .env
cp .env.example backend/.env
```

Configure your environment variables:
```env
PORT=3000
NODE_ENV=development
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key_if_using_cloud
QDRANT_COLLECTION=tech_fashion_knowledge
```

### 3. Running Locally (Development Mode)

#### Start Backend:
```bash
cd backend
npm install
npm run dev
```
Backend API will run at `http://localhost:3000`. Test health endpoint:
```bash
curl http://localhost:3000/api/health
```

#### Start Frontend:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`.

### 4. Running with Docker Compose (Production Mode)

Ensure your `.env` contains your `GEMINI_API_KEY`, then run:
```bash
docker compose up --build -d
```

Services will be accessible at:
- **Frontend Web UI**: `http://localhost` (Port 80)
- **Backend API**: `http://localhost:3000`
- **Qdrant Vector DB Web Console**: `http://localhost:6333/dashboard`

---

## 📡 API & Webhook Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime, status, and health diagnostics |
| `POST` | `/api/chat` | Main RAG inquiry endpoint with citations & session ID |
| `POST` | `/api/ingest` | Triggers ingestion & vectorization of `knowledge/` documents |
| `GET` | `/api/ingest/status` | Returns Qdrant collection point count and vector stats |
| `POST` | `/webhooks/facebook` | Normalized Facebook Messenger webhook simulator |
| `POST` | `/webhooks/zalo` | Normalized Zalo Official Account webhook simulator |

---

## 🧪 Automated Testing

Run the automated test suite covering all core services, channel adapters, and RAG retrieval:
```bash
cd backend
npm test
```

---

## 📜 License
MIT License • Engineered by **Nguyễn Trung Nguyên** (Software Engineer / Fullstack & AI Developer).
