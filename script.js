document.getElementById('startBtn').addEventListener('click', runBenchmark);

async function runBenchmark() {
    const btn = document.getElementById('startBtn');
    const resultDiv = document.getElementById('result');
    const scoreSpan = document.getElementById('score');
    const timeSpan = document.getElementById('time');

    btn.disabled = true;
    btn.textContent = 'Running...';
    resultDiv.classList.remove('hidden');
    scoreSpan.textContent = '...';
    timeSpan.textContent = '...';

    // Allow UI to update before heavy computation
    await new Promise(resolve => setTimeout(resolve, 100));

    const iterations = 10000000; // 10 million iterations
    let result = 0;
    const start = performance.now();

    // CPU intensive task: Math operations
    for (let i = 0; i < iterations; i++) {
        result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
    }

    const end = performance.now();
    const duration = end - start;

    // Calculate score (normalized, higher is better)
    // Base score is roughly 1000 for 10ms, scales inversely with time
    const score = Math.round((10000 / duration) * 100);

    scoreSpan.textContent = score;
    timeSpan.textContent = duration.toFixed(2);

    btn.disabled = false;
    btn.textContent = 'Run Again';
}