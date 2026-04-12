/**
 * AI Utility for SparkWave Digital Solutions
 * Integrated with Groq API and strict Technology-Only guardrails
 */

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_BASE_URL = process.env.REACT_APP_GROQ_BASE_URL || 'https://api.groq.com/openai/v1';

export const generateAIResponse = async (prompt, type = 'chat') => {
  if (!GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not defined in .env");
    return { success: false, text: "AI Service is temporarily unavailable." };
  }

  try {
    // STRICT GUARDRAILS: The assistant must ONLY discuss technology and SparkWave services.
    const baseGuardrail = "IDENTITY: You are the SparkWave Digital AI Assistant. BOUNDARY: You ONLY provide expertise on technology, web development, mobile apps, software architecture, and digital marketing services provided by SparkWave. REJECTION: If asked about politics, religion, sports, personal life, or any non-technical topic, politely decline and steer the conversation back to SparkWave's technology services.";
    
    let systemPrompt = `${baseGuardrail} Specifically, you are assisting an admin with technical client inquiries.`;
    
    if (type === 'blog') {
      systemPrompt = `${baseGuardrail} You are now generating high-quality technical documentation and articles. Focus on industry trends, coding best practices, and tech ROI.`;
    }

    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.5, // Lower temperature for more factual/bounded responses
        max_tokens: type === 'blog' ? 2048 : 512,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      success: true,
      text: data.choices[0].message.content,
    };
  } catch (error) {
    console.error("AI Generation Error:", error.message);
    return {
      success: false,
      text: "I couldn't generate a response right now. Please try again soon.",
    };
  }
};
