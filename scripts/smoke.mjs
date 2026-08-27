import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const port = 3107;
const origin = `http://127.0.0.1:${port}`;
const routes = [
  ["/", "Your music, everywhere."],
  ["/pricing", "Clear early-access pricing"],
  ["/login", "Welcome back"],
  ["/signup", "Create your account"],
  ["/app", "Loading dashboard"],
  ["/app/music", "Loading dashboard"],
  ["/app/release/release_tizita", "Loading dashboard"],
  ["/app/release/new", "Loading dashboard"],
  ["/app/royalties", "Loading dashboard"],
  ["/app/wallet", "Loading dashboard"],
  ["/app/settings", "Loading dashboard"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
  ["/manifest.webmanifest", "Zema"],
  ["/robots.txt", "User-Agent"],
  ["/sitemap.xml", "<urlset"],
];

const child = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: process.cwd(),
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});

let startupOutput = "";
child.stdout.on("data", (chunk) => { startupOutput += chunk.toString(); });
child.stderr.on("data", (chunk) => { startupOutput += chunk.toString(); });

async function waitForServer() {
  const deadline = Date.now() + 25_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(1_500) });
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Zema did not start in time.\n${startupOutput}`);
}

try {
  await waitForServer();
  for (const [route, expected] of routes) {
    const response = await fetch(`${origin}${route}`, { redirect: "manual" });
    const body = await response.text();
    if (response.status !== 200) throw new Error(`${route} returned ${response.status}`);
    if (!body.includes(expected)) throw new Error(`${route} did not include expected content: ${expected}`);
    process.stdout.write(`✓ ${route}\n`);
  }
  process.stdout.write(`Smoke-tested ${routes.length} production routes.\n`);
} finally {
  child.kill("SIGTERM");
}
