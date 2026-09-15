document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const statusEl = document.getElementById('status');
    const resultsEl = document.getElementById('results');
    
    const primeResultEl = document.getElementById('primeResult');
    const piResultEl = document.getElementById('piResult');
    const matrixResultEl = document.getElementById('matrixResult');
    const totalResultEl = document.getElementById('totalResult');

    startBtn.addEventListener('click', runBenchmark);

    async function runBenchmark() {
        // Reset UI
        startBtn.disabled = true;
        resultsEl.classList.add('hidden');
        primeResultEl.textContent = '...';
        piResultEl.textContent = '...';
        matrixResultEl.textContent = '...';
        totalResultEl.textContent = '...';
        
        let totalScore = 0;
        const tasks = [];

        try {
            // Task 1: Prime Number Sieve
            statusEl.textContent = 'Running Prime Number Sieve...';
            const primeTime = benchmarkPrimes(1000000);
            tasks.push({ name: 'Prime', time: primeTime });
            primeResultEl.textContent = `${primeTime.toFixed(2)} ms`;

            // Task 2: Pi Calculation
            statusEl.textContent = 'Calculating Pi...';
            const piTime = benchmarkPi(10000000);
            tasks.push({ name: 'Pi', time: piTime });
            piResultEl.textContent = `${piTime.toFixed(2)} ms`;

            // Task 3: Matrix Multiplication
            statusEl.textContent = 'Performing Matrix Multiplication...';
            const matrixTime = benchmarkMatrix(200);
            tasks.push({ name: 'Matrix', time: matrixTime });
            matrixResultEl.textContent = `${matrixTime.toFixed(2)} ms`;

            // Calculate Score (Lower time is better, so we invert)
            // Score = 1000 / time for each, sum them up
            const score = tasks.reduce((acc, task) => {
                return acc + (1000 / task.time);
            }, 0);
            
            totalResultEl.textContent = Math.round(score);
            statusEl.textContent = 'Benchmark Complete';
            resultsEl.classList.remove('hidden');

        } catch (error) {
            console.error(error);
            statusEl.textContent = 'Error running benchmark';
        } finally {
            startBtn.disabled = false;
        }
    }

    function benchmarkPrimes(limit) {
        const start = performance.now();
        const sieve = new Uint8Array(limit + 1);
        let count = 0;
        
        for (let i = 2; i <= limit; i++) {
            if (!sieve[i]) {
                count++;
                for (let j = i * i; j <= limit; j += i) {
                    sieve[j] = 1;
                }
            }
        }
        
        const end = performance.now();
        return end - start;
    }

    function benchmarkPi(iterations) {
        const start = performance.now();
        let pi = 0;
        
        // Using a simple series: 4 * (1 - 1/3 + 1/5 - 1/7 ...)
        // This is slow but CPU intensive
        for (let i = 0; i < iterations; i++) {
            const term = (i % 2 === 0 ? 1 : -1) / (2 * i + 1);
            pi += term;
        }
        pi *= 4;
        
        const end = performance.now();
        return end - start;
    }

    function benchmarkMatrix(size) {
        const start = performance.now();
        
        // Create matrices
        const a = new Float32Array(size * size);
        const b = new Float32Array(size * size);
        const c = new Float32Array(size * size);
        
        // Initialize with random values
        for (let i = 0; i < size * size; i++) {
            a[i] = Math.random();
            b[i] = Math.random();
        }
        
        // Multiply
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let sum = 0;
                for (let k = 0; k < size; k++) {
                    sum += a[i * size + k] * b[k * size + j];
                }
                c[i * size + j] = sum;
            }
        }
        
        const end = performance.now();
        return end - start;
    }
});