
import MerchantLayout from "@/modules/merchant/layout/MerchantLayout";
import { CustomerService } from "@/components/CustomerService";

const CustomerServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MerchantLayout title="在线客服" showNotification={false}>
        <div className="max-w-2xl mx-auto">
          <CustomerService />
        </div>
      </MerchantLayout>
    </div>
  );
};

export default CustomerServicePage;
