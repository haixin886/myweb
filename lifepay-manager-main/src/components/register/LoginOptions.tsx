
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const LoginOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-4 mb-12">
      <Card 
        className="p-4 flex flex-col items-center justify-center bg-gradient-to-br from-[#e8fff7] to-[#f3fffc] border-none cursor-pointer"
        onClick={() => navigate("/login")}
      >
        <div className="w-12 h-12 bg-[#00ffa3] rounded-xl mb-2 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className="text-sm font-medium">用户登录</span>
      </Card>

      <Card 
        className="p-4 flex flex-col items-center justify-center bg-gradient-to-br from-[#fff1f8] to-[#fff5f9] border-none cursor-pointer"
        onClick={() => navigate("/register")}
      >
        <div className="w-12 h-12 bg-[#ff4d94] rounded-xl mb-2 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className="text-sm font-medium">用户注册</span>
      </Card>
    </div>
  );
};
