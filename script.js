// Global variables
let currentApiKey = '';

// DOM elements
const apiKeyInput = document.getElementById('apiKey');
const zeroShotPromptInput = document.getElementById('zeroShotPrompt');
const multiShotPromptInput = document.getElementById('multiShotPrompt');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load API key from localStorage if available
    const savedApiKey = localStorage.getItem('groqApiKey');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
        currentApiKey = savedApiKey;
    }
    
    // Save API key when changed
    apiKeyInput.addEventListener('input', function() {
        currentApiKey = this.value;
        localStorage.setItem('groqApiKey', currentApiKey);
    });
    
    // Load the original KlinikAI multi-shot prompt
    loadKlinikAIMultiShotPrompt();
});

// Load the KlinikAI multi-shot prompt for medical record analysis
function loadKlinikAIMultiShotPrompt() {
    const klinikAIPrompt = `You are a medical AI assistant for KlinikAI. Given a patient's symptoms and medical history, provide a preliminary assessment and recommendations.

Example 1:
Patient Symptoms: Chest pain, shortness of breath, fatigue
Medical History: Hypertension, diabetes, smoker
Output:
1. Assessment: Possible cardiac event, requires immediate evaluation
2. Recommendations: ECG, cardiac enzymes, chest X-ray
3. Priority: High - refer to cardiologist

Example 2:
Patient Symptoms: Fever, cough, body aches
Medical History: No chronic conditions, recent travel
Output:
1. Assessment: Likely viral respiratory infection
2. Recommendations: Rest, fluids, symptomatic treatment
3. Priority: Low - monitor for complications

Now your turn:
Patient Symptoms: Headache, nausea, sensitivity to light
Medical History: Migraine history, no other conditions

Please provide assessment and recommendations following the same format as the examples above.`;
    
    multiShotPromptInput.value = klinikAIPrompt;
}

// Zero-shot prompting function - using KlinikAI relevant prompt
async function sendZeroShotPrompt() {
    if (!validateApiKey()) return;
    
    const prompt = zeroShotPromptInput.value.trim();
    if (!prompt) {
        showError('zeroShotResponse', 'Please enter a prompt.');
        return;
    }
    
    showLoading('zeroShotLoading', true);
    hideResponse('zeroShotResponse');
    
    try {
        const response = await sendPromptToGroq(prompt);
        showResponse('zeroShotResponse', 'zeroShotContent', response);
    } catch (error) {
        showError('zeroShotResponse', `Error: ${error.message}`);
    } finally {
        showLoading('zeroShotLoading', false);
    }
}

// Multi-shot prompting function - using KlinikAI relevant prompt
async function sendMultiShotPrompt() {
    if (!validateApiKey()) return;
    
    const prompt = multiShotPromptInput.value.trim();
    if (!prompt) {
        showError('multiShotResponse', 'Please enter a multi-shot prompt.');
        return;
    }
    
    showLoading('multiShotLoading', true);
    hideResponse('multiShotResponse');
    
    try {
        const response = await sendPromptToGroq(prompt);
        showResponse('multiShotResponse', 'multiShotContent', response);
    } catch (error) {
        showError('multiShotResponse', `Error: ${error.message}`);
    } finally {
        showLoading('multiShotLoading', false);
    }
}

// Send prompt to Groq API - same as your original implementation
async function sendPromptToGroq(content) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentApiKey}`,
        },
        body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [{ role: 'user', content }],
            temperature: 0.7,
            max_tokens: 1000,
        }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

// Validation functions
function validateApiKey() {
    if (!currentApiKey.trim()) {
        alert('Please enter your Groq API key first.');
        apiKeyInput.focus();
        return false;
    }
    return false;
}

// UI helper functions
function showLoading(loadingId, show) {
    const loadingElement = document.getElementById(loadingId);
    if (show) {
        loadingElement.classList.add('show');
    } else {
        loadingElement.classList.remove('show');
    }
}

function showResponse(responseId, contentId, content) {
    const responseElement = document.getElementById(responseId);
    const contentElement = document.getElementById(contentId);
    
    contentElement.textContent = content;
    responseElement.classList.add('show');
    responseElement.classList.remove('error');
}

function showError(responseId, errorMessage) {
    const responseElement = document.getElementById(responseId);
    const contentElement = document.getElementById(responseId).querySelector('.response-content');
    
    contentElement.textContent = errorMessage;
    responseElement.classList.add('show', 'error');
}

function hideResponse(responseId) {
    const responseElement = document.getElementById(responseId);
    responseElement.classList.remove('show', 'error');
}
