document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const resultsDiv = document.getElementById('results');
    const scoreValue = document.getElementById('scoreValue');
    const timeValue = document.getElementById('timeValue');
    const statusValue = document.getElementById('statusValue');

    startBtn.addEventListener('click', async () => {
        startBtn.disabled = true;
        startBtn.textContent = 'Running...';
        resultsDiv.style.display = 'block';
        statusValue.textContent = 'Initializing...';
        scoreValue.textContent = '0';
        timeValue.textContent = '0';

        // Simulate benchmark process
        const startTime = Date.now();
        
        // Simulate work
        await new Promise(resolve => setTimeout(resolve, 1000));
        statusValue.textContent = 'Calculating...';
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        
        // Generate a pseudo-random score based on duration to make it look dynamic
        // In a real app, this would be actual math operations
        const baseScore = 10000;
        const randomFactor = Math.random() * 2000;
        const finalScore = Math.floor(baseScore + randomFactor);

        scoreValue.textContent = finalScore;
        timeValue.textContent = duration.toFixed(2);
        statusValue.textContent = 'Completed';
        
        startBtn.disabled = false;
        startBtn.textContent = 'Run Benchmark';
    });
});