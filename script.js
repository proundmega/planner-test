document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const resultDiv = document.getElementById('result');
    const scoreSpan = document.getElementById('score');
    const detailsP = document.getElementById('details');

    startBtn.addEventListener('click', runBenchmark);

    function runBenchmark() {
        startBtn.disabled = true;
        startBtn.textContent = 'Running...';
        resultDiv.classList.add('hidden');

        // Benchmark logic: Calculate primes up to a limit
        const limit = 50000; 
        const startTime = performance.now();
        
        let count = 0;
        for (let i = 2; i <= limit; i++) {
            if (isPrime(i)) {
                count++;
            }
        }

        const endTime = performance.now();
        const duration = endTime - startTime;

        // Update UI
        scoreSpan.textContent = duration.toFixed(2);
        detailsP.textContent = `Calculated ${count} primes up to ${limit}.`;
        
        resultDiv.classList.remove('hidden');
        startBtn.disabled = false;
        startBtn.textContent = 'Run Again';
    }

    function isPrime(num) {
        for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
            if (num % i === 0) return false;
        }
        return true;
    }
});
