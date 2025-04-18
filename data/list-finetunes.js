// list-finetunes.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

async function listJobs() {
  const jobs = await openai.fineTuning.jobs.list();
  console.log(jobs);
}

listJobs();
