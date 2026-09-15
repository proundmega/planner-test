document.addEventListener('DOMContentLoaded', () => {
    const runBtn = document.getElementById('run-btn');
    const statusEl = document.getElementById('status');
    const progressBar = document.getElementById('progress');
    const scoreEl = document.getElementById('score');
    const resultsEl = document.getElementById('results');
    const timeTakenEl = document.getElementById('time-taken');
    const operationsEl = document.getElementById('operations');

    runBtn.addEventListener('click', runBenchmark);

    async function runBenchmark() {
        runBtn.disabled = true;
        resultsEl.style.display = 'none';
        scoreEl.textContent = '0';
        progressBar.style.width = '0%';
        statusEl.textContent = 'Starting benchmark...';

        const startTime = performance.now();

        // Simulate benchmark tasks
        await simulateTask(10, 'Calculating primes...', progressBar);
        const primes = calculatePrimes(100000);
        await simulateTask(20, 'Matrix multiplication...', progressBar);
        const matrix = multiplyMatrix(100);
        await simulateTask(30, 'String manipulation...', progressBar);
        const strings = manipulateStrings(10000);
        await simulateTask(40, 'Math operations...', progressBar);
        const mathOps = performMathOps(1000000);
        await simulateTask(50, 'Sorting...', progressBar);
        const sorted = sortArray(100000);
        await simulateTask(60, 'Hashing...', progressBar);
        const hash = hashString('benchmark test string');
        await simulateTask(70, 'Compression simulation...', progressBar);
        const compressed = compressData(10000);
        await simulateTask(80, 'Decompression simulation...', progressBar);
        const decompressed = decompressData(compressed);
        await simulateTask(90, 'Finalizing...', progressBar);

        const endTime = performance.now();
        const timeTaken = endTime - startTime;

        // Calculate score based on operations and time
        const totalOperations = primes.length + matrix.length + strings.length + mathOps + sorted.length + 1 + compressed.length + decompressed.length;
        const score = Math.round((totalOperations / timeTaken) * 10000);

        progressBar.style.width = '100%';
        statusEl.textContent = 'Benchmark complete!';
        scoreEl.textContent = score;

        timeTakenEl.textContent = `${timeTaken.toFixed(2)} ms`;
        operationsEl.textContent = totalOperations.toLocaleString();

        resultsEl.style.display = 'block';
        runBtn.disabled = false;
    }

    function simulateTask(progress, message, progressBar) {
        return new Promise(resolve => {
            statusEl.textContent = message;
            progressBar.style.width = `${progress}%`;
            setTimeout(resolve, 100);
        });
    }

    function calculatePrimes(limit) {
        const primes = [];
        for (let i = 2; i < limit; i++) {
            let isPrime = true;
            for (let j = 2; j <= Math.sqrt(i); j++) {
                if (i % j === 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) primes.push(i);
        }
        return primes;
    }

    function multiplyMatrix(size) {
        const matrix1 = Array.from({ length: size }, () => Array.from({ length: size }, () => Math.random()));
        const matrix2 = Array.from({ length: size }, () => Array.from({ length: size }, () => Math.random()));
        const result = Array.from({ length: size }, () => Array(size).fill(0));

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                for (let k = 0; k < size; k++) {
                    result[i][j] += matrix1[i][k] * matrix2[k][j];
                }
            }
        }
        return result;
    }

    function manipulateStrings(count) {
        let str = '';
        for (let i = 0; i < count; i++) {
            str += 'a';
        }
        return str;
    }

    function performMathOps(count) {
        let sum = 0;
        for (let i = 0; i < count; i++) {
            sum += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
        }
        return sum;
    }

    function sortArray(count) {
        const arr = Array.from({ length: count }, () => Math.random());
        return arr.sort((a, b) => a - b);
    }

    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    function compressData(count) {
        let data = '';
        for (let i = 0; i < count; i++) {
            data += '0';
        }
        return data.replace(/0+/g, '0');
    }

    function decompressData(data) {
        return data.replace(/0/g, '0000000000');
    }
});