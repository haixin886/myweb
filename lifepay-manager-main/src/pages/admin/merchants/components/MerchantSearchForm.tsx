
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchParams } from "../types";
import { AddUserSheet } from "./AddMerchantSheet";

interface UserSearchFormProps {
  searchParams?: SearchParams;
  onSearchParamsChange?: (params: SearchParams) => void;
  onSearch: (params: SearchParams) => void;
  onReset: () => void;
}

export const MerchantSearchForm = ({
  searchParams = {},
  onSearchParamsChange,
  onSearch,
  onReset,
}: UserSearchFormProps) => {
  // 如果没有提供 onSearchParamsChange，创建一个内部状态
  const [internalParams, setInternalParams] = useState<SearchParams>(searchParams);
  
  // 使用内部状态或外部状态
  const params = onSearchParamsChange ? searchParams : internalParams;
  
  // 更新参数的函数
  const updateParams = (newParams: SearchParams) => {
    if (onSearchParamsChange) {
      onSearchParamsChange(newParams);
    } else {
      setInternalParams(newParams);
    }
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 w-[4.5rem] shrink-0">用户信息</span>
          <Input 
            placeholder="请输入用户昵称" 
            value={params.nickname || ''}
            onChange={(e) => updateParams({ ...params, nickname: e.target.value })}
            className="w-full" 
            variant="dark"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 w-[4.5rem] shrink-0">手机号码</span>
          <Input 
            placeholder="请输入手机号" 
            value={params.phone || ''}
            onChange={(e) => updateParams({ ...params, phone: e.target.value })}
            className="w-full" 
            variant="dark"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 w-[4.5rem] shrink-0">禁用账号</span>
          <Select 
            value={params.status || ''}
            onValueChange={(value) => updateParams({ ...params, status: value })}
          >
            <SelectTrigger className="w-full bg-black text-white">
              <SelectValue placeholder="请选择账号禁用状态" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-md">
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="enabled">启用</SelectItem>
              <SelectItem value="disabled">禁用</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 w-[4.5rem] shrink-0">注册时间</span>
          <div className="flex items-center gap-2 w-full">
            <Input 
              type="date" 
              className="flex-1"
              value={params.startDate || ''}
              onChange={(e) => updateParams({ ...params, startDate: e.target.value })}
              variant="dark"
            />
            <span>-</span>
            <Input 
              type="date" 
              className="flex-1"
              value={params.endDate || ''}
              onChange={(e) => updateParams({ ...params, endDate: e.target.value })}
              variant="dark"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="dark" 
          onClick={(e) => {
            e.preventDefault();
            onSearch(params);
          }}
        >
          搜索
        </Button>
        <Button 
          variant="dark" 
          onClick={(e) => {
            e.preventDefault();
            onReset();
            if (!onSearchParamsChange) {
              setInternalParams({});
            }
          }}
        >
          重置
        </Button>
      </div>
    </div>
  );
};
