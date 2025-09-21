import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bot,
  User,
  Send,
  ArrowLeft,
  MessageCircle,
  Sparkles,
  Loader,
} from "lucide-react";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";

export default function CareerChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const messagesEndRef = useRef(null);

  const handleFinish = useCallback((message) => {
    setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    setStreamingMessage("");
    setIsLoading(false);
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  useEffect(() => {
    loadUserProfile();
    // Add welcome message
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I'm your AI Career Advisor. I'm here to help you with any questions about your career path, courses, universities, or job opportunities. Feel free to ask me anything!",
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const userData = await response.json();
        setUserProfile(userData);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !handleStreamResponse) return;

    const userMessage = { role: "user", content: inputMessage.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Prepare context about the user for the AI
      const systemContext = userProfile
        ? `
User Profile Context:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Education: ${userProfile.educationLevel} from ${userProfile.boardUniversity || "N/A"}
- Grade: ${userProfile.gradePercentage || "N/A"} ${userProfile.gradeType || ""}
- Interests: ${userProfile.interests?.join(", ") || "Not specified"}
- Budget: ₹${userProfile.budgetMin || 0} - ₹${userProfile.budgetMax || 0}
- Location Preference: ${userProfile.preferredLocation || "Not specified"}
- Accommodation: ${userProfile.accommodationType || "Not specified"}

You are an expert Indian career counselor. Use this profile context to provide personalized advice. Always consider the Indian education system, job market, and cultural context in your responses.
`
        : "You are an expert Indian career counselor. Provide helpful career guidance.";

      const response = await fetch("/integrations/google-gemini-2-5-pro/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemContext },
            ...newMessages,
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      await handleStreamResponse(response);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What career options match my interests?",
    "Which universities should I consider?",
    "How can I improve my career prospects?",
    "What courses should I take next?",
    "Tell me about job market trends in my field",
  ];

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
  };

  const goBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>

              <div className="w-px h-8 bg-gray-300" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    AI Career Advisor
                  </h1>
                  <p className="text-sm text-gray-500">
                    {userProfile?.name
                      ? `Helping ${userProfile.name.split(" ")[0]}`
                      : "Personalized career guidance"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700">
                  AI Online
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 px-3 py-2 bg-gray-50 rounded-lg">
                <Sparkles className="w-4 h-4" />
                <span>Powered by Gemini</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
              )}

              <div
                className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>

                <div
                  className={`text-xs mt-2 ${
                    message.role === "user" ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {message.role === "user" && (
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
              )}
            </div>
          ))}

          {/* Streaming message */}
          {streamingMessage && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="max-w-[70%] p-4 rounded-2xl bg-white border border-gray-200 text-gray-800 shadow-sm">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {streamingMessage}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <span className="text-xs text-blue-600 font-medium">
                    AI is typing...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Suggested Questions (show when no messages) */}
          {messages.length <= 1 && !isLoading && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  How can I help you today?
                </h3>
                <p className="text-gray-600">
                  Choose a question below or ask me anything about your career
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                        <MessageCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                          {question}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Click to ask this question
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your career, courses, universities, or job opportunities..."
                  className="w-full p-4 pr-12 border-2 border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  rows="3"
                  disabled={isLoading}
                />

                {inputMessage.trim() && (
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {inputMessage.length} characters
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={
                !inputMessage.trim() || isLoading || !handleStreamResponse
              }
              className={`p-4 rounded-2xl transition-all duration-200 flex items-center justify-center ${
                inputMessage.trim() && !isLoading && handleStreamResponse
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Press Enter to send, Shift+Enter for new line</span>
              {userProfile && (
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span>
                    Profile: {userProfile.educationLevel} •{" "}
                    {userProfile.interests?.slice(0, 2).join(", ")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>AI Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
