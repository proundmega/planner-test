// Utility to log messages
function log(message) {
    const logList = document.getElementById('log-list');
    const li = document.createElement('li');
    const time = new Date().toLocaleTimeString();
    li.textContent = `[${time}] ${message}`;
    logList.prepend(li);
}

// Utility to sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Benchmark: Prime Numbers
async function runPrimeBenchmark() {
    log('Starting Prime Number benchmark...');
    const start = performance.now();
    
    // Run in a timeout to allow UI to update
    setTimeout(() => {
        let count = 0;
        for (let i = 2; i <= 1000000; i++) {
            let isPrime = true;
            for (let j = 2; j <= Math.sqrt(i); j++) {
                if (i % j === 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) count++;
        }
        const end = performance.now();
        const duration = end - start;
        document.getElementById('res-prime').textContent = `${duration.toFixed(2)} ms`;
        log(`Prime benchmark finished. Found ${count} primes in ${duration.toFixed(2)} ms.`);
    }, 10);
}

// Benchmark: Fibonacci
async function runFibBenchmark() {
    log('Starting Fibonacci benchmark...');
    const start = performance.now();
    
    setTimeout(() => {
        function fib(n) {
            if (n <= 1) return n;
            return fib(n - 1) + fib(n - 2);
        }
        
        fib(40);
        
        const end = performance.now();
        const duration = end - start;
        document.getElementById('res-fib').textContent = `${duration.toFixed(2)} ms`;
        log(`Fibonacci benchmark finished in ${duration.toFixed(2)} ms.`);
    }, 10);
}

// Benchmark: Sorting
async function runSortBenchmark() {
    log('Starting Sort benchmark...');
    const start = performance.now();
    
    setTimeout(() => {
        const arr = [];
        for (let i = 0; i < 1000000; i++) {
            arr.push(Math.floor(Math.random() * 1000000));
        }
        
        arr.sort((a, b) => a - b);
        
        const end = performance.now();
        const duration = end - start;
        document.getElementById('res-sort').textContent = `${duration.toFixed(2)} ms`;
        log(`Sort benchmark finished in ${duration.toFixed(2)} ms.`);
    }, 10);
}

// Benchmark: Matrix Multiplication
async function runMatrixBenchmark() {
    log('Starting Matrix Multiplication benchmark...');
    const start = performance.now();
    
    setTimeout(() => {
        const size = 500;
        const a = [];
        const b = [];
        const c = [];
        
        for (let i = 0; i < size; i++) {
            a[i] = [];
            b[i] = [];
            c[i] = [];
            for (let j = 0; j < size; j++) {
                a[i][j] = Math.random();
                b[i][j] = Math.random();
                c[i][j] = 0;
            }
        }
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                for (let k = 0; k < size; k++) {
                    c[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        
        const end = performance.now();
        const duration = end - start;
        document.getElementById('res-matrix').textContent = `${duration.toFixed(2)} ms`;
        log(`Matrix benchmark finished in ${duration.toFixed(2)} ms.`);
    }, 10);
}

log('System ready. Select a benchmark to run.');