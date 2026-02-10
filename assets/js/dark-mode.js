// Dark Mode 切換功能
document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const htmlElement = document.documentElement;
  
  // 從 localStorage 讀取用戶偏好，預設為 light
  const savedTheme = localStorage.getItem('theme');
  const currentTheme = savedTheme || 'light';
  htmlElement.setAttribute('data-theme', currentTheme);
  
  // 更新按鈕圖標
  function updateToggleIcon() {
    const theme = htmlElement.getAttribute('data-theme');
    if (darkModeToggle) {
      darkModeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      darkModeToggle.setAttribute('aria-label', theme === 'dark' ? '切換到淺色模式' : '切換到深色模式');
    }
  }
  
  // 切換主題
  function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon();
  }
  
  // 初始化按鈕圖標
  updateToggleIcon();
  
  // 綁定點擊事件
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleTheme);
  }
});
