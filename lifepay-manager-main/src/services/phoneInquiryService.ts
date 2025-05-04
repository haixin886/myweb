// 使用原生 fetch API 代替 axios

// 手机号码查询API的接口
const PHONE_INQUIRY_API = 'https://api.taolale.com/api/Inquiry_Phone_Charges/get';
// API密钥 - 实际使用时应从环境变量或配置文件中获取
const API_KEY = 'tAooD3C5CtB31AGuW5xb8barX8'; // 已更新为正确的API密钥

// 手机号码查询结果接口
export interface PhoneInquiryResult {
  mobile: string;      // 查询的号码
  curFee: number;      // 查询的余额
  mobile_fee: number;  // 账户剩余余额
  province: string;    // 号码省份
  city: string;        // 号码地市
  sp: string;          // 最新运营商名称
  pri_sp: string;      // 原始运营商名称
}

// API响应接口
interface PhoneInquiryResponse {
  code: number;
  msg: string;
  data: PhoneInquiryResult;
  exec_time: number;
  ip: string;
}

/**
 * 查询手机号码的余额和归属地信息
 * @param mobile 手机号码
 * @param workType 运营商类型（可选）
 * @returns 查询结果
 */
export async function inquirePhoneInfo(mobile: string, workType?: string): Promise<PhoneInquiryResult | null> {
  try {
    // 构建请求参数
    const params = new URLSearchParams();
    params.append('key', API_KEY);
    params.append('mobile', mobile);
    if (workType) {
      params.append('work_type', workType);
    }

    // 发送POST请求
    const response = await fetch(PHONE_INQUIRY_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset:utf-8;'
      },
      body: params
    });

    // 解析JSON响应
    const responseData: PhoneInquiryResponse = await response.json();

    // 检查响应状态
    if (responseData.code === 200) {
      return responseData.data;
    } else {
      console.error('查询手机号码信息失败:', responseData.msg);
      return null;
    }
  } catch (error) {
    console.error('查询手机号码信息出错:', error);
    return null;
  }
}

/**
 * 格式化手机号码，确保是11位数字
 * @param mobile 手机号码
 * @returns 格式化后的手机号码，如果无效则返回null
 */
export function formatMobileNumber(mobile: string): string | null {
  // 移除所有非数字字符
  const cleaned = mobile.replace(/\D/g, '');
  
  // 检查是否是11位数字
  if (/^1\d{10}$/.test(cleaned)) {
    return cleaned;
  }
  
  return null;
}
