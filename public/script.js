const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Add user's message to chat
  appendMessage("user", userMessage);
  input.value = "";

  // Create temporary thinking bubble
  const thinkingBubble = appendMessage("bot", "Thinking…");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation: [{ role: "user", text: userMessage }]
      })
    });

    if (!response.ok) throw new Error("Server error");

    const data = await response.json();

    if (data && data.result) {
      thinkingBubble.textContent = data.result;
    } else {
      thinkingBubble.textContent = "Sorry, no response received.";
    }

  } catch (error) {
    console.error("Chat error:", error);
    thinkingBubble.textContent = "Failed to get response from server.";
  }
});

// Helper: add chat bubble
function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `message ${role}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
