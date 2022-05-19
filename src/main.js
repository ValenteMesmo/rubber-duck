var quack = new Audio('src/quack.mp3');;

const volumeMeterEl = document.getElementById('volumeMeter');
const startButtonEl = document.getElementById('startButton');
const countDown = document.getElementById('countdown');
const quackCooldown = 6900;

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
        const currentVolume = Math.sqrt(sumSquares / pcmData.length);

        const countdownValue = Math.floor
            (
                (quackCooldown - (new Date() - lastTime)) / 1000
            ).toFixed(0);

        if (countdownValue >= 0 && countdownValue <= 6)
            countdown.innerText = countdownValue;

        volumeMeterEl.value = currentVolume;

        if (currentVolume > 0.03) {
            lastTime = new Date();
        }
        else {
            if (new Date() - lastTime > quackCooldown) {
                lastTime = new Date();

                quack.play();
            }
        }

        setTimeout(() => onFrame(), 18);
    };

    onFrame();
};