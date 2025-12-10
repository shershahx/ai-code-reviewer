// 1. Import Packages
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

// 2. Setup Express App
const app = express();
const port = 3001; // We'll run the backend on port 3001
app.use(cors()); // Allow requests from our frontend
app.use(express.json()); // Allow app to read JSON from requests

// 3. Setup Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY not found.');
  process.exit(1);
}
const genAI = new GoogleGenAI(apiKey);

// 4. Create the /review API Endpoint
app.post('/review', async (req, res) => {
  try {
    // Get the code from the frontend's request
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'No code provided.' });
    }

    // Our "smart" prompt, now using the user's code
    const prompt = `
      You are an AI Code Reviewer. Your task is to analyze the following code snippet for readability issues related to variable names.
      
      Rules:
      1.  Analyze the code to find variable names that are 1 or 2 characters long (e.g., 'x', 'd', 'a').
      2.  Ignore common loop variables like 'i' or 'j'.
      3.  For each unclear variable you find, analyze the code to understand its purpose.
      4.  Suggest a new, descriptive variable name that reflects its context or usage.
      
      Output Format:
      Provide your feedback as a list. For each issue, first state the problem, then provide a specific suggestion.
      
      Example:
      - Issue: Variable 'x' is unclear.
        Suggestion: Rename 'x' to 'sum' because it stores the result of 'a + b'.
      ---
      Here is the code to review:
      ---
      ${code}
      ---
    `;

    // 5. Call the Gemini API
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    // DEBUG (optional) - inspect actual shape returned by the SDK
    //console.log('Raw API result for debugging:');
    //console.dir(result, { depth: null });

    // Robust extraction for different SDK response shapes
    let feedback;
    if (result.response) {
      feedback = typeof result.response.text === 'function'
        ? await result.response.text()
        : result.response.text;
    } else if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      // GenerateContentResponse shape
      feedback = result.candidates[0].content.parts[0].text;
    } else if (result.output?.[0]?.content?.[0]?.text) {
      // older/alternate shape
      feedback = result.output[0].content[0].text;
    } else {
      feedback = JSON.stringify(result, null, 2);
    }

    // 6. Send the AI's feedback *back* to the frontend
    res.json({ review: feedback });

  } catch (error) {
    console.error('Error in /review endpoint:', error);
    res.status(500).json({ error: 'Failed to get review from AI.' });
  }
});

// 7. Start the server
app.listen(port, () => {
  console.log(`AI Code Reviewer backend listening on http://localhost:${port}`);