console.log("form.js loaded");

// Utility: create a signature pad for any canvas
function initSignaturePad(canvasId, clearBtnId) {
    const canvas = document.getElementById(canvasId);
    const clearBtn = document.getElementById(clearBtnId);
    const ctx = canvas.getContext("2d");

    let drawing = false;

    function resizeCanvas() {
        const data = canvas.toDataURL();
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const img = new Image();
        img.src = data;
        img.onload = () => ctx.drawImage(img, 0, 0);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    canvas.addEventListener("mousedown", () => { drawing = true });
    canvas.addEventListener("mouseup", () => { drawing = false; ctx.beginPath() });
    canvas.addEventListener("mousemove", draw);

    canvas.addEventListener("touchstart", () => { drawing = true });
    canvas.addEventListener("touchend", () => { drawing = false; ctx.beginPath() });
    canvas.addEventListener("touchmove", drawTouch);

    function draw(e) {
        if (!drawing) return;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";

        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }

    function drawTouch(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        if (!drawing) return;

        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    clearBtn.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return canvas;
}

// Initialize all signature pads
window.addEventListener("DOMContentLoaded", () => {
    initSignaturePad("buyerSignature", "clearBuyer");
    initSignaturePad("guarantor1Signature", "clearGuarantor1");
    initSignature
