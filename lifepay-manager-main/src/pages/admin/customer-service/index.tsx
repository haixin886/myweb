
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/pages/admin/AdminLayout";

interface User {
  id: string;
  email: string;
  username: string;
  last_message_at: string;
  unread_count: number;
}

interface Message {
  id: string;
  content: string;
  sent_by_user: boolean;
  created_at: string;
  user: {
    username: string;
    email: string;
  };
}

// Sample data as a workaround for the missing table
const sampleUsers: User[] = [
  {
    id: "1",
    email: "user1@example.com",
    username: "用户A",
    last_message_at: new Date().toISOString(),
    unread_count: 2
  },
  {
    id: "2",
    email: "user2@example.com",
    username: "用户B",
    last_message_at: new Date(Date.now() - 3600000).toISOString(),
    unread_count: 0
  }
];

const sampleMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "101",
      content: "您好，我想了解一下充值流程",
      sent_by_user: true,
      created_at: new Date(Date.now() - 7200000).toISOString(),
      user: { username: "用户A", email: "user1@example.com" }
    },
    {
      id: "102",
      content: "您好！您可以在充值页面选择支付方式，然后按照提示操作即可完成充值。",
      sent_by_user: false,
      created_at: new Date(Date.now() - 7000000).toISOString(),
      user: { username: "客服", email: "admin@example.com" }
    },
    {
      id: "103",
      content: "我充值后多久能到账？",
      sent_by_user: true,
      created_at: new Date(Date.now() - 360000).toISOString(),
      user: { username: "用户A", email: "user1@example.com" }
    }
  ],
  "2": [
    {
      id: "201",
      content: "平台提现要多久到账？",
      sent_by_user: true,
      created_at: new Date(Date.now() - 3700000).toISOString(),
      user: { username: "用户B", email: "user2@example.com" }
    },
    {
      id: "202",
      content: "您好，一般情况下提现会在1-3个工作日内到账，具体到账时间取决于银行处理速度。",
      sent_by_user: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      user: { username: "客服", email: "admin@example.com" }
    }
  ]
};

const CustomerServiceAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading users
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from the database
        setUsers(sampleUsers);
        if (sampleUsers.length > 0 && !selectedUser) {
          setSelectedUser(sampleUsers[0].id);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error("获取用户列表失败");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      // Simulate loading messages for the selected user
      const loadMessages = async () => {
        try {
          const userMessages = sampleMessages[selectedUser] || [];
          setMessages(userMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
          toast.error("获取消息失败");
        }
      };

      loadMessages();
    }
  }, [selectedUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      // Add message to UI immediately
      const tempMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sent_by_user: false,
        created_at: new Date().toISOString(),
        user: {
          username: "客服",
          email: "admin@example.com"
        }
      };

      setMessages(prev => [...prev, tempMessage]);
      setNewMessage("");

      // In a production app, you would save to database here
      toast.success("消息已发送");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("发送消息失败");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN') + ' ' + 
           date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">客服管理</h1>
        
        <Card className="p-0 overflow-hidden">
          <Tabs defaultValue="chat" className="h-[calc(100vh-180px)]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">实时聊天</TabsTrigger>
              <TabsTrigger value="stats">数据统计</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="h-full">
              <div className="grid grid-cols-4 h-full">
                {/* User list */}
                <div className="col-span-1 border-r h-full overflow-y-auto">
                  <div className="p-3 font-medium border-b">联系人列表</div>
                  {isLoading ? (
                    <div className="flex justify-center p-6">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div>
                      {users.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">暂无用户咨询</div>
                      ) : (
                        users.map(user => (
                          <div 
                            key={user.id}
                            className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                              selectedUser === user.id ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => setSelectedUser(user.id)}
                          >
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src="/lovable-uploads/fed27bfa-2d72-4a2e-a004-8b21c76ad241.png" />
                                <AvatarFallback>{user.username[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium truncate">{user.username}</span>
                                  {user.unread_count > 0 && (
                                    <Badge variant="destructive" className="ml-2">
                                      {user.unread_count}
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {formatTime(user.last_message_at)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                
                {/* Chat area */}
                <div className="col-span-3 flex flex-col h-full">
                  {!selectedUser ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      请选择一个用户进行对话
                    </div>
                  ) : (
                    <>
                      {/* Chat header */}
                      <div className="p-4 border-b">
                        <div className="font-medium">
                          {users.find(u => u.id === selectedUser)?.username || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {users.find(u => u.id === selectedUser)?.email || 'No email'}
                        </div>
                      </div>
                      
                      {/* Messages */}
                      <div className="flex-1 p-4 overflow-y-auto">
                        {messages.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            暂无消息记录
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.map(message => (
                              <div 
                                key={message.id}
                                className={`flex ${message.sent_by_user ? 'justify-start' : 'justify-end'}`}
                              >
                                <div className={`flex items-start max-w-[70%] ${message.sent_by_user ? 'flex-row' : 'flex-row-reverse'}`}>
                                  <Avatar className={`w-8 h-8 ${message.sent_by_user ? 'mr-2' : 'ml-2'}`}>
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
                                        ? 'bg-gray-100 text-gray-800 rounded-tl-none' 
                                        : 'bg-blue-500 text-white rounded-tr-none'
                                    }`}>
                                      {message.content}
                                    </div>
                                    <div className={`text-xs text-gray-500 mt-1 ${message.sent_by_user ? 'text-left' : 'text-right'}`}>
                                      {formatTime(message.created_at)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Input area */}
                      <div className="p-3 border-t flex">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="输入回复消息..."
                          className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          className="rounded-l-none"
                        >
                          发送
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">客服数据统计</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="text-lg font-medium">总咨询量</div>
                    <div className="text-3xl font-bold mt-2">{users.length}</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-lg font-medium">今日咨询</div>
                    <div className="text-3xl font-bold mt-2">0</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-lg font-medium">平均响应时间</div>
                    <div className="text-3xl font-bold mt-2">5分钟</div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CustomerServiceAdmin;
