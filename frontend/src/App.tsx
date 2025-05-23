import { useRef, useEffect, useState, KeyboardEvent, ChangeEvent } from "react";
import axios from "axios";

type Role = "user" | "assistant";

interface ChatMessage {
  role: Role;
  content: string;
  model?: string;
}

const App = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [useFineTunedModel, setUseFineTunedModel] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [, setActiveModel] = useState<string>("");
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:3001/api/completion", {
        messages: updatedMessages,
        useFineTunedModel,
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: res.data.reply,
        model: res.data.model,
      };

      setMessages([...updatedMessages, assistantMessage]);
      setActiveModel(res.data.model);
      setTokensUsed(res.data.tokens);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const toggleModel = (e: ChangeEvent<HTMLInputElement>) => {
    setUseFineTunedModel(e.target.checked);
  };

  const handleFeedback = async (messageIndex: number, feedback: "up" | "down") => {
    const assistantMessage = messages[messageIndex];
    
    // Find the most recent user message before this assistant reply
    const userMessage = [...messages.slice(0, messageIndex)]
      .reverse()
      .find((msg) => msg.role === "user");
  
    if (!userMessage) {
      console.error("No matching user message found.");
      return;
    }
  
    try {
      await axios.post("http://localhost:3001/api/feedback", {
        userMessage: userMessage.content,
        assistantReply: assistantMessage.content,
        feedback,
      });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  return (
    <div>
      {/* Toggle Chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-800 transition">Open Chat</button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-full sm:w-[380px] max-h-[85vh] bg-white shadow-xl rounded-lg flex flex-col z-50">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b bg-black">
            <div className="flex items-center space-x-2 text-white">
              <span className="font-semibold text-l">Chat</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${useFineTunedModel ? "bg-purple-600" : "bg-gray-600"}`}>
                {useFineTunedModel ? "Fine-Tuned" : "Base GPT-4"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm flex items-center text-white">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={useFineTunedModel}
                  onChange={toggleModel}
                />
                Use fine-tuned
              </label>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white text-xl">×</button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className="space-y-1">
                <div
                  className={`text-sm p-2 rounded-md ${msg.role === "user"
                      ? "bg-black text-white text-right ml-auto max-w-[85%]"
                      : "bg-white border max-w-[85%]"
                    }`}
                >
                  <strong>{msg.role}:</strong> {msg.content}

                  {/* Show model if assistant */}
                  {msg.role === "assistant" && msg.model && (
                    <div className="text-[10px] text-gray-400 mt-1">
                      Model: <span className="font-medium">{msg.model}</span>
                    </div>
                  )}
                </div>

                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 ml-2">
                    <button
                      onClick={() => handleFeedback(i, "up")}
                      className="hover:text-green-500 transition"
                    >
                      👍
                    </button>
                    <button
                      onClick={() => handleFeedback(i, "down")}
                      className="hover:text-red-500 transition"
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-center mt-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Token Info */}
          {(tokensUsed !== null) && (
            <div className="px-4 pb-2 text-xs text-gray-500 text-right pt-2 border-t">
              {tokensUsed !== null && <> Tokens used: {tokensUsed}</>}
            </div>
          )}

          {/* User Input */}
          <div className="flex items-center border-t p-3 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message"
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            {/* Send Button */}
            <button onClick={sendMessage} className="ml-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
