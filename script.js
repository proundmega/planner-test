document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const statusEl = document.getElementById('status');
    const progressBar = document.getElementById('progress-bar');
    const resultsEl = document.getElementById('results');
    const scoreEl = document.getElementById('score');
    const cpuModelEl = document.getElementById('cpu-model');
    const coresEl = document.getElementById('cores');
    const timeEl = document.getElementById('time');

    startBtn.addEventListener('click', runBenchmark);

    function runBenchmark() {
        // Reset UI
        startBtn.disabled = true;
        resultsEl.style.display = 'none';
        progressBar.style.width = '0%';
        statusEl.textContent = 'Running benchmark...';

        const duration = 3000; // 3 seconds
        const startTime = Date.now();
        let progress = 0;

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            progress = Math.min((elapsed / duration) * 100, 100);
            progressBar.style.width = `${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
                finishBenchmark(elapsed);
            }
        }, 50);
    }

    function finishBenchmark(elapsed) {
        const score = Math.floor(Math.random() * 5000) + 5000; // Random score between 5000 and 10000
        const time = (elapsed / 1000).toFixed(2);
        const cores = Math.floor(Math.random() * 8) + 4; // Random cores between 4 and 12

        scoreEl.textContent = score;
        timeEl.textContent = `${time}s`;
        coresEl.textContent = cores;
        cpuModelEl.textContent = `Simulated CPU @ ${(Math.random() * 2 + 2).toFixed(1)} GHz`;

        statusEl.textContent = 'Benchmark Complete';
        resultsEl.style.display = 'block';
        startBtn.disabled = false;
        startBtn.textContent = 'Run Again';
    }
});