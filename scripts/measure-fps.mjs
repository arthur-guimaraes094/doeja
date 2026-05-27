import { spawn } from "child_process";
import http from "http";
import fs from "fs";
import puppeteer from "puppeteer-core";

const PORT = 3000;
const URL = `http://localhost:${PORT}/?perf=true`;

const browserPaths = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
];

function findBrowserPath() {
  for (const path of browserPaths) {
    if (fs.existsSync(path)) {
      return path;
    }
  }
  return null;
}

function checkServerReady() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}`, (res) => {
      resolve(true);
    });
    req.on("error", () => {
      resolve(false);
    });
    req.end();
  });
}

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ready = await checkServerReady();
    if (ready) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function main() {
  console.log("🔍 Verificando se o servidor local está rodando...");
  let serverProcess = null;
  const alreadyRunning = await checkServerReady();

  if (!alreadyRunning) {
    console.log("🚀 Servidor não detectado. Iniciando `npm run dev`...");
    // Spawning npm run dev
    // On Windows we should use shell: true to launch npm
    serverProcess = spawn("npm", ["run", "dev"], {
      cwd: process.cwd(),
      shell: true,
      stdio: "inherit"
    });

    console.log("⏳ Aguardando o Next.js inicializar na porta 3000...");
    const ready = await waitForServer();
    if (!ready) {
      console.error("❌ Falha ao iniciar o servidor Next.js.");
      process.exit(1);
    }
    console.log("✅ Servidor Next.js iniciado com sucesso!");
  } else {
    console.log("✅ Servidor local já está rodando na porta 3000.");
  }

  const browserPath = findBrowserPath();
  if (!browserPath) {
    console.error("❌ Nenhum navegador compatível (Edge ou Chrome) foi encontrado.");
    if (serverProcess) serverProcess.kill();
    process.exit(1);
  }
  console.log(`🌐 Usando navegador: ${browserPath}`);

  console.log("🚀 Iniciando teste de performance...");
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  // Navigate and wait for content to load
  await page.goto(URL, { waitUntil: "networkidle2" });
  console.log("🔗 Página carregada. Iniciando medições de frame...");

  // Iniciar a coleta de frames no navegador
  await page.evaluate(() => {
    window.frameDeltas = [];
    let lastTime = performance.now();
    function tick(time) {
      const delta = time - lastTime;
      window.frameDeltas.push(delta);
      lastTime = time;
      window.tickRequest = requestAnimationFrame(tick);
    }
    window.tickRequest = requestAnimationFrame(tick);
  });

  // Simular interação do usuário: Rolar a página e mover o mouse
  console.log("🖱️ Simulando interações (movimento do mouse e rolagem)...");
  
  // Mover o mouse aleatoriamente pela tela para interagir com o canvas
  for (let i = 0; i < 20; i++) {
    const x = 100 + Math.random() * 800;
    const y = 100 + Math.random() * 500;
    await page.mouse.move(x, y, { steps: 5 });
    await new Promise((r) => setTimeout(r, 100));
  }

  // Rolar para baixo e para cima
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, 300));
    await new Promise((r) => setTimeout(r, 150));
  }

  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, -300));
    await new Promise((r) => setTimeout(r, 150));
  }

  // Parar a coleta e obter dados
  console.log("📊 Coletando resultados...");
  const deltas = await page.evaluate(() => {
    cancelAnimationFrame(window.tickRequest);
    return window.frameDeltas;
  });

  await browser.close();
  if (serverProcess) {
    console.log("🔌 Encerrando o servidor de teste...");
    // Kill child process on Windows
    serverProcess.kill("SIGTERM");
  }

  // Analisar dados de FPS
  if (!deltas || deltas.length < 10) {
    console.error("❌ Não foram capturados frames suficientes para análise.");
    process.exit(1);
  }

  // Calcular FPS por frame
  const fpsList = deltas.map((d) => 1000 / d);
  const totalFrames = deltas.length;
  const totalDuration = deltas.reduce((a, b) => a + b, 0);
  const averageFps = (totalFrames * 1000) / totalDuration;
  
  // Mínimo de FPS ignorando o primeiro frame (que pode ser mais lento no setup)
  const sortedFps = [...fpsList].slice(2).sort((a, b) => a - b);
  const minFps = sortedFps[0] || 0;
  
  // Percentual de frames abaixo de 60fps (tempo de frame > 16.67ms)
  const lowFpsCount = deltas.filter((d) => d > 16.67).length;
  const pctLowFps = (lowFpsCount / totalFrames) * 100;

  console.log("\n=============================================");
  console.log("        RELATÓRIO DE PERFORMANCE FPS        ");
  console.log("=============================================");
  console.log(`Frames Totais Capturados : ${totalFrames}`);
  console.log(`Duração do Teste         : ${(totalDuration / 1000).toFixed(2)}s`);
  console.log(`FPS Médio                : ${averageFps.toFixed(2)} FPS`);
  console.log(`FPS Mínimo Registrado    : ${minFps.toFixed(2)} FPS`);
  console.log(`Frames abaixo de 60 FPS  : ${lowFpsCount} (${pctLowFps.toFixed(1)}%)`);
  console.log("=============================================");

  const targetFps = 60.0;
  if (averageFps >= targetFps) {
    console.log(`\n✅ SUCESSO: O projeto rodou com média de ${averageFps.toFixed(2)} FPS (meta >= ${targetFps} FPS).`);
    process.exit(0);
  } else {
    console.error(`\n❌ FALHA: O projeto rodou com média de ${averageFps.toFixed(2)} FPS (abaixo da meta de ${targetFps} FPS).`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ Erro inesperado durante o teste:", err);
  process.exit(1);
});
