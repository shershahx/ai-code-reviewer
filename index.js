// 1. Import required packages
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

// 2. Get the API key from the .env file
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY not found. Please create a .env file.');
  process.exit(1);
}

// 3. Initialize the Gemini AI client
const genAI = new GoogleGenAI(apiKey);

// 4. Define the code we want to review
// This is our "Input Code" as required by the brief
const codeToReview = `
function calculate(a, b) {
  let x = a + b;
  let y = x * 2;
  return y;
}

function process(d) {
  // 'd' is data
  if (d.length > 0) {
    console.log('Processing');
  }
}
`;

// 5. Define the prompt we designed
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
${codeToReview}
---
`;
// 6. Define the main function to run the AI
async function runReview() {
  try {
    console.log('Sending code to AI for review...');
    
    // 7. Send the prompt to the API
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    // 8. **** THIS IS THE CORRECTED PART ****
    // The 'result' object has a 'response' property.
    // The 'response' object has a 'text()' METHOD (a function).
   // console.log('Raw API result for debugging:');
   // console.dir(result, { depth: null });

    let feedback;
    if (result.response) {
      if (typeof result.response.text === 'function') {
        feedback = await result.response.text();
      } else {
        feedback = result.response.text;
      }
    } else if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      // handle GenerateContentResponse shape
      feedback = result.candidates[0].content.parts[0].text;
    } else if (result.output?.[0]?.content?.[0]?.text) {
      // fallback to older/alternate shapes
      feedback = result.output[0].content[0].text;
    } else {
      feedback = JSON.stringify(result, null, 2);
    }

    // 9. Display the result in a readable format
    console.log('--- AI Review Feedback ---');
    console.log(feedback);
    console.log('--------------------------');

  } catch (error) {
    console.error('Error during AI review:', error);
  }
}

// 10. Run the function
runReview();