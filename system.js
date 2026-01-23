/* =========================================================
   文件路径：JS脚本文件夹/system.js
   作用：处理系统级功能（时间、电池、全局监听、API设置）
   ========================================================= */

// --- 全局变量初始化 ---
// 用来记录当前正在换哪个 App 的图标（-1 代表没在换）
window.currentEditingAppIndex = -1;

/* --- 1. 时间与日期逻辑 --- */
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    // 状态栏时间
    const statusTimeEl = document.getElementById('status-time-text');
    if (statusTimeEl) statusTimeEl.innerText = `${hours}:${minutes}`;

    // 第一页大时间
    const timeEl = document.getElementById('time-text');
    if (timeEl) timeEl.innerText = `${hours}:${minutes}`;

    // 第一页日期
    const dateEl = document.getElementById('date-text');
    if (dateEl) {
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        dateEl.innerText = `${now.getFullYear()}年${month}月${date}日 ${weekDays[now.getDay()]}`;
    }
}

// 立即执行一次，然后每秒刷新
updateTime();
setInterval(updateTime, 1000);

/* --- 2. 电池电量逻辑 --- */
if(navigator.getBattery) {
    navigator.getBattery().then(function(battery) {
        function updateBattery() {
            const batteryEl = document.getElementById('battery-num');
            if (batteryEl) batteryEl.innerText = Math.round(battery.level * 100);
        }
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
    });
} else {
    // 如果浏览器不支持电池API，默认显示 100
    const batteryEl = document.getElementById('battery-num');
    if (batteryEl) batteryEl.innerText = '100';
}

/* --- 3. API 设置弹窗逻辑 --- */
window.saveApi = function() {
    const key = document.getElementById('api-key-input').value;
    if(key) {
        localStorage.setItem('user_api_key', key);
        document.getElementById('api-modal').classList.remove('show'); // 隐藏
        alert("API Key 已保存！");
    }
}

window.showApiSettings = function() { 
    // 使用 classList 控制显示，配合 CSS 动画
    const modal = document.getElementById('api-modal');
    if(modal) modal.classList.add('show');
}

// 点击遮罩层关闭弹窗
const apiModal = document.getElementById('api-modal');
if (apiModal) {
    apiModal.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('show');
    });
}

/* --- 4. 【核心修复】全局文件上传监听 --- */
// 放在这里是最稳的，因为这些 input 就在 index.html 里

document.addEventListener('DOMContentLoaded', function() {
    
    // (A) 监听壁纸上传
    const wallpaperInput = document.getElementById('wallpaper-uploader');
    if (wallpaperInput) {
        wallpaperInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = function(evt) {
                    // 1. 找到屏幕元素
                    const screen = document.querySelector('.screen');
                    // 2. 暴力修改背景图
                    if(screen) {
                        screen.style.backgroundImage = `url('${evt.target.result}')`;
                        screen.style.backgroundSize = 'cover';
                        screen.style.backgroundPosition = 'center';
                        alert("壁纸更换成功！");
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // (B) 监听 App 图标上传
    const appIconInput = document.getElementById('global-uploader');
    
    if (!appIconInput) {
        console.error("严重错误：找不到 id='global-uploader' 的元素！");
    }

    if (appIconInput) {
        appIconInput.addEventListener('change', function(e) {
            // 检查是否有文件，并且当前是否正在编辑某个 App
            if (window.currentEditingAppIndex !== -1 && e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();

                reader.onload = function(evt) {
                    if (typeof window.updateAppIcon === 'function') {
                        window.updateAppIcon(window.currentEditingAppIndex, evt.target.result);
                        alert("App图标修改成功！"); 
                    } else {
                        console.error("未找到 updateAppIcon 函数");
                        alert("出错：未找到更新函数，请检查 appearance.js！");
                    }
                    
                    window.currentEditingAppIndex = -1;
                    appIconInput.value = '';
                };

                reader.readAsDataURL(file);
            } else {
                // 用户没有先点击 App 图标就直接选择了文件
                console.warn("请先点击要修改的 App 图标");
            }
        });
    }
}); // 结束 DOMContentLoaded
