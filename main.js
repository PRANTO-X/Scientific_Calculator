let topScrn = document.getElementById("topScreen");
let bottomScrn = document.querySelector(".screen-2");
let caretPos = 0;
let string = "";
let ans = "";

const number = (e) => {
    if (e.length > 1) {
        string = string.slice(0, caretPos) + e + string.slice(caretPos);
        caretPos += e.length; 
    } else {
        string = string.slice(0, caretPos) + e + string.slice(caretPos);
        caretPos++; 
    }

    updateCaretPosition(); 
};


// Function to update the caret position
const updateCaretPosition = () => {
    topScrn.value = string; 
    updateCaret(); 
};

// Function to visually update the caret position
const updateCaret = () => {
    topScrn.value = string;
    updateCaretSize();
    const inputRect = topScrn.getBoundingClientRect(); 
    const textMetrics = getTextMetrics(string.substring(0, caretPos), topScrn); 

    const caret = document.querySelector('.caret');
    const caretX = inputRect.left + textMetrics.width + 2; 
    const caretY = inputRect.top + 5; 

    if (caretX < inputRect.left) {
        caret.style.left = `${inputRect.left}px`;
    } else if (caretX > inputRect.right - 2) { 
        caret.style.left = `${inputRect.right - 2}px`;
    } else {
        caret.style.left = `${caretX}px`;
    }
    
    caret.style.top = `${caretY}px`; 
    caret.style.opacity = '1'; 
};

// Create a custom caret
const createCaret = () => {
    const caret = document.createElement('div');
    caret.style.position = 'absolute';
    caret.style.width = '2px'; 
    caret.style.height = '35px'; 
    caret.style.backgroundColor = 'white'; 
    caret.style.transition = 'opacity 0.3s';
    caret.style.opacity = '0'; 
    return caret;
};

const updateCaretSize = () => {
    const computedStyle = window.getComputedStyle(topScrn);
    const fontSize = parseFloat(computedStyle.fontSize); // Get current font size
    const caret = document.querySelector('.caret');
    caret.style.height = `${fontSize}px`; // Set caret height to match font size
};

// Update caret size on window resize
window.addEventListener('resize', updateCaretSize);


const getTextMetrics = (text, inputElement) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    const computedStyle = window.getComputedStyle(inputElement);
    context.font = computedStyle.font; 

    return {
        width: context.measureText(text).width 
    };
};


// Function to hide the caret
const hideCaret = () => {
    const caret = document.querySelector('.caret');
    caret.style.opacity = '0'; 
};

// Initialize caret
const caret = createCaret();
caret.classList.add('caret'); 
document.body.appendChild(caret);

// Update caret position on focus and input
topScrn.addEventListener('focus', updateCaret);
topScrn.addEventListener('input', () => {
    updateCaret(); 
});
topScrn.addEventListener('blur', hideCaret);


setInterval(() => {
    const caret = document.querySelector('.caret');
    if (caret.style.opacity === '1') {
        hideCaret();
    } else {
        updateCaret();
    }
}, 500); // Adjust the blink speed as needed

const moveLeft = () => {
    if (caretPos > 0) {
        caretPos--; 
        updateCaret(); 
    }
};


const moveRight = () => {
    if (caretPos < string.length) {
        caretPos++; 
        updateCaret(); 
    }
};
//-------------------------------------------------------------------------------------------------------
let isShiftActive = false; 

const toggleShift = () => {
    isShiftActive = !isShiftActive; 
};


const shiftNumber = (defaultFunc, inverseFunc) => {
    const funcToUse = isShiftActive ? inverseFunc : defaultFunc;
    number(funcToUse);
    updateCaret(); 
    isShiftActive = false; 
};

// Calculate result
const calculate = () => {
    try {
        let result = eval(string.replace(/sin\(([^)]+)\)/g, (match, p1) => `Math.sin(${p1} * Math.PI / 180)`)
            .replace(/cos\(([^)]+)\)/g, (match, p1) => `Math.cos(${p1} * Math.PI / 180)`)
            .replace(/tan\(([^)]+)\)/g, (match, p1) => `Math.tan(${p1} * Math.PI / 180)`)
            .replace(/sin⁻¹\(([^)]+)\)/g, (match, p1) => `Math.asin(${p1}) * (180 / Math.PI)`)
            .replace(/tan⁻¹\(([^)]+)\)/g, (match, p1) => `Math.atan(${p1}) * (180 / Math.PI)`)
            .replace(/cos⁻¹\(([^)]+)\)/g, (match, p1) => `Math.acos(${p1}) * (180 / Math.PI)`)
            .replace(/ln\(([^)]+)\)/g, (match, p1) => `Math.log(${p1})`)
            .replace(/log/g, "Math.log")
            .replace(/√/g, "Math.sqrt")
            .replace(/²/g, "**2")
            .replace(/³/g, "**3")
            .replace(/⁻¹/g, "**-1")
            .replace(/\^/g, "**")
            .replace(/10\^/g, "10**")
            .replace(/e/g, "Math.E") 
            .replace(/∛/g,"Math.cbrt")
            .replace(/𝝿/g,"Math.PI")
            .replace(/÷/g, "/")
            .replace(/×/g, "*")
            .replace(/(\d+)!/g,factorial)
            .replace(/(\d+)%(\d*)/g, percentage)
            .replace(/Ans/g, answer)
        );

        bottomScrn.value = result;
        ans = result;
        caretPos = string.length; 
        topScrn.value = string;
        
    } catch (error) {
        bottomScrn.value = "Error!";
        string = "";
        ans = "";
        caretPos = 0;
        updateCaretPosition(); 
    }
};


const answer=(match)=>{
    return ans;
};

const factorial = (match, n) => {
    n = parseInt(n);
    let fact = 1;
    for (let i = 1; i <= n; i++) {
        fact *= i;
    }
    return fact;
};

const percentage = (match, p1, p2) => {
    if (p2 === "") {
        return `(${p1} / 100)`;
    }
    return `(${p1} / 100) * ${p2}`;
};
// Delete last character
const backSpace = () => {
    if (caretPos > 0) {
        string = string.slice(0, caretPos - 1) + string.slice(caretPos);
        caretPos--;
        updateCaretPosition();
    }
};

// Clear all
const allClear = () => {
    string = "";         
    caretPos = 0;      
    topScrn.value = "";
    bottomScrn.value = ""; 
    updateCaretPosition(); 
};
