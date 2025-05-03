import React from 'react';

const TestApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1 style={{ color: '#333' }}>汇享生活 - 测试页面</h1>
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        这是一个测试页面，用于验证应用程序是否能正常显示。如果您能看到这个页面，说明基本渲染功能正常，
        问题可能与数据库连接或其他后端服务有关。
      </p>
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '5px', 
        border: '1px solid #ddd' 
      }}>
        <h2 style={{ color: '#555', fontSize: '18px' }}>可能的问题原因：</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <li>Supabase 数据库连接失败</li>
          <li>身份验证服务不可用</li>
          <li>API 密钥或配置不正确</li>
          <li>网络连接问题</li>
        </ul>
      </div>
    </div>
  );
};

export default TestApp;
