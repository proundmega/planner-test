document.getElementById('startBtn').addEventListener('click', async () => {
    const btn = document.getElementById('startBtn');
    const resultDiv = document.getElementById('result');
    const scoreSpan = document.getElementById('score');
    const timeSpan = document.getElementById('time');

    btn.disabled = true;
    btn.textContent = 'Running...';
    resultDiv.classList.remove('hidden');
    scoreSpan.textContent = '...';
    timeSpan.textContent = '...';

    // Use setTimeout to allow UI to update before blocking the main thread
    setTimeout(() => {
        const iterations = 10000000; // 10 million
        let sum = 0;
        const start = performance.now();

        for (let i = 0; i < iterations; i++) {
            // Heavy math operations
            sum += Math.sqrt(i) * Math.sin(i);
        }

        const end = performance.now();
        const duration = end - start;
        
        // Calculate score (arbitrary scale based on operations per ms)
        const score = Math.round(iterations / duration);

        scoreSpan.textContent = score.toLocaleString();
        timeSpan.textContent = duration.toFixed(2);
        
        btn.disabled = false;
        btn.textContent = 'Run Benchmark';
    }, 100);
});