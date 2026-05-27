const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const videoPath = 'landing.mp4';
const outputFolder = path.join(__dirname, 'public', 'frames');

// Limpar pasta se existir e recriar
if (!fs.existsSync(outputFolder)){
    fs.mkdirSync(outputFolder, { recursive: true });
}

console.log('Iniciando extração de frames de alta qualidade...');
console.log('Por favor, aguarde. Pode levar alguns segundos.');

ffmpeg(videoPath)
  .outputOptions([
    '-q:v 2',      // Qualidade do JPEG (2 é excelente, escala vai de 2 a 31)
    '-pix_fmt yuvj420p',
    '-vf scale=1280:-1' // Redimensiona a largura para 1280px (mantendo proporção) para performance na web
  ])
  .output(`${outputFolder}/frame_%04d.jpg`)
  .on('end', function() {
    console.log('✔ Extração de frames concluída com sucesso!');
    console.log('As imagens foram salvas em: public/frames/');
  })
  .on('error', function(err) {
    console.log('✖ Erro durante a extração: ' + err.message);
  })
  .run();
