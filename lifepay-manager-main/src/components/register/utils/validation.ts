
export const validateUsername = (username: string): string | null => {
  if (!username) return "请填写账号";
  return null;
};

export const validatePassword = (password: string, confirmPassword: string): string | null => {
  if (!password) return "请填写密码";
  if (password !== confirmPassword) return "两次输入的密码不一致";
  return null;
};

export const validateInviteCode = (inviteCode: string): string | null => {
  if (!inviteCode) return "请填入邀请码";
  return null;
};
