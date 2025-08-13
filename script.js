let currentApiKey = '';
let currentTemperature = 0.7;
let tokenUsage = {
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalTokens: 0,
    callCount: 0
};

const apiKeyInput = document.getElementById('apiKey');
const zeroShotPromptInput = document.getElementById('zeroShotPrompt');
const multiShotPromptInput = document.getElementById('multiShotPrompt');

document.addEventListener('DOMContentLoaded', function() {
    const savedApiKey = localStorage.getItem('groqApiKey');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
        currentApiKey = savedApiKey;
    }
    
    const savedTemperature = localStorage.getItem('groqTemperature');
    if (savedTemperature) {
        currentTemperature = parseFloat(savedTemperature);
        updateTemperatureDisplay();
    }
    
    const savedTokenUsage = localStorage.getItem('groqTokenUsage');
    if (savedTokenUsage) {
        tokenUsage = { ...tokenUsage, ...JSON.parse(savedTokenUsage) };
        updateTokenDisplay();
    }
    
    apiKeyInput.addEventListener('input', function() {
        currentApiKey = this.value;
        localStorage.setItem('groqApiKey', currentApiKey);
    });
    
    loadKlinikAIMultiShotPrompt();
});

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

function updateTokenUsage(inputTokens, outputTokens) {
    tokenUsage.totalInputTokens += inputTokens;
    tokenUsage.totalOutputTokens += outputTokens;
    tokenUsage.totalTokens += (inputTokens + outputTokens);
    tokenUsage.callCount += 1;
    
    localStorage.setItem('groqTokenUsage', JSON.stringify(tokenUsage));
    
    updateTokenDisplay();
    
    logTokenUsage(inputTokens, outputTokens);
}

function updateTokenDisplay() {
    const tokenDisplay = document.getElementById('tokenDisplay');
    if (!tokenDisplay) return;
    
    tokenDisplay.innerHTML = `
        <h4>📊 Token Usage Statistics</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e9ecef;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #2196f3;">${tokenUsage.callCount}</div>
                <div style="color: #666; font-size: 0.9rem;">Total Calls</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e9ecef;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #4caf50;">${tokenUsage.totalInputTokens}</div>
                <div style="color: #666; font-size: 0.9rem;">Input Tokens</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e9ecef;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #ff9800;">${tokenUsage.totalOutputTokens}</div>
                <div style="color: #666; font-size: 0.9rem;">Output Tokens</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e9ecef;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #9c27b0;">${tokenUsage.totalTokens}</div>
                <div style="color: #666; font-size: 0.9rem;">Total Tokens</div>
            </div>
        </div>
        <div style="margin-top: 15px; text-align: center;">
            <button class="btn btn-warning" onclick="resetTokenUsage()" style="font-size: 14px; padding: 10px 20px;">
                🔄 Reset Token Count
            </button>
        </div>
    `;
}

function logTokenUsage(inputTokens, outputTokens) {
    const totalTokens = inputTokens + outputTokens;
    const estimatedCost = calculateEstimatedCost(totalTokens);
    
    console.log('='.repeat(60));
    console.log('🔍 TOKEN USAGE LOG');
    console.log('='.repeat(60));
    console.log(`📥 Input Tokens: ${inputTokens}`);
    console.log(`📤 Output Tokens: ${outputTokens}`);
    console.log(`📊 Total Tokens: ${totalTokens}`);
    console.log(`💰 Estimated Cost: $${estimatedCost.toFixed(6)}`);
    console.log('='.repeat(60));
    console.log(`📈 Cumulative Statistics:`);
    console.log(`   Total Calls: ${tokenUsage.callCount}`);
    console.log(`   Total Input Tokens: ${tokenUsage.totalInputTokens}`);
    console.log(`   Total Output Tokens: ${tokenUsage.totalOutputTokens}`);
    console.log(`   Grand Total Tokens: ${tokenUsage.totalTokens}`);
    console.log(`   Total Estimated Cost: $${calculateEstimatedCost(tokenUsage.totalTokens).toFixed(6)}`);
    console.log('='.repeat(60));
}

function calculateEstimatedCost(tokens) {
    return (tokens / 1000000) * 0.05;
}

function resetTokenUsage() {
    if (confirm('Are you sure you want to reset all token usage statistics?')) {
        tokenUsage = {
            totalInputTokens: 0,
            totalOutputTokens: 0,
            totalTokens: 0,
            callCount: 0
        };
        localStorage.removeItem('groqTokenUsage');
        updateTokenDisplay();
        console.log('🔄 Token usage statistics have been reset.');
    }
}

function updateTemperature(newTemperature) {
    currentTemperature = newTemperature;
    localStorage.setItem('groqTemperature', currentTemperature.toString());
    updateTemperatureDisplay();
    
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
    
    setTimeout(() => {
        effectDiv.style.display = 'none';
    }, 5000);
}

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
    
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;
    
    updateTokenUsage(inputTokens, outputTokens);
    
    return data.choices[0].message.content;
}

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

function validateApiKey() {
    if (!currentApiKey.trim()) {
        alert('Please enter your Groq API key first.');
        apiKeyInput.focus();
        return false;
    }
    return true;
}

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
