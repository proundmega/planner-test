document.getElementById('run-btn').addEventListener('click', runBenchmark);

function runBenchmark() {
    const btn = document.getElementById('run-btn');
    const resultDiv = document.getElementById('result');
    
    btn.disabled = true;
    btn.textContent = 'Running...';
    resultDiv.textContent = '';

    // Use setTimeout to allow UI to update before heavy calculation
    setTimeout(() => {
        const startTime = performance.now();
        
        // Benchmark logic: Calculate primes up to 1,000,000
        // This is a CPU-intensive task that relies on math operations
        const limit = 1000000;
        let count = 0;
        for (let i = 2; i <= limit; i++) {
            let isPrime = true;
            for (let j = 2; j <= Math.sqrt(i); j++) {
                if (i % j === 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) {
                count++;
            }
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Display result
        resultDiv.textContent = `Completed in ${duration.toFixed(2)} ms`;
        
        btn.disabled = false;
        btn.textContent = 'Run Benchmark';
    }, 100);
}