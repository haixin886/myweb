
export const SidebarHeader = () => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/0304910d-dfec-4ec2-8262-c3baa22576ab.png" 
          alt="Admin" 
          className="w-8 h-8 rounded-full"
        />
        <div>
          <div className="font-medium">Admin</div>
          <div className="text-sm text-gray-500">管理员</div>
        </div>
      </div>
    </div>
  );
};
