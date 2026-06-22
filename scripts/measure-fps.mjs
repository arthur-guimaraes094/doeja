import { spawn } from "child_process";
import http from "http";
import fs from "fs";
import puppeteer from "puppeteer-core";

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

function checkServerReady(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      const headers = res.headers;
      const isNextHeader = headers['x-powered-by'] && headers['x-powered-by'].includes('Next.js');
      
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        const hasNextIndicator = 
          data.includes("__NEXT_DATA__") || 
          data.includes("/_next/static") || 
          data.includes("next-route-announcer") || 
          data.includes("DoeJÁ") ||
          data.includes("doeja");
        
        if (isNextHeader || hasNextIndicator) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
    
    req.on("error", () => {
      resolve(false);
    });
    
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

async function findNextjsPort() {
  const ports = [3000, 3001, 3002, 3003];
  for (const port of ports) {
    const ready = await checkServerReady(port);
    if (ready) return port;
  }
  return null;
}

async function main() {
  console.log("🔍 Verificando se o servidor local do Next.js está rodando...");
  let serverProcess = null;
  let activePort = await findNextjsPort();

  if (!activePort) {
    console.log("🚀 Servidor Next.js não detectado. Iniciando `npm run dev`...");
    // Spawning npm run dev (or npm.cmd on Windows to avoid ExecutionPolicy errors)
    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
    serverProcess = spawn(npmCmd, ["run", "dev"], {
      cwd: process.cwd(),
      shell: true,
      stdio: "inherit"
    });

    console.log("⏳ Aguardando o Next.js inicializar...");
    const start = Date.now();
    const timeoutMs = 30000;
    while (Date.now() - start < timeoutMs) {
      activePort = await findNextjsPort();
      if (activePort) break;
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (!activePort) {
      console.error("❌ Falha ao iniciar o servidor Next.js.");
      process.exit(1);
    }
    console.log(`✅ Servidor Next.js iniciado com sucesso na porta ${activePort}!`);
  } else {
    console.log(`✅ Servidor local do Next.js já está rodando na porta ${activePort}.`);
  }

  const URL = `http://localhost:${activePort}/?perf=true`;
  console.log(`🔗 Usando URL para o teste: ${URL}`);

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
