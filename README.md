# AI Website Builder

A full-stack AI-powered website builder with LangGraph agents, Git versioning, and MongoDB conversation history.

## Architecture

```
ai-builder/
├── backend/                 # Express API server
│   ├── agents/              # LangGraph agent nodes (planner, coder)
│   ├── config/              # Database configuration
│   ├── controllers/         # Request handlers
│   ├── models/              # Mongoose schemas (Project, Commit, Message)
│   ├── routes/              # Express routes
│   ├── services/            # Business logic (AI, Git, Project, DevServer)
│   ├── utils/               # File utilities
│   └── server.js            # Entry point
├── frontend/                # React + Vite UI
│   └── src/
│       ├── api/             # Axios API client
│       ├── components/      # Reusable UI components
│       └── pages/           # Page views (Home, Dashboard, Workspace)
├── templates/               # Project templates
│   └── react-template/      # Default React + Vite template
├── projects/                # Generated project repositories
├── .env                     # Environment variables
└── README.md
```

## How It Works

1. **Create Project** → Copies a React template, initializes Git repo, saves to MongoDB
2. **AI Prompt** → LangGraph runs planner → coder agents → generates file JSON
3. **File Write** → Generated files are written to the project directory
4. **Git Commit** → All changes are automatically committed
5. **Version History** → Every commit is tracked with its prompt
6. **Revert** → Roll back to any previous commit instantly

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally (default: `mongodb://localhost:27017/ai-builder`)
- **Git** installed and available in PATH
- **OpenAI API Key**

## Installation

### 1. Clone and Configure

```bash
cd ai-builder
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-builder
OPENAI_API_KEY=sk-your-key-here
```

### 2. Start MongoDB

```bash
# If using mongod directly:
mongod

# If using MongoDB as a service (Windows):
net start MongoDB

# If using Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Install & Start Backend

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:5000`.

### 4. Install & Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.

## Usage

### Creating a Project

1. Open `http://localhost:5173` in your browser
2. Click **"Create Project"**
3. Enter a project name
4. You'll be redirected to the Workspace

### Using AI Prompts

In the Workspace, use the AI prompt panel on the right side:

- Type a prompt like: *"Add a responsive navbar with Home, About, and Contact links"*
- The AI will generate and apply file changes
- A Git commit is automatically created

### Viewing Version History

1. Click the **"Commits"** tab in the Workspace
2. View all commits with their associated prompts
3. Click **"Revert"** to restore any previous version

### Preview

1. Click **"Start Preview"** in the center panel
2. The project's Vite dev server will start on an auto-assigned port
3. The preview loads in an iframe

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/projects/create` | Create a new project |
| `GET` | `/projects` | List all projects |
| `GET` | `/projects/:id` | Get project details |
| `GET` | `/projects/:id/commits` | Get commit history |
| `GET` | `/projects/:id/files` | Get file tree |
| `GET` | `/projects/:id/messages` | Get conversation history |
| `POST` | `/projects/revert` | Revert to a commit |
| `POST` | `/projects/:id/start` | Start dev server |
| `POST` | `/projects/:id/stop` | Stop dev server |
| `POST` | `/ai/prompt` | Send AI prompt |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| AI Agents | LangGraph (JS) |
| Database | MongoDB + Mongoose |
| Version Control | Git (simple-git) |
| LLM | OpenAI API (gpt-4o-mini) |
