document.getElementById('startBtn').addEventListener('click', runBenchmark);

async function runBenchmark() {
    const btn = document.getElementById('startBtn');
    const resultsDiv = document.getElementById('results');
    
    btn.disabled = true;
    btn.textContent = 'Running...';
    resultsDiv.innerHTML = '<p>Running tests...</p>';
    resultsDiv.classList.remove('hidden');

    const results = [];

    // Test 1: Math Operations
    results.push(await testMath());

    // Test 2: String Operations
    results.push(await testString());

    // Test 3: Array Operations
    results.push(await testArray());

    // Test 4: Prime Numbers
    results.push(await testPrimes());

    displayResults(results);

    btn.disabled = false;
    btn.textContent = 'Run Benchmark';
}

function testMath() {
    return new Promise(resolve => {
        const start = performance.now();
        let sum = 0;
        for (let i = 0; i < 10000000; i++) {
            sum += Math.sqrt(i) * Math.sin(i);
        }
        const end = performance.now();
        resolve({ name: 'Math Operations', score: (end - start).toFixed(2) + ' ms' });
    });
}

function testString() {
    return new Promise(resolve => {
        const start = performance.now();
        let str = '';
        for (let i = 0; i < 100000; i++) {
            str += 'benchmark ';
        }
        const end = performance.now();
        resolve({ name: 'String Concatenation', score: (end - start).toFixed(2) + ' ms' });
    });
}

function testArray() {
    return new Promise(resolve => {
        const start = performance.now();
        const arr = Array.from({ length: 100000 }, () => Math.random());
        arr.sort((a, b) => a - b);
        const end = performance.now();
        resolve({ name: 'Array Sorting', score: (end - start).toFixed(2) + ' ms' });
    });
}

function testPrimes() {
    return new Promise(resolve => {
        const start = performance.now();
        let count = 0;
        for (let i = 2; i < 100000; i++) {
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
        resolve({ name: 'Prime Number Calculation', score: (end - start).toFixed(2) + ' ms' });
    });
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h3>Results</h3>';
    
    results.forEach(res => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `<span>${res.name}</span><span class="score">${res.score}</span>`;
        resultsDiv.appendChild(div);
    });
}