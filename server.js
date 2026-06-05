const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}
function escapeHtml(t) {
  return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function buildEmailHtml(fields) {
  const rows = Object.entries(fields).filter(([k])=>k!=='_redirect')
    .map(([k,v])=>`<tr><td style="padding:8px 12px;font-weight:bold;background:#f4f4f4;border:1px solid #ddd;">${escapeHtml(k)}</td><td style="padding:8px 12px;border:1px solid #ddd;">${escapeHtml(v)}</td></tr>`).join('');
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;"><h2 style="background:#1a2744;color:#f5c518;padding:16px 20px;margin:0;">📬 GMC Form Submission</h2><table style="width:100%;border-collapse:collapse;">${rows}</table><p style="color:#888;font-size:12px;margin-top:16px;">Submitted ${new Date().toLocaleString("en-US",{timeZone:"America/Chicago"})} CDT</p></div>`;
}
app.post("/submit", async (req, res) => {
  try {
    const fields = req.body;
    if (!fields || !Object.keys(fields).length) return res.status(400).json({ error: "No data." });
    const firstVal = Object.values(fields).find(v=>typeof v==="string"&&v.trim());
    await createTransporter().sendMail({
      from: `"GMC Form" <${process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL || "gmcdallas09@gmail.com",
      subject: `GMC Form Submission – ${(firstVal||"").slice(0,50)}`,
      html: buildEmailHtml(fields),
      text: Object.entries(fields).map(([k,v])=>`${k}: ${v}`).join("\n"),
    });
    if (fields._redirect) return res.redirect(fields._redirect);
    return res.status(200).json({ success: true });
  } catch(err) {
    return res.status(500).json({ error: "Failed to send.", detail: err.message });
  }
});
app.get("/health", (_,res) => res.json({ status:"ok" }));
app.get("*", (_,res) => res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT, () => console.log(`✅ Running on port ${PORT}`));
