exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body || "{}");
    const message = body.message || "";
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: "API key not configured." })
      };
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: "You are Nova, an intelligent assistant." },
          { role: "user", content: message }
        ],
        max_tokens: 200
      })
    });
    const data = await response.json();
    const reply = data.choices && data.choices[0]?.message?.content?.trim();
    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Error generating response." })
    };
  }
};
