let mediaRecorder;
let recordedChunks = [];
let stream = null;

window.startScreenRecording = async function () {
  stream = await navigator.mediaDevices.getDisplayMedia({
    video: { mediaSource: 'screen' }
  });

  mediaRecorder = new MediaRecorder(stream);
  recordedChunks = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    // ✅ Generate timestamped filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `Athlon-Player-${timestamp}.mp4`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    // ✅ Clean up the stream
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  };

  mediaRecorder.start();
};

window.stopScreenRecording = function () {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
};
