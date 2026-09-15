document.addEventListener('DOMContentLoaded', () => {
    const runBtn = document.getElementById('run-btn');
    const statusEl = document.getElementById('status');
    const resultEl = document.getElementById('result');
    const scoreEl = document.getElementById('score-value');
    const timeEl = document.getElementById('time-value');

    runBtn.addEventListener('click', runBenchmark);

    function runBenchmark() {
        // UI Updates
        runBtn.disabled = true;
        runBtn.textContent = 'Running...';
        statusEl.textContent = 'Calculating primes...';
        resultEl.classList.add('hidden');

        // Use setTimeout to allow UI to update before heavy calculation
        setTimeout(() => {
            const startTime = performance.now();
            const result = calculatePrimes(10000000); // Calculate primes up to 10 million
            const endTime = performance.now();
            const duration = endTime - startTime;

            // Calculate a simple score (higher is better)
            // Base score of 1000, adjusted by time
            const score = Math.round(1000000 / duration * 100);

            // Update UI
            statusEl.textContent = 'Complete';
            scoreEl.textContent = score;
            timeEl.textContent = duration.toFixed(2);
            resultEl.classList.remove('hidden');

            // Reset Button
            runBtn.disabled = false;
            runBtn.textContent = 'Run Benchmark';
        }, 100);
    }

    function calculatePrimes(limit) {
        const sieve = new Uint8Array(limit + 1);
        let count = 0;
        
        for (let i = 2; i <= limit; i++) {
            if (sieve[i] === 0) {
                count++;
                for (let j = i * i; j <= limit; j += i) {
                    sieve[j] = 1;
                }
            }
        }
        return count;
    }
});