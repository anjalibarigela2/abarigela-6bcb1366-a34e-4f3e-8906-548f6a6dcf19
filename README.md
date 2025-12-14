# TurboVets - Smart Task Management System

A modern, scalable task management system built with **NestJS**, **Angular**, and **Nx**.

## 🎯 Overview

TurboVets is a comprehensive task management system designed for teams to collaborate efficiently. The project uses a monorepo structure with Nx to manage multiple packages and applications seamlessly.

**Tech Stack:**
- **Frontend:** Angular (standalone components)
- **Backend:** NestJS
- **Monorepo Tool:** Nx
- **Database:** PostgreSQL (or your configured database)
- **Authentication:** JWT Token-based
- **Styling:** Tailwind CSS

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) or **yarn** (v3 or higher)
- **Git** - [Download](https://git-scm.com/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/)

Verify your installation:
```bash
node --version
npm --version
git --version
```

---

## 🚀 Project Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd turbovets
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=turbovets
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=24h

# API Configuration
API_PORT=3000
API_HOST=localhost

# Frontend Configuration
FRONTEND_URL=http://localhost:4200
```

### Step 4: Database Setup

Create the database and run migrations:

```bash
# Create database (using psql)
psql -U postgres -c "CREATE DATABASE turbovets;"

# Run migrations from the backend directory
npm run migration:run
```

---

## 📥 Installation

### Install All Dependencies

```bash
npm install
```

This will install dependencies for all packages in the monorepo.

### Install Nx Console (Optional but Recommended)

Nx Console is an editor extension that provides a rich UI for Nx commands.

For **VSCode:**
```bash
# Search for "Nx Console" in VSCode Extensions and install
# Or install via command line:
code --install-extension nrwl.angular-console
```

For **IntelliJ/WebStorm:**
- Go to **Preferences/Settings → Plugins**
- Search for "Nx Console" and install

---

## ▶️ Running the Application

### Development Mode

#### Run All Services

Open two terminal windows and run:

**Terminal 1 - Start the backend (NestJS API):**
```bash
npm run dev:api
```

**Terminal 2 - Start the frontend (Angular app):**
```bash
npm run dev:app
```

#### Run Specific Services

**Backend (NestJS API):**
```bash
npx nx serve api
```

**Frontend (Angular):**
```bash
npx nx serve app
```

### Access the Application

- **Frontend:** http://localhost:4200
- **API:** http://localhost:3000
- **API Docs (Swagger):** http://localhost:3000/api/docs

### Demo Credentials

Use these credentials to log in:

| Role   | Email                  | Password     |
|--------|------------------------|--------------|
| Owner  | owner@turbovets.com    | password123  |
| Admin  | admin@turbovets.com    | password123  |
| Viewer | viewer@turbovets.com   | password123  |

---

## 🔨 Building for Production

### Build All Applications

```bash
npm run build
```

### Build Specific Projects

**Build API:**
```bash
npx nx build api
```

**Build App:**
```bash
npx nx build app
```

### Output Locations

- Backend build: `dist/apps/api`
- Frontend build: `dist/apps/app`

---

## 📁 Project Structure

```
turbovets/
├── apps/
│   ├── api/                    # NestJS backend application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   ├── middleware/
│   │   │   └── main.ts
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   └── app/                    # Angular frontend application
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/
│       │   │   ├── pages/
│       │   │   ├── services/
│       │   │   └── app.component.ts
│       │   ├── assets/
│       │   ├── styles/
│       │   └── main.ts
│       ├── project.json
│       └── tsconfig.json
│
├── libs/                       # Shared libraries
│   ├── shared/
│   │   ├── api-types/         # TypeScript interfaces
│   │   ├── utils/             # Utility functions
│   │   └── constants/         # Shared constants
│   └── ui/                     # Shared UI components
│
├── nx.json                     # Nx configuration
├── package.json                # Dependencies and scripts
├── tsconfig.base.json          # Base TypeScript config
├── .env                        # Environment variables
└── README.md                   # Project documentation
```

---

## ✨ Key Features

- **Task Management:** Create, update, delete, and organize tasks
- **Role-Based Access Control:** Owner, Admin, and Viewer roles
- **Real-time Updates:** Live task status synchronization
- **User Authentication:** Secure JWT-based authentication
- **Responsive Design:** Mobile-friendly interface
- **Modern UI:** Clean, bright orange-themed design with Tailwind CSS
- **Monorepo Structure:** Scalable architecture with Nx

---

## 🛠️ Development Workflow

### Running Tasks with Nx

Execute any task in your workspace:

```bash
npx nx <target> <project-name>
```

**Common targets:**
- `serve` - Start the development server
- `build` - Build the project for production
- `test` - Run unit tests
- `lint` - Lint the code
- `e2e` - Run end-to-end tests

**Examples:**

```bash
# Serve the app
npx nx serve app

# Build the API
npx nx build api

# Run tests for the app
npx nx test app

# Lint the API
npx nx lint api
```

### View Project Graph

Visualize dependencies between projects:

```bash
npx nx graph
```

This opens an interactive graph showing all projects and their relationships.

### Generate Components

Generate a new component in the Angular app:

```bash
npx nx generate @nx/angular:component --project=app --name=my-component
```

Generate a new service:

```bash
npx nx generate @nx/angular:service --project=app --name=my-service
```

Generate a new NestJS module:

```bash
npx nx generate @nx/nest:module --project=api --name=my-module
```

---

## 🧪 Testing

### Run All Tests

```bash
npm run test
```

### Run Tests for Specific Project

```bash
npx nx test api
npx nx test app
```

### Run Tests in Watch Mode

```bash
npx nx test app --watch
```

### Generate Coverage Report

```bash
npx nx test app --coverage
```

---

## 📤 Deployment

### Prerequisites for Deployment

- Ensure all environment variables are set on your production server
- Database should be set up and migrations run
- Build process completed successfully

### Backend Deployment

```bash
# Build the API
npx nx build api

# Deploy the dist/apps/api folder to your server
# Set up environment variables on the server
# Install dependencies: npm install --production
# Run: npm start (or your deployment command)
```

### Frontend Deployment

```bash
# Build the frontend
npx nx build app

# The dist/apps/app folder contains the production-ready files
# Deploy to a static hosting service:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - GitHub Pages
# - Azure Static Web Apps
```