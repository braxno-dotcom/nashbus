const isProd = process.env.NODE_ENV === "production";
const repoName = "nashbus"; // Must match next.config.ts

export const basePath = isProd ? `/${repoName}` : "";
