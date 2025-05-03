
import { CustomSwitch } from "@/components/ui/custom-switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Merchant as User } from "../types";
import { formatCommission } from "../utils";

interface UserListProps {
  merchants?: User[];
  isLoading: boolean;
  onStatusChange: (userId: string, newStatus: boolean) => void;
}

export const MerchantList = ({ merchants, isLoading, onStatusChange }: UserListProps) => {
  return (
    <div className="border rounded-lg">
      <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
        <Table className="min-w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead className="w-[60px]">头像</TableHead>
              <TableHead className="w-[100px]">昵称</TableHead>
              <TableHead className="w-[120px]">手机号码</TableHead>
              <TableHead className="w-[180px]">用户等级</TableHead>
              <TableHead className="w-[100px]">账户余额(U)</TableHead>
              <TableHead className="w-[100px]">冻结余额(U)</TableHead>
              <TableHead className="w-[80px]">注册天数</TableHead>
              <TableHead className="w-[80px]">禁用账号</TableHead>
              <TableHead className="w-[120px]">登录IP</TableHead>
              <TableHead className="w-[140px]">创建时间</TableHead>
              <TableHead className="w-[180px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-4">加载中...</TableCell>
              </TableRow>
            ) : merchants?.map((merchant) => (
              <TableRow key={merchant.id}>
                <TableCell className="whitespace-nowrap">{merchant.id.slice(0, 8)}</TableCell>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={merchant.avatar_url || "/lovable-uploads/a02e3091-92f0-4c93-b7fc-a385c15b7825.png"}
                      alt={merchant.nickname || ''}
                    />
                    <AvatarFallback className="bg-blue-100">
                      {merchant.nickname?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="whitespace-nowrap">{merchant.nickname}</TableCell>
                <TableCell className="whitespace-nowrap">{merchant.phone}</TableCell>
                <TableCell>
                  <div className="whitespace-pre-line">{merchant.level || '普通用户'}</div>
                </TableCell>
                <TableCell className="whitespace-nowrap">{merchant.balance}</TableCell>
                <TableCell className="whitespace-nowrap">{merchant.frozen_balance}</TableCell>
                <TableCell className="whitespace-nowrap">{merchant.team_count || 0}</TableCell>
                <TableCell>
                  <CustomSwitch 
                    checked={merchant.status}
                    onCheckedChange={(checked) => onStatusChange(merchant.id, checked)}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">{merchant.ip_address}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {new Date(merchant.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Button size="sm" variant="dark" className="text-white">账单修改</Button>
                    <Button size="sm" variant="dark" className="text-white">分润配置</Button>
                    <Button size="sm" variant="dark" className="text-white">余额修改</Button>
                    <Button size="sm" variant="dark" className="text-white">重置密码</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
