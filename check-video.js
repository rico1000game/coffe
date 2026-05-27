const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

ffmpeg.ffprobe('landing.mp4', (err, metadata) => {
  if (err) {
    console.error(err);
  } else {
    const videoStream = metadata.streams.find(s => s.codec_type === 'video');
    console.log(`Duration: ${metadata.format.duration}s`);
    console.log(`Resolution: ${videoStream.width}x${videoStream.height}`);
    console.log(`FPS: ${videoStream.r_frame_rate}`);
    console.log(`Total Frames: ${videoStream.nb_frames || 'N/A'}`);
  }
});
