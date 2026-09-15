const runBtn = document.getElementById('run-btn');
const scoreDisplay = document.getElementById('score');
const statusDisplay = document.getElementById('status');

runBtn.addEventListener('click', runBenchmark);

async function runBenchmark() {
    runBtn.disabled = true;
    statusDisplay.textContent = 'Running benchmark...';
    scoreDisplay.textContent = '...';

    // Use setTimeout to allow UI to update before blocking the main thread
    setTimeout(() => {
        const startTime = performance.now();
        const duration = 1000; // Run for 1 second
        let count = 0;

        // CPU intensive task: calculating square roots and primes
        while (performance.now() - startTime < duration) {
            for (let i = 0; i < 10000; i++) {
                Math.sqrt(i);
                // Simple prime check simulation
                let isPrime = true;
                for (let j = 2; j <= Math.sqrt(i); j++) {
                    if (i % j === 0) {
                        isPrime = false;
                        break;
                    }
                }
                count++;
            }
        }

        const endTime = performance.now();
        const elapsed = endTime - startTime;
        
        // Calculate a score based on operations per second
        // This is a relative score, not an absolute hardware metric
        const score = Math.round((count / (elapsed / 1000)) / 10000);

        statusDisplay.textContent = 'Benchmark Complete';
        scoreDisplay.textContent = score;
        runBtn.disabled = false;
    }, 100);
}