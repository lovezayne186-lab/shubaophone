/* --- 1. 通用图片上传逻辑 --- */
// 全局变量，记录当前正在为哪个组件换图
let activeImgId = '';
let activeHintId = '';

// HTML中组件点击时调用此函数
function triggerUpload(imgId, hintId) {
    activeImgId = imgId;
    activeHintId = hintId;
    // 触发隐藏的文件输入框
    const uploader = document.getElementById('global-uploader');
    if(uploader) uploader.click();
}

// 监听文件选择完成
const globalUploader = document.getElementById('global-uploader');
if (globalUploader) {
    globalUploader.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // 只有当有激活的目标ID时才执行
                if (activeImgId) {
                    const img = document.getElementById(activeImgId);
                    const hint = document.getElementById(activeHintId);
                    
                    if (img) {
                        img.src = e.target.result;
                        img.style.display = 'block';
                    }
                    if (hint) {
                        hint.style.display = 'none'; // 隐藏"点击上传"的提示字
                    }
                }
            }
            reader.readAsDataURL(this.files[0]);
        }
        // 清空 value，保证下次选同一张图也能触发 change 事件
        this.value = '';
    });
}

/* --- 2. 音乐播放器逻辑 --- */
const audio = document.getElementById('audio-player');
const playIcon = document.getElementById('play-icon');
let isPlaying = false;

function togglePlay() {
    if (!audio || !playIcon) return;

    if (!audio.src || audio.src === window.location.href) {
        alert("请先点击标题加载音乐文件！");
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

// 对应 HTML 中的 type="file" onchange="loadSong(this)"
function loadSong(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const url = URL.createObjectURL(file);
        
        if (audio) {
            audio.src = url;
            audio.play();
            isPlaying = true;
            
            if (playIcon) {
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
            }
            
            // 可选：把歌名显示在界面上
            const titleEl = document.querySelector('.music-title');
            if(titleEl) titleEl.innerText = file.name.replace(/\.[^/.]+$/, ""); // 去掉后缀名
        }
    }
}
