import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const incoming = process.argv.slice(2);
const forwarded = ["dev"];

for (let index = 0; index < incoming.length; index += 1) {
  const argument = incoming[index];

  if (argument === "--strictPort") continue;
  if (argument === "--host") {
    forwarded.push("--hostname");
    const value = incoming[index + 1];
    if (value) {
      forwarded.push(value);
      index += 1;
    }
    continue;
  }

  forwarded.push(argument);
}

const child = spawn(process.execPath, [nextBin, ...forwarded], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
