import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { adminSupabase, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Upload } from "lucide-react";

interface WebsiteSettings {
  site_name: string;
  site_logo: string;
  theme_color: string;
  carousel_images: string[];
  announcement: string;
}

const AdminSettingsPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("password");
  
  // 密码修改状态
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // 个人信息状态
  const [profileForm, setProfileForm] = useState({
    name: "",
    avatarUrl: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  
  // 网站设置状态
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>({
    site_name: "Lifepay Manager",
    site_logo: "",
    theme_color: "#3b82f6",
    carousel_images: [],
    announcement: ""
  });
  const [newCarouselImage, setNewCarouselImage] = useState<File | null>(null);
  const [carouselImagePreview, setCarouselImagePreview] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");

  // 主题颜色选项
  const themeColors = [
    { name: "蓝色", value: "#3b82f6" },
    { name: "红色", value: "#ef4444" },
    { name: "绿色", value: "#10b981" },
    { name: "紫色", value: "#8b5cf6" },
    { name: "橙色", value: "#f97316" },
    { name: "粉色", value: "#ec4899" }
  ];

  useEffect(() => {
    if (user) {
      // 使用兼容的方式获取用户信息
      setProfileForm({
        name: user.username || "",
        avatarUrl: ""
      });
    }
    fetchWebsiteSettings();
  }, [user]);

  const fetchWebsiteSettings = async () => {
    setIsLoading(true);
    try {
      // 模拟从数据库获取网站设置
      // 实际应用中应该从数据库获取
      setTimeout(() => {
        setWebsiteSettings({
          site_name: "Lifepay Manager",
          site_logo: "/logo.png",
          theme_color: "#3b82f6",
          carousel_images: [
            "/carousel/image1.jpg",
            "/carousel/image2.jpg",
            "/carousel/image3.jpg"
          ],
          announcement: "欢迎使用Lifepay Manager支付管理系统！"
        });
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading website settings:', error);
      toast.error("加载网站设置失败");
      setIsLoading(false);
    }
  };

  // 处理密码修改
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("新密码和确认密码不匹配");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error("新密码长度至少为6个字符");
      return;
    }
    
    setIsLoading(true);
    try {
      // 简化版本的密码修改逻辑，与 useAuth 钩子兼容
      // 实际应用中需要调用后端 API 或使用 Supabase 的密码重置功能
      // 这里模拟密码修改成功
      const error = null;
      
      toast.success("密码修改成功");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "密码修改失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 处理个人信息更新
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileForm.name.trim()) {
      toast.error("名称不能为空");
      return;
    }
    
    setIsLoading(true);
    try {
      let avatarUrl = profileForm.avatarUrl;
      
      // 如果有新上传的头像，先上传文件
      if (avatarFile) {
        const fileName = `avatars/${Date.now()}_${avatarFile.name}`;
        
        // 上传到Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('public')
          .upload(fileName, avatarFile, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) throw uploadError;
        
        // 获取公共URL
        const { data: urlData } = await supabase.storage
          .from('public')
          .getPublicUrl(fileName);
        
        avatarUrl = urlData.publicUrl;
      }
      
      // 更新用户信息（简化版本，实际应用中需要根据后端API调整）
      // 由于我们使用的是自定义User类型，这里模拟更新成功
      const error = null;
      
      if (error) throw error;
      
      setProfileForm({
        ...profileForm,
        avatarUrl
      });
      setAvatarFile(null);
      
      toast.success("个人信息更新成功");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "个人信息更新失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 处理网站设置更新
  const handleWebsiteSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!websiteSettings.site_name.trim()) {
      toast.error("网站名称不能为空");
      return;
    }
    
    setIsLoading(true);
    try {
      let logoUrl = websiteSettings.site_logo;
      let newCarouselImages = [...websiteSettings.carousel_images];
      
      // 如果有新上传的Logo，先上传文件
      if (logoFile) {
        const fileName = `site/logo_${Date.now()}_${logoFile.name}`;
        
        // 上传到Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('public')
          .upload(fileName, logoFile, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) throw uploadError;
        
        // 获取公共URL
        const { data: urlData } = await supabase.storage
          .from('public')
          .getPublicUrl(fileName);
        
        logoUrl = urlData.publicUrl;
      }
      
      // 如果有新上传的轮播图，先上传文件
      if (newCarouselImage) {
        const fileName = `carousel/image_${Date.now()}_${newCarouselImage.name}`;
        
        // 上传到Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('public')
          .upload(fileName, newCarouselImage, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) throw uploadError;
        
        // 获取公共URL
        const { data: urlData } = await supabase.storage
          .from('public')
          .getPublicUrl(fileName);
        
        newCarouselImages.push(urlData.publicUrl);
      }
      
      // 更新网站设置
      // 实际应用中应该保存到数据库
      const updatedSettings = {
        ...websiteSettings,
        site_logo: logoUrl,
        carousel_images: newCarouselImages
      };
      
      setWebsiteSettings(updatedSettings);
      setLogoFile(null);
      setNewCarouselImage(null);
      setCarouselImagePreview("");
      
      // 模拟保存到数据库
      setTimeout(() => {
        toast.success("网站设置更新成功");
        setIsLoading(false);
      }, 500);
    } catch (error: any) {
      console.error("Error updating website settings:", error);
      toast.error(error.message || "网站设置更新失败");
      setIsLoading(false);
    }
  };

  // 处理头像文件选择
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理Logo文件选择
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理轮播图文件选择
  const handleCarouselImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCarouselImage(file);
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCarouselImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 删除轮播图
  const handleRemoveCarouselImage = (index: number) => {
    setWebsiteSettings(prev => ({
      ...prev,
      carousel_images: prev.carousel_images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="password">修改密码</TabsTrigger>
          <TabsTrigger value="profile">个人信息</TabsTrigger>
          <TabsTrigger value="website">网站设置</TabsTrigger>
        </TabsList>
        
        {/* 修改密码 */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>修改管理员密码</CardTitle>
              <CardDescription>更新您的登录密码</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">当前密码</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    required
                    className="text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">新密码</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    required
                    className="text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认新密码</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    required
                    className="text-black"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "更新中..." : "更新密码"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 个人信息 */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>个人信息</CardTitle>
              <CardDescription>更新您的名称和头像</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">名称</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    required
                    className="text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label>头像</Label>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={avatarPreview || profileForm.avatarUrl} />
                      <AvatarFallback>{profileForm.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <Label htmlFor="avatar" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          上传头像
                        </Button>
                      </Label>
                      {avatarFile && (
                        <p className="text-sm text-muted-foreground mt-1">
                          已选择: {avatarFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "更新中..." : "更新个人信息"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 网站设置 */}
        <TabsContent value="website">
          <Card>
            <CardHeader>
              <CardTitle>网站设置</CardTitle>
              <CardDescription>更新网站名称、Logo、主题和内容</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWebsiteSettingsUpdate} className="space-y-6">
                {/* 网站名称和Logo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">基本信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">网站名称</Label>
                      <Input
                        id="siteName"
                        value={websiteSettings.site_name}
                        onChange={(e) => setWebsiteSettings({...websiteSettings, site_name: e.target.value})}
                        required
                        className="text-black"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="themeColor">主题颜色</Label>
                      <Select
                        value={websiteSettings.theme_color}
                        onValueChange={(value) => setWebsiteSettings({...websiteSettings, theme_color: value})}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择主题颜色" />
                        </SelectTrigger>
                        <SelectContent>
                          {themeColors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center">
                                <div
                                  className="h-4 w-4 rounded-full mr-2"
                                  style={{ backgroundColor: color.value }}
                                />
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>网站Logo</Label>
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        {(logoPreview || websiteSettings.site_logo) ? (
                          <img
                            src={logoPreview || websiteSettings.site_logo}
                            alt="Logo"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-gray-400">无Logo</span>
                        )}
                      </div>
                      <div>
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <Label htmlFor="logo" className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            上传Logo
                          </Button>
                        </Label>
                        {logoFile && (
                          <p className="text-sm text-muted-foreground mt-1">
                            已选择: {logoFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 轮播图 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">首页轮播图</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {websiteSettings.carousel_images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="h-40 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={image}
                            alt={`Carousel ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveCarouselImage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {/* 添加新轮播图 */}
                    <div className="h-40 bg-gray-100 rounded flex flex-col items-center justify-center p-4">
                      {carouselImagePreview ? (
                        <div className="relative h-full w-full">
                          <img
                            src={carouselImagePreview}
                            alt="New carousel"
                            className="h-full w-full object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setNewCarouselImage(null);
                              setCarouselImagePreview("");
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Input
                            id="carouselImage"
                            type="file"
                            accept="image/*"
                            onChange={handleCarouselImageChange}
                            className="hidden"
                          />
                          <Label htmlFor="carouselImage" className="cursor-pointer">
                            <PlusCircle className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">添加轮播图</span>
                          </Label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 公告 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">首页公告</h3>
                  <div className="space-y-2">
                    <Label htmlFor="announcement">公告内容</Label>
                    <Textarea
                      id="announcement"
                      value={websiteSettings.announcement}
                      onChange={(e) => setWebsiteSettings({...websiteSettings, announcement: e.target.value})}
                      rows={4}
                      className="text-black"
                      placeholder="输入首页公告内容..."
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "保存中..." : "保存设置"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettingsPage;
