// fine-tune.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log("✅ ENV Test:", process.env.OPENAI_API_KEY);
const fs = require("fs");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID, // Optional
});

async function runFineTune() {
  try {
    const file = await openai.files.create({
      file: fs.createReadStream("data/training_data.jsonl"),
      purpose: "fine-tune",
    });

    console.log("✅ File uploaded:", file.id);

    const job = await openai.fineTuning.jobs.create({
      training_file: file.id,
      model: "gpt-3.5-turbo",
    });

    console.log("🚀 Fine-tuning started:", job.id);
  } catch (error) {
    console.error("❌ Error during fine-tuning:", error);
  }
}

runFineTune();
