const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "out");

// 1. Replace root index.html with a simple meta redirect
const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=./uk/">
<link rel="canonical" href="./uk/">
<title>NashBus</title>
</head>
<body>
<p>Redirecting to <a href="./uk/">NashBus</a>...</p>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, "index.html"), html);
console.log("postbuild: replaced out/index.html with meta redirect");

// 2. Copy legacy files (admin, scripts, styles) into out/
const filesToCopy = [
  "admin.html",
  "platform.html",
  "script.js",
  "style.css",
  "supabase-config.js",
  "sw.js",
];

for (const file of filesToCopy) {
  const src = path.join(__dirname, file);
  const dest = path.join(outDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`postbuild: copied ${file} to out/`);
  }
}
