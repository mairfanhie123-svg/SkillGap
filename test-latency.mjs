const API_KEY = 'AIzaSyAZcxXO_ubJUC1TCJmDuVBJ6UeOd3GTdzI';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

async function callGemini(prompt, retries = 0) {
  const start = Date.now();
  console.log('Sending request to Gemini...');
  try {
    const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.log(`HTTP Error: ${res.status} ${errText}`);
      throw new Error("HTTP Error");
    }

    const data = await res.json();
    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(`Received raw response in ${Date.now() - start}ms`);

    // Clean up common JSON issues
    raw = raw.trim();
    raw = raw.replace(/,\s*}/g, '}');
    raw = raw.replace(/,\s*]/g, ']');

    try {
      const parsed = JSON.parse(raw);
      console.log('Parse successful!');
      return parsed;
    } catch (e) {
      console.log('Parse failed, original JSON:\n', raw);
      throw e;
    }
  } catch (err) {
    console.error(`Request failed after ${Date.now() - start}ms:`, err.message);
  }
}

const profile = {
  collegeName: "IIT Delhi",
  country: "India",
  branch: "Computer Science (CS)",
  semester: "4th",
  interests: ["Web Development", "Machine Learning / AI"],
  targetRole: "Software Development Engineer (SDE)"
};

const analysisPrompt = `
You are a career advisor AI for engineering students with access to real college curriculum data.
Student Profile:
- College/University: ${profile.collegeName}
- Country: ${profile.country}
- Branch: ${profile.branch}

Respond ONLY with a valid JSON object in this exact format, no extra text:
{
  "summary": "A 2-3 sentence honest assessment"
}
`;

console.time('Total Parallel Call');
Promise.all([
  callGemini(analysisPrompt),
  callGemini(analysisPrompt),
  callGemini(analysisPrompt)
]).then(() => {
  console.timeEnd('Total Parallel Call');
});
