// backend/index.js (CommonJS version)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // organization: process.env.OPENAI_ORG_ID,
});

// ========== Chat Completions API ==========
app.post("/api/completion", async (req, res) => {
  const { messages, useFineTunedModel } = req.body;

  const model = useFineTunedModel
    ? process.env.FINE_TUNED_MODEL_ID
    : "gpt-3.5-turbo";

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages,
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      error: error.message,
      code: error.code || "unknown_error",
      detail: error,
    });
  }
});

// ========== Assistants API ==========
app.post("/api/message", async (req, res) => {
  const { message, threadId } = req.body;

  const thread = threadId
    ? { id: threadId }
    : await openai.beta.threads.create();

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: message,
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: process.env.ASSISTANT_ID,
  });

  // Basic polling loop
  let runStatus;
  do {
    await new Promise((r) => setTimeout(r, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  } while (runStatus.status !== "completed");

  const messages = await openai.beta.threads.messages.list(thread.id);
  const lastMessage = messages.data[0];

  res.json({
    reply: lastMessage.content[0].text.value,
    threadId: thread.id,
  });
});

app.listen(3001, () =>
  console.log("✅ Backend running on http://localhost:3001")
);
