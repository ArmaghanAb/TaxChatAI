
document.getElementById('sendButton').addEventListener('click', async () => {
    const prompt = document.getElementById('taxPrompt').value;
    const responseText = document.getElementById('responseText');

    responseText.textContent = '';

    try {
        // Fetch request to send the tax-related prompt
        const response = await fetch('http://localhost:3000/taxPrompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

         // Keywords to ensure the prompt is tax-related
    const taxKeywords = ['tax', 'deduction', 'income', 'IRS', 'revenue', 'refund', 'exemption', 'tax credit'];
    const isTaxRelated = taxKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

    // If the prompt is not tax-related, show an error in the response section and stop
    if (!isTaxRelated) {
        responseText.textContent = 'Error: Please enter a tax-related question.';
        return;
    }
        // Get the data from the response
        const data = await response.json();
        responseText.textContent = data.message;  

        // Store the response in LocalStorage
        const previousResponses = JSON.parse(localStorage.getItem('responses')) || [];
        previousResponses.push({
            prompt: prompt,
            response: data.message,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('responses', JSON.stringify(previousResponses));  // Save it back to LocalStorage

       // Function to log stored responses to the console
    function logStoredResponses() {
    const savedResponses = JSON.parse(localStorage.getItem('responses')) || [];
    console.log('Stored Responses:', savedResponses);
}
    // Call this function to log the stored responses in the console
    logStoredResponses();

    } catch (error) {
        // Show error in response section if the request fails
        responseText.textContent = 'Error: ' + error.message;
    }
});

document.getElementById('cancelButton').addEventListener('click', () => {
    const responseText = document.getElementById('responseText');
    const promptInput = document.getElementById('taxPrompt');

    promptInput.value = '';
    responseText.textContent = '';
});

document.getElementById('historyButton').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/history');
        const historyData = await response.json();
        
        const historyWindow = window.open('', 'HistoryWindow', 'width=600,height=400');

        // Create an HTML structure to display the history
        let historyHTML = '<h2>Prompt and Response History</h2>';
        historyHTML += '<table border="1" cellpadding="10"><tr><th>Prompt</th><th>Response</th><th>Timestamp</th></tr>';
        
        historyData.forEach(item => {
            historyHTML += `<tr><td>${item.prompt}</td><td>${item.response}</td><td>${new Date(item.timestamp).toLocaleString()}</td></tr>`;
        });
        
        historyHTML += '</table>';
        
        historyWindow.document.write(historyHTML);
        console.log('Fetching history from server...');

    } catch (error) {
        console.error('Error fetching history:', error);
    }
});