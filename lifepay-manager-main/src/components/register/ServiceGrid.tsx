export const ServiceGrid = () => {
  return (
    <div className="grid grid-cols-4 gap-4 bg-[#6c2bd9] p-6 rounded-2xl">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-black/10 rounded-xl mb-2 flex items-center justify-center">
          <img alt="话费充值" className="w-12 h-12 object-cover" src="/lovable-uploads/b8e03fb2-d9dc-466e-b842-3965e865afc1.png" />
        </div>
        <span className="text-white text-xs">话费充值</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-black/10 rounded-xl mb-2 flex items-center justify-center">
          <img alt="电费充值" className="w-12 h-12 object-contain" src="/lovable-uploads/33633912-8804-4b00-b43e-424c9174b630.png" />
        </div>
        <span className="text-white text-xs">电费充值</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-black/10 rounded-xl mb-2 flex items-center justify-center overflow-hidden">
          <img alt="抖币充值" className="w-12 h-12" src="/lovable-uploads/ddd73dcc-6f46-4f9e-bf3b-58a757ed4fe4.png" />
        </div>
        <span className="text-white text-xs">抖币充值</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-black/10 rounded-xl mb-2 flex items-center justify-center">
          <img 
            alt="花呗代还" 
            className="w-12 h-12 object-cover" 
            src="/lovable-uploads/2fdcb339-8c11-4d5a-83e0-2a16f55fccaa.png" 
          />
        </div>
        <span className="text-white text-xs">花呗代还</span>
      </div>
    </div>
  );
};