// check-status.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

async function checkStatus() {
  const jobId = "ftjob-I9Ra2mnNfRJfS3BMlkkRQ8xx"; // your fine-tune job ID

  try {
    const job = await openai.fineTuning.jobs.retrieve(jobId);
    console.log("📦 Job Status:", job.status);
    console.log("🔍 Details:", job);
  } catch (error) {
    console.error("❌ Error fetching job status:", error);
  }
}

checkStatus();
