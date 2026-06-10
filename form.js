console.log("form.js loaded");

function initSignaturePad(canvasId, clearBtnId, hiddenInputId) {
    const canvas = document.getElementById(canvasId);
    const clearBtn = document.getElementById(clearBtnId);
    const hiddenInput = document.getElementById(hiddenInputId);
    const ctx = canvas.getContext("2d");

    let drawing = false;

    // Resize canvas to match CSS size
    function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Mouse events
    canvas.addEventListener("mousedown", () => drawing = true);
    canvas.addEventListener("mouseup", () => { drawing = false; ctx.beginPath() });
    canvas.addEventListener("mousemove", draw);

    // Touch events
    canvas.addEventListener("touchstart", () => drawing = true);
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

    // Clear button
    clearBtn.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hiddenInput.value = "";
    });

    // Save PNG to hidden input on submit
    document.querySelector("form").addEventListener("submit", () => {
        hiddenInput.value = canvas.toDataURL();
    });
}

// Initialize all signature pads
window.addEventListener("DOMContentLoaded", () => {
    initSignaturePad("buyer-sig-canvas", "buyer-sig-clear", "buyer-sig-data");
    initSignaturePad("guar1-sig-canvas", "guar1-sig-clear", "guar1-sig-data");
    initSignaturePad("guar2-sig-canvas", "guar2-sig-clear", "guar2-sig-data");
});
