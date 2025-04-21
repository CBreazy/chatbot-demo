# Chatbot Demo Prototype

This is an AI-powered chatbot prototype built as a modular boilerplate for business-ready deployments. It uses a fine-tuned OpenAI model and supports a standalone frontend/backend architecture.

## 🧠 Overview

- **Frontend**: Built with React + TailwindCSS
- **Backend**: Node.js + Express
- **AI**: Fine-tuned GPT model via OpenAI API
- **Environment**: `.env`-based configuration
- **Modular**: Designed to be embedded into other websites

---

## 📁 Project Structure

```bash
chatbot-demo/
├── .env                    # Global environment config (API keys, model ID)
├── backend/                # Express API server
│   ├── index.js
│   └── ...
├── frontend/               # React frontend
│   ├── src/
│   └── ...
├── data/                   # Fine-tuning training files
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# From project root
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Create `.env` File

```bash
# .env at root
OPENAI_API_KEY=your-api-key
FINE_TUNED_MODEL_ID=ft:gpt-4o:your-org::your-model
OPENAI_ORG_ID=your-org-id (optional)
```

### 3. Run the App

In separate terminals:

```bash
# Terminal 1 (backend)
cd backend
npm start

# Terminal 2 (frontend)
cd frontend
npm run dev
```

App should be running at `http://localhost:3000` (or whatever port Vite is configured for).

---

## 📦 Features

- Chat interface with OpenAI fine-tuned model
- Backend toggles between default and custom model
- Embeddable, standalone frontend component (WIP)
- Developer-friendly structure for reuse & extension

---

## ⚙️ Dev Commands

```bash
# Frontend
cd frontend
npm run dev         # start Vite dev server
npm run build       # build for production

# Backend
cd backend
npm start           # start Express server
```

---

## 🔒 Environment Variables

| Key                  | Description                        |
|----------------------|------------------------------------|
| `OPENAI_API_KEY`     | Required. Your OpenAI API Key      |
| `FINE_TUNED_MODEL_ID`| Optional. Your fine-tuned model ID |
| `OPENAI_ORG_ID`      | Optional. Your OpenAI org ID       |

---

## 🛠️ In Progress / TODO

- [ ] Embed frontend as a drop-in widget
- [ ] Multi-session support
- [ ] Admin interface for model config
- [ ] Deployment pipeline setup

---

## 👨‍💻 Author

Chris Brown — [cbreazy.com](https://cbreazy.com)  
GitHub: [@CBreazy](https://github.com/CBreazy)

---

## 📝 License

This is a private repository. Not licensed for public or commercial use.
All rights reserved © Brown Creative Company