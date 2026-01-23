/* --- 页面滑动逻辑 --- */
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const screen = document.querySelector('.screen');
    
    // 如果找不到元素就不执行，防止报错
    if (!slider || !screen) return;

    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
    let currentIndex = 0; // 0 是第一页，1 是第二页

    // 1. 触摸开始
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        // 拖动时移除动画，让跟随更跟手
        slider.style.transition = 'none'; 
    });

    // 2. 触摸移动
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        
        // 计算当前应该移动的距离
        currentTranslate = prevTranslate + diff;
        
        // 简单移动
        slider.style.transform = `translateX(${currentTranslate}px)`;
    });

    // 3. 触摸结束
    slider.addEventListener('touchend', () => {
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;
        const screenWidth = screen.offsetWidth;

        // 如果向左滑动超过屏幕 1/4，去第二页 (Page 2)
        if (movedBy < -screenWidth / 4 && currentIndex === 0) {
            currentIndex = 1;
        } 
        // 如果向右滑动超过屏幕 1/4，回第一页 (Page 1)
        else if (movedBy > screenWidth / 4 && currentIndex === 1) {
            currentIndex = 0;
        }

        setPositionByIndex();
    });

    // 根据 currentIndex 自动归位
    function setPositionByIndex() {
        // 使用百分比位移，适应性更强
        // index 0 -> 0%, index 1 -> -50% (因为slider宽度是200%)
        const percentage = currentIndex * -50; 
        
        slider.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // 加个贝塞尔曲线更顺滑
        slider.style.transform = `translateX(${percentage}%)`;
        
        // 重置 prevTranslate，为下一次拖动做准备
        // 注意：这里需要把百分比转换回像素，以便下次 touchmove 接着算
        // slider 宽 200%，所以 50% = 1个屏幕宽
        prevTranslate = currentIndex * -screen.offsetWidth; 
    }
});
