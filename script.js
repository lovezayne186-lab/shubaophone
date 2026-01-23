/* --- 1. 时间与日期 (保持不变) --- */
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
setInterval(updateTime, 1000);
updateTime();

/* --- 2. 电池电量 (保持不变) --- */
if(navigator.getBattery) {
    navigator.getBattery().then(function(battery) {
        function updateBattery() {
            const batteryEl = document.getElementById('battery-num');
            if (batteryEl) batteryEl.innerText = Math.round(battery.level * 100);
        }
        updateBattery();
    });
}

/* --- 3. API 设置 (保持不变) --- */
function saveApi() {
    const key = document.getElementById('api-key-input').value;
    if(key) {
        localStorage.setItem('user_api_key', key);
        document.getElementById('api-modal').style.display = 'none';
    }
}
function showApiSettings() { document.getElementById('api-modal').style.display = 'flex'; }
document.getElementById('api-modal').addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
});

/* --- 4. 页面滑动逻辑 (新增!) --- */
const slider = document.getElementById('slider');
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let isDragging = false;
let currentIndex = 0; // 0 是第一页，1 是第二页

// 触摸开始
slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    slider.style.transition = 'none'; // 拖动时移除动画，跟手
});

// 触摸移动
slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    // 计算当前应该移动的距离
    currentTranslate = prevTranslate + diff;
    // 限制滑动范围 (不能滑出第一页左边，也不能滑出第二页右边)
    // 简单限制：translate 不能 > 0 (左边界)，不能 < -375 (右边界，假设屏幕宽375)
    // 为了更通用的写法，我们只做简单的阻尼效果，稍后在end里修正
    slider.style.transform = `translateX(${currentTranslate}px)`;
});

// 触摸结束
slider.addEventListener('touchend', () => {
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    const screenWidth = document.querySelector('.screen').offsetWidth;

    // 如果向左滑动超过屏幕 1/4，去第二页
    if (movedBy < -screenWidth / 4 && currentIndex === 0) {
        currentIndex = 1;
    } 
    // 如果向右滑动超过屏幕 1/4，回第一页
    else if (movedBy > screenWidth / 4 && currentIndex === 1) {
        currentIndex = 0;
    }

    setPositionByIndex();
});

function setPositionByIndex() {
    const screenWidth = document.querySelector('.screen').offsetWidth;
    currentTranslate = currentIndex * -screenWidth / 2; // 因为slider宽200%，所以移一半就是一屏
    // 这里直接写 -50% 或者 0% 更稳
    const percentage = currentIndex * -50; 
    
    slider.style.transition = 'transform 0.3s ease-out';
    slider.style.transform = `translateX(${percentage}%)`;
    
    // 更新 prevTranslate 用于下次计算（转换为像素估算，或者下次start重新获取位置）
    // 简便起见，每次start重置逻辑也行，但这里只要保证百分比对即可
    prevTranslate = currentIndex * -screenWidth; 
}


/* --- 5. 通用图片上传逻辑 (重构!) --- */
// 我们用两个变量记录当前正在操作哪个组件
let activeImgId = '';
let activeHintId = '';

function triggerUpload(imgId, hintId) {
    activeImgId = imgId;
    activeHintId = hintId;
    // 使用 HTML 里那个隐藏的通用 input
    document.getElementById('global-uploader').click();
}

// 监听通用 input 的变化
document.getElementById('global-uploader').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            if (activeImgId) {
                const img = document.getElementById(activeImgId);
                const hint = document.getElementById(activeHintId);
                if (img) {
                    img.src = e.target.result;
                    img.style.display = 'block';
                }
                if (hint) {
                    hint.style.display = 'none';
                }
            }
        }
        reader.readAsDataURL(this.files[0]);
    }
    // 清空 value，保证下次选同一张图也能触发 change
    this.value = '';
});


/* --- 6. 音乐播放器逻辑 (新增!) --- */
const audio = document.getElementById('audio-player');
const playIcon = document.getElementById('play-icon');
let isPlaying = false;

function togglePlay() {
    if (!audio.src) {
        alert("请先点击标题加载音乐！");
        return;
    }
    
    if (isPlaying) {
        audio.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    } else {
        audio.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    }
    isPlaying = !isPlaying;
}

function loadSong(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const url = URL.createObjectURL(file);
        audio.src = url;
        
        // 自动播放
        audio.play();
        isPlaying = true;
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        
        // 更新标题为文件名 (可选)
        // document.querySelector('.music-title').innerText = file.name;
    }
}
