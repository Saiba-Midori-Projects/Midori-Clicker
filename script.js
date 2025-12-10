/*
    小绿生日快乐，最喜欢才羽绿了！
    顺便，原作者的开源仓库在这里：<https://github.com/ZeroFPS-hk/koyuki-clicker/>
*/

document.addEventListener('DOMContentLoaded', init);

function init() {
    const bgm = document.getElementById('bgm');
    const bgmIcon = document.getElementById('bgm-icon');
    let clickSoundSrc = './sounds/ST0005_MiniGame_Shout_1.ogg';
    let goshiyujinSoundSrc = './sounds/Goshiyujinsama.ogg';
    let isBgmOn = false;
    bgm.volume = 0.8;

    // CPS tracking variables
    let clickTimes = []; // Store timestamps of recent clicks
    const cpsWindow = 2000; // 2 seconds window for CPS calculation
    let cpsDisplay = null; // Element to display CPS
    let cpsUpdateInterval = null; // Interval for updating CPS display

    window.addEventListener("dragstart", (e)=>e.preventDefault());

    document.getElementById('bgm-toggle').addEventListener('click', (e) => {
        e.stopPropagation();  // Prevents click event from propagating to the body
        toggleBgm();
    });

    
    document.body.addEventListener('click', (e) => handleBodyClick(e));

    // Create CPS display element
    function createCpsDisplay() {
        cpsDisplay = document.createElement('div');
        cpsDisplay.id = 'cps-display';
        cpsDisplay.style.position = 'absolute';
        cpsDisplay.style.top = '10px';
        cpsDisplay.style.left = '10px';
        cpsDisplay.style.zIndex = '9999';
        cpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        cpsDisplay.style.color = 'white';
        cpsDisplay.style.padding = '5px 10px';
        cpsDisplay.style.borderRadius = '5px';
        cpsDisplay.style.fontFamily = 'Arial, sans-serif';
        cpsDisplay.style.fontSize = '16px';
        cpsDisplay.textContent = 'CPS: 0.00';
        document.body.appendChild(cpsDisplay);
        
        // Start updating CPS regularly
        startCpsUpdater();
    }

    // Start the CPS updater interval
    function startCpsUpdater() {
        if (cpsUpdateInterval) clearInterval(cpsUpdateInterval);
        cpsUpdateInterval = setInterval(updateCpsDisplay, 100); // Update every 100ms
    }
    
    // Update CPS display
    function updateCpsDisplay() {
        const now = Date.now();
        // Remove clicks older than the CPS window
        const cutoffTime = now - cpsWindow;
        clickTimes = clickTimes.filter(time => time > cutoffTime);
        
        // Calculate and display CPS
        const cps = (clickTimes.length / (cpsWindow / 1000)).toFixed(2);
        if (cpsDisplay) {
            cpsDisplay.textContent = `CPS: ${cps}`;
        }
        
        // Stop updating if CPS reaches zero and no display element
        if (parseFloat(cps) === 0 && !cpsDisplay) {
            clearInterval(cpsUpdateInterval);
            cpsUpdateInterval = null;
        }
    }

    function toggleBgm() {
        isBgmOn = !isBgmOn;
        if (isBgmOn) {
            bgm.play();
            bgmIcon.src = './img/bgm_on.png';
        } else {
            bgm.pause();
            bgmIcon.src = './img/bgm_off.png';
        }
    }

    function handleBodyClick(event) {
        if (event.target.id === 'bgm-icon') return;  // Ensure the click on BGM icon does not spawn another icon

        // Initialize CPS display on first click
        if (!cpsDisplay) {
            createCpsDisplay();
        }

        // Record click time
        const now = Date.now();
        clickTimes.push(now);
        
        // Update CPS display immediately on click
        updateCpsDisplay();

        const iconType = Math.random() < 0.9 ? 'CH0202_spr_11' : 'CH0202_spr_03';
        playSound(iconType);
        addIcon(event, iconType);
    }

    function playSound(type) {
        const sound = new Audio(type === 'CH0202_spr_11' ? clickSoundSrc : goshiyujinSoundSrc);
        sound.play();
    }

    function addIcon(event, iconType) {
        const iconSize = Math.floor(Math.random() * 51) + 100; // Random size between 100 and 150 inclusive
        const icon = document.createElement('img');
        icon.classList.add('icon');
        icon.style.left = `${event.clientX}px`;
        icon.style.top = `${event.clientY}px`;
        icon.style.width = `${iconSize}px`;
        icon.style.height = `${iconSize}px`;
        icon.src = `./img/${iconType}.png`;
        document.body.appendChild(icon);
    }
}
