document.getElementById("form-app-1abc").addEventListener("submit", async (e) => {
    e.preventDefault(); // stop browser from doing GET /

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch("https://gmc-form-backend.onrender.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            throw new Error("Submission failed");
        }

        alert("Form submitted successfully!");
        form.reset();
    } catch (err) {
        alert("❌ Submission failed: " + err.message);
    }
});
