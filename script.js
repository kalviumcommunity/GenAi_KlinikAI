// Global variables
let currentApiKey = '';
let currentTemperature = 0.7; // Default temperature

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
    
    // Load saved temperature from localStorage
    const savedTemperature = localStorage.getItem('groqTemperature');
    if (savedTemperature) {
        currentTemperature = parseFloat(savedTemperature);
        updateTemperatureDisplay();
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

// Temperature control functions
function updateTemperature(newTemperature) {
    currentTemperature = newTemperature;
    localStorage.setItem('groqTemperature', currentTemperature.toString());
    updateTemperatureDisplay();
    
    // Show temperature effect explanation
    showTemperatureEffect(newTemperature);
}

function updateTemperatureDisplay() {
    const tempSlider = document.getElementById('temperatureSlider');
    const tempValue = document.getElementById('temperatureValue');
    const tempDescription = document.getElementById('temperatureDescription');
    
    if (tempSlider) tempSlider.value = currentTemperature;
    if (tempValue) tempValue.textContent = currentTemperature;
    if (tempDescription) tempDescription.textContent = getTemperatureDescription(currentTemperature);
}

function getTemperatureDescription(temperature) {
    if (temperature <= 0.1) return "Very Conservative - Highly focused and consistent responses";
    if (temperature <= 0.3) return "Conservative - Focused and predictable responses";
    if (temperature <= 0.5) return "Balanced - Good balance of creativity and consistency";
    if (temperature <= 0.7) return "Creative - More varied and imaginative responses";
    if (temperature <= 0.9) return "Very Creative - Highly varied and innovative responses";
    return "Maximum Creativity - Maximum randomness and creativity";
}

function showTemperatureEffect(temperature) {
    const effectDiv = document.getElementById('temperatureEffect');
    if (!effectDiv) return;
    
    effectDiv.style.display = 'block';
    effectDiv.innerHTML = `
        <h4>🎯 Temperature Effect: ${temperature}</h4>
        <p><strong>${getTemperatureDescription(temperature)}</strong></p>
        <p>This setting will affect how creative vs. consistent the AI responses are.</p>
    `;
    
    // Hide after 5 seconds
    setTimeout(() => {
        effectDiv.style.display = 'none';
    }, 5000);
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
        const response = await sendPromptToGroq(prompt, currentTemperature);
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
        const response = await sendPromptToGroq(prompt, currentTemperature);
        showResponse('multiShotResponse', 'multiShotContent', response);
    } catch (error) {
        showError('multiShotResponse', `Error: ${error.message}`);
    } finally {
        showLoading('multiShotLoading', false);
    }
}

// Send prompt to Groq API - now with temperature control
async function sendPromptToGroq(content, temperature = 0.7) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentApiKey}`,
        },
        body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [{ role: 'user', content }],
            temperature: temperature,
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

// Test different temperatures with the same prompt
async function testTemperatureEffects() {
    if (!validateApiKey()) return;
    
    const prompt = "Explain the symptoms of diabetes in a creative way";
    const temperatures = [0.1, 0.3, 0.7, 1.0];
    const results = [];
    
    showLoading('temperatureTestLoading', true);
    
    try {
        for (let temp of temperatures) {
            const response = await sendPromptToGroq(prompt, temp);
            results.push({ temperature: temp, response: response });
        }
        
        // Display results
        showTemperatureTestResults(results);
    } catch (error) {
        showError('temperatureTestResponse', `Error: ${error.message}`);
    } finally {
        showLoading('temperatureTestLoading', false);
    }
}

function showTemperatureTestResults(results) {
    const responseDiv = document.getElementById('temperatureTestResponse');
    if (!responseDiv) return;
    
    let content = '<h3>🌡️ Temperature Effect Comparison:</h3>';
    
    results.forEach(result => {
        content += `
            <div style="margin: 20px 0; padding: 15px; border: 2px solid #e9ecef; border-radius: 10px;">
                <h4>Temperature: ${result.temperature} - ${getTemperatureDescription(result.temperature)}</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    ${result.response}
                </div>
            </div>
        `;
    });
    
    responseDiv.innerHTML = content;
    responseDiv.style.display = 'block';
}

// Validation functions
function validateApiKey() {
    if (!currentApiKey.trim()) {
        alert('Please enter your Groq API key first.');
        apiKeyInput.focus();
        return false;
    }
    return true;
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
