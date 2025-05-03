
import { MessageSquare, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sent_by_user: boolean;
  timestamp: Date;
}

export const CustomerService = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
    
    // Load initial welcome message if no messages
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content: "欢迎使用在线客服，请问有什么可以帮助您的吗？",
        sent_by_user: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("请先登录");
        return;
      }

      // Add message to UI immediately for better UX
      const userMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sent_by_user: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage("");

      // In a production app, you would store this in a database
      // Since we're working around the missing table, we'll simulate a response

      // Simulate a delay for auto-reply
      setTimeout(() => {
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          content: "感谢您的咨询，客服人员会尽快回复您的问题。",
          sent_by_user: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, autoReply]);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("发送消息失败");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-[500px] max-h-[80vh] bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
        <h2 className="font-medium">在线客服</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
            <p>没有消息记录</p>
            <p className="text-sm">发送消息开始咨询</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sent_by_user ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-[80%] ${message.sent_by_user ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className={`w-8 h-8 ${message.sent_by_user ? 'ml-2' : 'mr-2'}`}>
                  {message.sent_by_user ? (
                    <AvatarImage src="/lovable-uploads/fed27bfa-2d72-4a2e-a004-8b21c76ad241.png" />
                  ) : (
                    <AvatarImage src="/lovable-uploads/15201ab3-e961-4298-8525-ebd51fcbefc5.png" />
                  )}
                  <AvatarFallback>{message.sent_by_user ? '用户' : '客服'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className={`px-3 py-2 rounded-lg ${
                    message.sent_by_user 
                      ? 'bg-blue-500 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    {message.content}
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${message.sent_by_user ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t flex items-center">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="输入消息..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <Button 
          onClick={handleSendMessage} 
          className="ml-2 bg-blue-500 hover:bg-blue-600"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
