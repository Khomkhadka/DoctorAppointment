import React, { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";

const ChatBox = () => {
  const { token, doctors } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I’m your Health Assistant. Ask me anything about our doctors or health.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const doctorsInfo =
    doctors?.map((doc) => {
      return `
Doctor:
- Name: ${doc.name}
- Email: ${doc.email}
- Specialty: ${doc.speciality}
- Degree: ${doc.degree}
- Experience: ${doc.experience}
- About: ${doc.about}
- Available: ${doc.available ? "Yes" : "No"}
- Fees: ${doc.fees}
- Address: ${doc.address?.street || ""}, ${doc.address?.city || ""}, ${doc.address?.state || ""}, ${doc.address?.zip || ""}
`;
    }).join("\n") || "No doctor data available.";

  const askOpenRouter = async (question) => {
    setLoading(true);
    const promptMessages = [
      {
        role: "system",
        content: `You are a helpful health assistant. Use the following doctors info to answer health questions ONLY. 
If the question is unrelated to health or doctors, politely say you can only answer health-related queries.

Doctors data:
${doctorsInfo}`,
      },
      {
        role: "user",
        content: question,
      },
    ];

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,

        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: promptMessages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter error:", response.status, errorText);
        throw new Error(`OpenRouter error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || "No response.";
    } catch (error) {
      console.error("Chat error:", error.message);
      return "Sorry, I’m having trouble answering right now.";
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const botReply = await askOpenRouter(input);
    const botMessage = { sender: "bot", text: botReply };
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  if (!isOpen) {
    return (
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
        onClick={() => setIsOpen(true)}
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[360px] h-[500px] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center rounded-t-xl">
        <h2 className="font-semibold">DocTime Health Assistant</h2>
        <button onClick={() => setIsOpen(false)} className="text-white text-xl font-bold">&times;</button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 border rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <p className="text-sm text-gray-400 italic">Typing...</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex border-t p-2 bg-white">
        <input
          className="flex-1 px-3 py-2 text-sm border rounded-l-md focus:outline-none"
          placeholder="Type a health question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-r-md disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
