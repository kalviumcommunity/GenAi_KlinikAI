

class DynamicPromptingSystem {
    constructor() {
        this.promptTemplates = {
        
            symptomAnalysis: {
                basic: "Analyze the following symptoms: {symptoms}",
                detailed: "Provide a detailed analysis of symptoms: {symptoms}. Consider patient history: {history}",
                emergency: "URGENT: Analyze these symptoms for emergency assessment: {symptoms}. Patient history: {history}"
            },
            diagnosis: {
                general: "Based on symptoms: {symptoms}, suggest possible diagnoses",
                specific: "Given symptoms: {symptoms} and medical history: {history}, what are the most likely diagnoses?",
                differential: "Create a differential diagnosis for: {symptoms}. Include common and rare conditions."
            },
            treatment: {
                immediate: "What immediate treatment steps for: {symptoms}?",
                comprehensive: "Provide comprehensive treatment plan for: {diagnosis}",
                followup: "What follow-up care is needed for: {condition}?"
            }
        };
        
        this.contextVariables = {
            patientAge: '',
            patientGender: '',
            medicalHistory: '',
            currentMedications: '',
            allergies: '',
            vitalSigns: {},
            labResults: {}
        };
        
        this.dynamicRules = {
            ageBased: {
                pediatric: "age < 18",
                adult: "age >= 18 && age < 65",
                geriatric: "age >= 65"
            },
            severityBased: {
                low: "symptoms.length < 3",
                medium: "symptoms.length >= 3 && symptoms.length < 6",
                high: "symptoms.length >= 6"
            }
        };
    }


    generateDynamicPrompt(promptType, userInput, context = {}) {
        let baseTemplate = this.promptTemplates[promptType]?.basic || "Analyze: {input}";
        

        const fullContext = { ...this.contextVariables, ...context, input: userInput };
        
    
        const modifiedPrompt = this.applyDynamicRules(baseTemplate, fullContext);
        
        
        const finalPrompt = this.fillTemplate(modifiedPrompt, fullContext);
        
        return finalPrompt;
    }

   
    applyDynamicRules(template, context) {
        let modifiedTemplate = template;
        
       
        if (context.patientAge) {
            const age = parseInt(context.patientAge);
            if (age < 18) {
                modifiedTemplate += "\n\nIMPORTANT: This is a pediatric patient. Consider age-appropriate assessments and dosages.";
            } else if (age >= 65) {
                modifiedTemplate += "\n\nIMPORTANT: This is a geriatric patient. Consider age-related complications and polypharmacy.";
            }
        }
        
        
        if (context.symptoms) {
            const symptomCount = context.symptoms.split(',').length;
            if (symptomCount >= 6) {
                modifiedTemplate += "\n\nURGENT: Multiple symptoms detected. Prioritize critical assessment.";
            }
        }
        
        // Medical history modifications
        if (context.medicalHistory) {
            if (context.medicalHistory.toLowerCase().includes('diabetes')) {
                modifiedTemplate += "\n\nDIABETES ALERT: Consider blood glucose levels and diabetic complications.";
            }
            if (context.medicalHistory.toLowerCase().includes('heart')) {
                modifiedTemplate += "\n\nCARDIAC ALERT: Prioritize cardiovascular assessment.";
            }
        }
        
        // Allergy modifications
        if (context.allergies) {
            modifiedTemplate += `\n\nALLERGY ALERT: Patient has allergies to: ${context.allergies}`;
        }
        
        return modifiedTemplate;
    }

    // Fill template with actual values
    fillTemplate(template, context) {
        return template.replace(/\{(\w+)\}/g, (match, key) => {
            return context[key] || match;
        });
    }

    // Generate context-aware medical assessment
    generateMedicalAssessment(symptoms, additionalContext = {}) {
        const context = {
            symptoms: symptoms,
            ...additionalContext
        };
        
        // Determine prompt type based on symptoms
        let promptType = 'symptomAnalysis';
        if (symptoms.toLowerCase().includes('chest pain') || symptoms.toLowerCase().includes('shortness of breath')) {
            promptType = 'diagnosis';
            context.emergency = true;
        }
        
        return this.generateDynamicPrompt(promptType, symptoms, context);
    }

    // Generate treatment recommendation
    generateTreatmentRecommendation(diagnosis, patientContext = {}) {
        const context = {
            diagnosis: diagnosis,
            ...patientContext
        };
        
        return this.generateDynamicPrompt('treatment', diagnosis, context);
    }

    // Update context variables dynamically
    updateContext(newContext) {
        this.contextVariables = { ...this.contextVariables, ...newContext };
    }

    // Get current context
    getCurrentContext() {
        return { ...this.contextVariables };
    }

    // Reset context
    resetContext() {
        this.contextVariables = {
            patientAge: '',
            patientGender: '',
            medicalHistory: '',
            currentMedications: '',
            allergies: '',
            vitalSigns: {},
            labResults: {}
        };
    }
}

// Example usage and demonstration functions
function demonstrateDynamicPrompting() {
    const dps = new DynamicPromptingSystem();
    
    console.log("=== Dynamic Prompting Demonstration ===\n");
    
    // Example 1: Basic symptom analysis
    console.log("1. Basic Symptom Analysis:");
    const basicPrompt = dps.generateMedicalAssessment("fever, cough, fatigue");
    console.log(basicPrompt);
    console.log("\n" + "=".repeat(50) + "\n");
    
    // Example 2: Age-specific analysis
    console.log("2. Pediatric Patient Analysis:");
    dps.updateContext({ patientAge: "12", medicalHistory: "asthma" });
    const pediatricPrompt = dps.generateMedicalAssessment("wheezing, chest tightness");
    console.log(pediatricPrompt);
    console.log("\n" + "=".repeat(50) + "\n");
    
    // Example 3: Emergency situation
    console.log("3. Emergency Assessment:");
    dps.updateContext({ patientAge: "45", medicalHistory: "diabetes, hypertension" });
    const emergencyPrompt = dps.generateMedicalAssessment("chest pain, shortness of breath, sweating");
    console.log(emergencyPrompt);
    console.log("\n" + "=".repeat(50) + "\n");
    
    // Example 4: Treatment recommendation
    console.log("4. Treatment Recommendation:");
    const treatmentPrompt = dps.generateTreatmentRecommendation("Type 2 Diabetes", { patientAge: "45" });
    console.log(treatmentPrompt);
    
    return dps;
}

// Export for use in main project
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicPromptingSystem;
} else {
    // Browser environment
    window.DynamicPromptingSystem = DynamicPromptingSystem;
    window.demonstrateDynamicPrompting = demonstrateDynamicPrompting;
} 