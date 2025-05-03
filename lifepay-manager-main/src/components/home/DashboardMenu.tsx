
import React from "react";
import { toast } from "sonner";
import { Info, HelpCircle, Lock, FileText, Tag, X } from "lucide-react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const DashboardMenu = () => {
  const aboutUsContent = `【汇享生活缴费平台】——智汇生活，安心之选

📝【我们是谁】
作为朗新科技集团旗下核心民生服务平台，我们深耕生活缴费充值领域十余载，始终以"安全、便捷、高效"为服务宗旨，累计服务超千万用户，是行业公认的可信赖生活缴费行业标杆品牌。

📝【为什么选择我们】
朗新科技集团实力护航，安全有保障
依托朗新科技集团雄厚的资金实力与合规运营体系，平台已通过国家级信息安全认证，交易全程银行级加密防护，用户隐私与资金安全零风险。

✅ 【一站式智能缴费，省心更省力】
水电燃气、暖气物业、宽带话费、信用卡代还、花呗代还、抖币充值、快币充值、京东小时达、京东E卡、淘宝代付等一系列服务覆盖200+城市、超万家服务机构，7×24小时在线支持，账单实时查询，告别排队烦恼。

✅ 【十年口碑沉淀，服务值得信赖】
连续8年获评"消费者满意平台"，合作机构包括国家电网、中国移动、华润燃气等头部企业，交易系统稳定可靠，0重大事故记录。

📜【我们的承诺】
• 隐私数据"零留存"您的信息仅用于核验缴费
• 资金流向透明可追溯，全程受银联/网联监管
• 智能风险拦截系统，守护每一笔交易安全`;

  const privacyContent = `隐私政策
生效日期：2017年12月20日

【导言】
感谢您使用汇享生活便民充值缴费平台！我们深知个人信息对您的重要性，并承诺将您的隐私放在首位。本隐私政策旨在向您详细说明我们如何收集、使用、共享和保护您的个人信息。请您仔细阅读本隐私政策，确保您充分理解其中的内容。

【我们收集的信息】
为了向您提供便捷的生活缴费服务，我们可能会收集以下类型的信息：
• 个人身份信息： 姓名、身份证号码、联系方式（电话号码、电子邮件地址）、账单地址等。
• 缴费信息： 缴费单位、用户编号、缴费金额、缴费时间、缴费方式等。
• 设备信息： 您使用的设备型号、操作系统、IP地址、浏览器类型等。

【我们如何使用您的信息】
我们收集您的信息主要用于以下目的：
• 提供服务： 完成您的生活缴费订单，处理您的支付，提供账单查询等服务。
• 账户管理： 创建和管理您的账户��验证您的身份，���供客户支持。
• 改善服务： 分析您的使用习惯，优化我们的平台功能，提升用户体验。
• 安全保障： 保护您的账户安全，防止欺诈、盗用等行为。

【我们如何共享您的信息】
我们承诺不会将您的个人信息出售或出租给任何第三方。在以下情况下，我们可能会共享您的信息：
• 第三方服务提供商： 为了完成您的缴费订单，我们可能需要与第三方支付机构、银行等合作。我们会对这些合作方进行严格的筛选，并要求他们对您的信息进行保密。

【我们如何保护您的信息】
我们采取了严格的安全措施，以保护您的个人信息免受未经授权的访问、使用、泄露或损坏。这些措施包括：
• 数据加密： 我们使用SSL等技术对您的信息进行加密传输。
• 访问控制： 我们对您的信息进行严格的访问控制，只有授权人员才能访问。
• 安全审计： 我们定期对我们的系统进行安全审计，以确保您的信息安全。

【您的权利】
您有权访问、更正、删除您的个人信息。如果您需要行使这些权利，请联系我们。

【隐私政策的更新】
我们可能会不时更新本隐私政策。如果更新后的隐私政策对您的权益产生重大影响，我们会及时通知您。

【联系我们】
如果您对本隐私政策有任何疑问，请随时联系平台在线客服。

感谢您对我们的信任！`;

  const renderToastContent = (content: string) => (
    <div className="relative">
      <button 
        onClick={() => toast.dismiss()}
        className="absolute right-2 top-2 p-1 rounded-full hover:bg-gray-100"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="mt-6 whitespace-pre-line">
        {content}
      </div>
    </div>
  );

  const showToastWithCloseButton = (content: string) => {
    toast(renderToastContent(content), {
      duration: 100000,
      className: "max-w-xl"
    });
  };

  const menuItems = [
    { 
      icon: Info, 
      text: "关于我们", 
      onClick: () => showToastWithCloseButton(aboutUsContent)
    },
    { 
      icon: Lock, 
      text: "隐私政策", 
      onClick: () => showToastWithCloseButton(privacyContent)
    },
    { icon: HelpCircle, text: "帮助信息", onClick: () => toast.info("帮助信息") },
    { icon: FileText, text: "备案信息", onClick: () => toast.info("备案信息：粤ICP备xxx号") },
    { icon: Tag, text: "版本号", onClick: () => toast.info("当前版本：v1.0.0") },
  ];

  return (
    <SheetContent side="left" className="w-[300px]">
      <SheetHeader>
        <SheetTitle>菜单</SheetTitle>
      </SheetHeader>
      <div className="mt-6">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg text-gray-700"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.text}</span>
          </button>
        ))}
      </div>
    </SheetContent>
  );
};
