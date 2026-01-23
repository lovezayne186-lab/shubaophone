/* =========================================================
   文件路径：JS脚本文件夹/apps.js
   作用：管理App的数据、图标渲染、以及打开App的窗口逻辑
   ========================================================= */

// 1. 定义所有 App 的核心数据 (这是外观设置读取的源头)
// 注意：name 必须和 HTML 里的 <span class="app-name">...</span> 文字完全一致
window.appList = [
    { name: "微信", icon: "💬", id: "wechat" },
    { name: "世界书", icon: "📖", id: "worldbook" },
    { name: "购物", icon: "🛍️", id: "shopping" },
    { name: "外卖", icon: "🥡", id: "food" },
    { name: "论坛", icon: "🗯️", id: "forum" },
    { name: "小红书", icon: "📕", id: "redbook" },
    { name: "工坊", icon: "🔨", id: "workshop" },
    { name: "音乐", icon: "🎵", id: "music" },
    { name: "游戏", icon: "🎮", id: "game" },
    { name: "钱包", icon: "💰", id: "wallet" }
];

// 2. 初始化渲染：把图标画到桌面上
function renderApps() {
    const allAppNames = document.querySelectorAll('.app-name');
    
    allAppNames.forEach(nameSpan => {
        const appName = nameSpan.innerText.trim();
        // 在数据里找这个 App
        const appData = window.appList.find(a => a.name === appName);
        
        if (appData) {
            // 找到它前面的图标容器
            const iconBox = nameSpan.previousElementSibling;
            if (iconBox) {
                // 判断是 Emoji 还是 图片URL
                if (appData.icon.includes('/') || appData.icon.includes('.') || appData.icon.startsWith('data:image')) {
                    // 是图片：清空文字，插入图片
                    iconBox.innerHTML = `<img src="${appData.icon}" style="width:100%; height:100%; border-radius:10px; object-fit:cover; display:block;">`;
                    // 重置样式以适应图片
                    iconBox.style.fontSize = '0'; 
                    iconBox.style.display = 'flex';
                    iconBox.style.alignItems = 'center';
                    iconBox.style.justifyContent = 'center';
                    iconBox.style.overflow = 'hidden'; // 防止图片溢出
                } else {
                    // 是 Emoji
                    iconBox.innerHTML = appData.icon;
                    iconBox.style.fontSize = ''; // 恢复默认字体大小
                    // 如果是小图标格子，特殊调整
                    if(iconBox.classList.contains('small-icon')) {
                         // 保持 CSS 里的设置
                    }
                }
            }
        }
    });
}

// 页面加载完成后，自动渲染一次图标
document.addEventListener('DOMContentLoaded', renderApps);


// 3. 打开 App 的窗口逻辑 (保留你原来的功能)
const appWindow = document.getElementById('app-window');
const appTitle = document.getElementById('app-title-text');
const appContent = document.getElementById('app-content-area');

// 定义 App 具体内容 (点击图标打开后的界面)
const appContentData = {
    'wechat': { title: '微信', content: '<div style="padding:20px; text-align:center;">暂无新消息</div>' },
    'music': { title: '音乐', content: '<div style="padding:20px; text-align:center;">正在播放: Happy Together</div>' },
    'settings': { title: '设置', content: '<div style="padding:20px;">系统设置页面</div>' }
    // 你可以在这里继续添加...
};

// 打开 App 函数
function openApp(appId) {
    // 如果没有定义内容，默认显示一个空白页
    const data = appContentData[appId] || { title: '应用', content: '<div style="padding:20px; text-align:center;">开发中...</div>' };

    appTitle.innerText = data.title;
    appContent.innerHTML = data.content;

    // 添加 active 类，触发 CSS 动画
    if(appWindow) {
        appWindow.classList.add('active');
    }
}

// 关闭 App 函数
function closeApp() {
    if(appWindow) {
        appWindow.classList.remove('active');
    }
}

// 全局暴露给 HTML 调用
window.openApp = openApp;
window.closeApp = closeApp;
window.renderApps = renderApps;
