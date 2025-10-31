# Projet ESGI - Monorepo

A TypeScript monorepo using pnpm workspaces with Fastify backend and Prisma ORM.

## Project Structure

```
.
├── backend/          # Fastify API server
│   ├── src/         # Source code
│   ├── prisma/      # Database schema and migrations
│   └── Dockerfile   # Backend Docker configuration
├── shared/          # Shared types and utilities
│   └── src/         # Shared source code
└── docker-compose.yml
```

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose (for containerized development)

## Getting Started

### 1. Install pnpm (if not already installed)

```bash
npm install -g pnpm
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your configuration.

### 4. Start PostgreSQL database

```bash
docker-compose up postgres -d
```

### 5. Run Prisma migrations

```bash
cd backend
pnpm prisma:migrate
```

### 6. Generate Prisma Client

```bash
cd backend
pnpm prisma:generate
```

### 7. Start development server

```bash
pnpm dev
```

The API will be available at http://localhost:3000

## Available Scripts

### Root Level

- `pnpm dev` - Start backend in development mode
- `pnpm build` - Build backend for production
- `pnpm start` - Start backend in production mode

### Backend

- `pnpm dev` - Start with hot reload
- `pnpm build` - Build TypeScript
- `pnpm start` - Start production server
- `pnpm prisma:generate` - Generate Prisma Client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio

### Shared

- `pnpm build` - Build shared package
- `pnpm dev` - Build in watch mode

## Docker

### Development with Docker Compose

```bash
docker-compose up
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 3000

### Build production image

```bash
docker-compose build backend
```

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Fastify** - Fast web framework
- **Prisma** - Modern database ORM
- **PostgreSQL** - Database
- **pnpm** - Fast, efficient package manager
- **Docker** - Containerization

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api` - API welcome message

## Environment Variables

See `backend/.env.example` for all available environment variables.

## License

MIT