import { useState, KeyboardEvent, ChangeEvent } from "react";
import axios from "axios";

type Role = "user" | "assistant";

interface ChatMessage {
  role: Role;
  content: string;
}

const App = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [useFineTunedModel, setUseFineTunedModel] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");

    try {
      const res = await axios.post("http://localhost:3001/api/completion", {
        messages: updatedMessages,
        useFineTunedModel,
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: res.data.reply,
      };

      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const toggleModel = (e: ChangeEvent<HTMLInputElement>) => {
    setUseFineTunedModel(e.target.checked);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <div style={{ minHeight: "300px", border: "1px solid #ccc", padding: "1rem" }}>
        {messages.map((msg, i) => (
          <p key={i}>
            <strong>{msg.role}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
        style={{ width: "100%", marginTop: "1rem" }}
      />
      <div style={{ marginTop: "1rem" }}>
        <label>
          <input type="checkbox" checked={useFineTunedModel} onChange={toggleModel} />
          Use fine-tuned model
        </label>
      </div>
    </div>
  );
};

export default App;
