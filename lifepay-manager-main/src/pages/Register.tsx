
import { useNavigate } from "react-router-dom";
import { RegisterHeader } from "@/components/register/RegisterHeader";
import { RegisterForm } from "@/components/register/RegisterForm";
import { LoginOptions } from "@/components/register/LoginOptions";
import { ServiceGrid } from "@/components/register/ServiceGrid";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <RegisterHeader />

      <div className="px-6 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">全方位无忧</h1>
          <p className="text-gray-500">信息加密、智能交易、资金全额承保</p>
        </div>

        <RegisterForm onSuccess={() => navigate("/dashboard")} />
        <LoginOptions />
        <ServiceGrid />
      </div>
    </div>
  );
};

export default Register;
