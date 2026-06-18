const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Get the input file path from the command line arguments
const inputFileArg = process.argv[2];

if (!inputFileArg) {
  console.log("\n❌ Por favor, especifique a imagem que deseja converter.");
  console.log("Exemplo: node scripts/convert-to-webp.js public/caixa-doacao.png\n");
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputFileArg);

if (!fs.existsSync(inputPath)) {
  console.log(`\n❌ Arquivo não encontrado: ${inputPath}\n`);
  process.exit(1);
}

const parsedPath = path.parse(inputPath);
// Keep the output file in the same directory but with a .webp extension
const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);

console.log(`⏳ Convertendo "${parsedPath.base}" para WebP...`);

sharp(inputPath)
  .webp({ 
    quality: 80, // High quality, low file size
    alphaQuality: 90, // Keep transparency crisp for design assets
    lossless: false, 
    effort: 6 // Max compression effort
  })
  .toFile(outputPath)
  .then((info) => {
    const originalSize = (fs.statSync(inputPath).size / 1024).toFixed(2);
    const finalSize = (fs.statSync(outputPath).size / 1024).toFixed(2);
    const reduction = ((1 - (finalSize / originalSize)) * 100).toFixed(1);

    console.log("\n✅ Conversão concluída com sucesso!");
    console.log(`📁 Local: ${outputPath}`);
    console.log(`⚖️  Tamanho original: ${originalSize} KB`);
    console.log(`⚡ Tamanho final WebP: ${finalSize} KB (Redução de ${reduction}%)`);
  })
  .catch((err) => {
    console.error("\n❌ Erro ao converter a imagem:", err.message);
    process.exit(1);
  });
