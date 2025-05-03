
import { Button } from "@/components/ui/button";
import { RechargeEntry } from "@/types/recharge";

interface BatchRechargeFormProps {
  entries: RechargeEntry[];
  onEntriesChange: (entries: RechargeEntry[]) => void;
  onSwitchMode: () => void;
}

export const BatchRechargeForm = ({
  entries,
  onEntriesChange,
  onSwitchMode
}: BatchRechargeFormProps) => {
  const handleAddEntry = () => {
    onEntriesChange([...entries, { cardInfo: "", name: "", amount: "" }]);
  };

  const handleRemoveEntry = (index: number) => {
    if (entries.length > 1) {
      onEntriesChange(entries.filter((_, i) => i !== index));
    }
  };

  const handleEntryChange = (index: number, field: keyof RechargeEntry, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onEntriesChange(newEntries);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">批量充值</h3>
        <Button 
          variant="outline"
          onClick={onSwitchMode}
        >
          切换单笔充值
        </Button>
      </div>
      
      {entries.map((entry, index) => (
        <div key={index} className="bg-white p-4 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">充值项 {index + 1}</span>
            {entries.length > 1 && (
              <button
                onClick={() => handleRemoveEntry(index)}
                className="text-red-500"
              >
                删除
              </button>
            )}
          </div>
          <input
            placeholder="手机号码"
            value={entry.cardInfo}
            onChange={(e) => handleEntryChange(index, "cardInfo", e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            placeholder="姓名(选填)"
            value={entry.name}
            onChange={(e) => handleEntryChange(index, "name", e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            placeholder="充值金额"
            value={entry.amount}
            onChange={(e) => handleEntryChange(index, "amount", e.target.value)}
            className="w-full p-2 border rounded"
            type="number"
          />
        </div>
      ))}
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleAddEntry}
      >
        添加充值项
      </Button>
    </div>
  );
};
