
import { Route, Routes } from "react-router-dom"
import Dashboard from "./Dashboard"
import PaymentSettingsPage from "./payment/settings/PaymentSettingsPage"
import PaymentAddressesPage from "./payment/addresses/PaymentAddressesPage"
import PaymentChannelsPage from "./payment/channels/PaymentChannelsPage"
import NewPaymentChannelPage from "./payment/channels/new/NewPaymentChannelPage"
import EditPaymentChannelPage from "./payment/channels/edit/EditPaymentChannelPage"
import AdminLayout from "@/components/admin/AdminLayout"
import Login from "./Login"
import AdminSettings from "./settings"
import OnlineOrdersPage from "./online-orders"
import BusinessOrdersPage from "./business-orders"
import MerchantsPage from "./merchants"
import OrderProcessingCenter from "./order-processing"
import AgentProfitPage from "./profit"
import MerchantRiskControl from "./merchant-risk"
import DataDashboardPage from "./data-dashboard"
import ApiManagementPage from "./api-management"
import AgentsPage from "./agents"
import AdminUsersPage from "./users"
import FinanceIndexPage from "./finance"
import PaymentManagementPage from "./finance/payment"
import RechargeOrdersPage from "./finance/recharge-orders"
import ProtectedRoute from "@/components/admin/ProtectedRoute"
import TestDatabaseConnection from "./TestDatabaseConnection"

const AdminRoutes = () => {
  return (
    <Routes>
      {/* 登录页面不需要认证保护 */}
      <Route path="login" element={<Login />} />
      
      {/* 测试路由，不需要认证保护 */}
      <Route path="test-db-public" element={<TestDatabaseConnection />} />
      
      {/* 使用 ProtectedRoute 保护管理后台路由 */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="payment/settings" element={<PaymentSettingsPage />} />
          <Route path="payment/addresses" element={<PaymentAddressesPage />} />
          <Route path="payment/channels" element={<PaymentChannelsPage />} />
          <Route path="payment/channels/new" element={<NewPaymentChannelPage />} />
          <Route path="payment/channels/edit/:id" element={<EditPaymentChannelPage />} />
          
          {/* 财务管理路由 */}
          <Route path="finance" element={<FinanceIndexPage />} />
          <Route path="finance/payment" element={<PaymentManagementPage />} />
          <Route path="finance/recharge-orders" element={<RechargeOrdersPage />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="online-orders" element={<OnlineOrdersPage />} />
          <Route path="business-orders" element={<BusinessOrdersPage />} />
          {/* 新增路由配置 */}
          <Route path="merchants" element={<MerchantsPage />} />
          <Route path="order-processing" element={<OrderProcessingCenter />} />
          <Route path="profit" element={<AgentProfitPage />} />
          <Route path="merchant-risk" element={<MerchantRiskControl />} />
          <Route path="data-dashboard" element={<DataDashboardPage />} />
          <Route path="api-management" element={<ApiManagementPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="test-db" element={<TestDatabaseConnection />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AdminRoutes
