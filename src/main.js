var quack = new Sound("src/quack.mp3", 100, false);

const volumeMeterEl = document.getElementById('volumeMeter');
const startButtonEl = document.getElementById('startButton');

startButtonEl.onclick = async () => {
    startButtonEl.disabled = true;
    //TODO: check if exists microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    let lastTime = new Date();
    mediaStreamAudioSourceNode.connect(analyserNode);

    const pcmData = new Float32Array(analyserNode.fftSize);
    const onFrame = () => {
        analyserNode.getFloatTimeDomainData(pcmData);
        let sumSquares = 0.0;
        for (const amplitude of pcmData) {
            sumSquares += amplitude * amplitude;
        }
        var currentVolume = Math.sqrt(sumSquares / pcmData.length);
        volumeMeterEl.value = currentVolume;
        if (currentVolume > 0.03) {
            lastTime = new Date();
        }
        else {
            if (new Date() - lastTime > 1000 * 6) {
                lastTime = new Date();
                quack.start();
            }
        }
        window.requestAnimationFrame(onFrame);
    };
    window.requestAnimationFrame(onFrame);
};