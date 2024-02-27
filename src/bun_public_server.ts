import { serve } from "bun";

const PORT = 1313;
const PUBLIC_DIR = "./public";

// 静的ファイルサーバーを定義
const server = serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = `${PUBLIC_DIR}${path}`;
    return new Response(Bun.file(filePath));
  },
});

console.log(`Server running at http://localhost:${PORT}/`);
