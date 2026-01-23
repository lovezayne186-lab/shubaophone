/* =========================================================
   文件路径：JS脚本文件夹/appearance.js
   作用：只负责外观设置App的界面显示 (监听逻辑已移交 system.js)
   ========================================================= */

console.log("Appearance.js 已成功加载！"); // 如果控制台看到这句话，说明文件没问题

// 1. 打开外观 App
function openAppearanceApp() {
    const appWindow = document.getElementById('appearance-app');
    if (!appWindow) return;
    
    // 动态生成内容
    renderAppearanceUI(appWindow);
    
    // 显示窗口
    appWindow.classList.add('active');
}

// 2. 关闭外观 App
function closeAppearanceApp() {
    const appWindow = document.getElementById('appearance-app');
    if (appWindow) appWindow.classList.remove('active');
}

// 3. 核心：渲染 UI 界面
function renderAppearanceUI(container) {
    const apps = window.appList || [];
    let appListHTML = '';

    // 遍历所有 APP，生成修改项
    apps.forEach((app, index) => {
        // 判断图片类型显示不同的预览
        let iconDisplay = app.icon;
        if (app.icon.includes('.') || app.icon.includes('/') || app.icon.startsWith('data:')) {
            iconDisplay = `<img src="${app.icon}" style="width:100%; border-radius:10px;">`;
        }

        appListHTML += `
            <div class="setting-item-row">
                <div class="app-preview">
                    <div class="app-icon-box" style="font-size: 20px;">
                        ${iconDisplay}
                    </div>
                    <span style="font-size:14px; margin-left:10px;">${app.name}</span>
                </div>
                
                <div class="action-group">
                    <!-- 这里的 onclick 必须正确传递 index -->
                    <button class="mini-btn" onclick="triggerAppIconUpload(${index})">
                        <i class="fas fa-upload"></i> 上传
                    </button>
                </div>
            </div>
            
            <div class="url-input-row">
                <input type="text" placeholder="或粘贴图片 URL..." id="app-url-${index}">
                <button class="mini-btn-ok" onclick="saveAppIconByUrl(${index})">确定</button>
            </div>
            <div class="divider"></div>
        `;
    });

    // 组装完整的 HTML
    container.innerHTML = `
        <!-- 顶部导航 -->
        <div class="app-header">
            <div class="back-btn" onclick="closeAppearanceApp()">
                <i class="fas fa-chevron-left"></i> 返回
            </div>
            <div class="app-title">外观设置</div>
            <div style="width: 40px;"></div>
        </div>

        <div class="app-content" style="padding-bottom: 50px;">
            
            <!-- 全屏模式开关 -->
            <div class="setting-card" style="margin-bottom:20px;">
                <div class="setting-row-between">
                    <span style="font-weight:600;">沉浸全屏模式</span>
                    <label class="switch">
                        <input type="checkbox" id="fullscreen-toggle" onchange="toggleFullscreen(this)">
                        <span class="slider round"></span>
                    </label>
                </div>
                <p style="font-size:12px; color:#666; margin-top:5px;">隐藏手机边框</p>
            </div>

            <!-- 壁纸设置 -->
            <div class="setting-card" style="margin-bottom:20px;">
                <h3 style="margin-top:0;">桌面壁纸</h3>
                <div class="setting-row-between" style="margin-bottom:10px;">
                    <span>本地相册</span>
                    <button class="mini-btn" onclick="triggerWallpaperUpload()">
                        <i class="fas fa-image"></i> 选择图片
                    </button>
                </div>
                <div class="url-input-row">
                    <input type="text" id="wallpaper-url-input" placeholder="输入图片 URL..." class="url-input">
                    <button class="mini-btn-ok" onclick="setWallpaperByUrl()">应用</button>
                </div>
            </div>

            <!-- App 图标管理 -->
            <div class="setting-card">
                <h3 style="margin-top:0;">App 图标管理</h3>
                ${appListHTML}
            </div>
        </div>
    `;

    // 恢复全屏开关状态
    const isFullscreen = document.body.classList.contains('fullscreen-active');
    const toggle = document.getElementById('fullscreen-toggle');
    if(toggle) toggle.checked = isFullscreen;
}

// === 只有纯逻辑函数，不再有监听器 ===

// 1. 全屏切换
function toggleFullscreen(checkbox) {
    if (checkbox.checked) {
        document.body.classList.add('fullscreen-active');
    } else {
        document.body.classList.remove('fullscreen-active');
    }
}

// 2. 触发 App 图标上传
function triggerAppIconUpload(index) {
    // 【关键修改】直接使用 system.js 定义的全局变量 window.currentEditingAppIndex
    window.currentEditingAppIndex = index;
    
    const uploader = document.getElementById('global-uploader');
    if(uploader) {
        uploader.value = ''; // 清空，允许重复选图
        uploader.click();    // 打开文件选择框
    }
}

// 3. 通过 URL 修改 App 图标
function saveAppIconByUrl(index) {
    const input = document.getElementById(`app-url-${index}`);
        const url = input.value.trim();
    if (url) {
        updateAppIcon(index, url);
        input.value = ''; 
    } else {
        alert('请输入有效的图片链接');
    }
}

// 4. 执行更新 App 图标逻辑 (会被 system.js 调用)
function updateAppIcon(index, newIconSrc) {
    if (window.appList && window.appList[index]) {
        // 更新内存中的数据
        window.appList[index].icon = newIconSrc;
        
        // 刷新主屏幕上的图标 (调用 apps.js 里的 renderApps)
        if (typeof window.renderApps === 'function') {
            window.renderApps();
        }

        // 刷新外观设置界面，显示新图标 (让自己也变一下)
        const appWindow = document.getElementById('appearance-app');
        if (appWindow && appWindow.classList.contains('active')) {
            renderAppearanceUI(appWindow);
        }
    }
}

// === 壁纸逻辑 ===

// 5. 触发壁纸上传
function triggerWallpaperUpload() {
    const wpUploader = document.getElementById('wallpaper-uploader');
    if(wpUploader) {
        wpUploader.value = ''; // 清空
        wpUploader.click();    // 这一步会触发 system.js 里的监听器
    }
}

// 6. 通过 URL 设置壁纸
function setWallpaperByUrl() {
    const url = document.getElementById('wallpaper-url-input').value.trim();
    if(url) {
        const screen = document.querySelector('.screen');
        if(screen) {
            screen.style.backgroundImage = `url('${url}')`;
            screen.style.backgroundSize = 'cover';
            screen.style.backgroundPosition = 'center';
            alert('壁纸已应用');
        }
    }
}

// === 必须做的最后一步：挂载到 window ===
// 否则 index.html 里的 onclick="openAppearanceApp()" 会报错说找不到函数
window.openAppearanceApp = openAppearanceApp;
window.closeAppearanceApp = closeAppearanceApp;
window.triggerAppIconUpload = triggerAppIconUpload;
window.saveAppIconByUrl = saveAppIconByUrl;
window.updateAppIcon = updateAppIcon; // 供 system.js 调用
window.triggerWallpaperUpload = triggerWallpaperUpload;
window.setWallpaperByUrl = setWallpaperByUrl;
window.toggleFullscreen = toggleFullscreen;

