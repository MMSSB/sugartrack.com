class GeminiProvider {
    constructor(apiKey, model = 'gemini-1.5-flash') {
        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    }

    async generateResponse(prompt) {
        if (!this.apiKey || this.apiKey === 'your-gemini-api-key-here') {
            throw new Error('Gemini API key not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini API error:', error);
            throw error;
        }
    }
}