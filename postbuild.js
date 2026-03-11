const fs = require("fs");
const path = require("path");

// Replace root index.html with a simple meta redirect
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

fs.writeFileSync(path.join(__dirname, "out", "index.html"), html);
console.log("postbuild: replaced out/index.html with meta redirect");
