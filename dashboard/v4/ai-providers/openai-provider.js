class OpenAIProvider {
    constructor(apiKey, model = 'gpt-3.5-turbo') {
        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = 'https://api.openai.com/v1';
    }

    async generateResponse(prompt) {
        if (!this.apiKey || this.apiKey === 'your-openai-api-key-here') {
            throw new Error('OpenAI API key not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: AI_CONFIG.SYSTEM_PROMPT
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });
            
            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw error;
        }
    }
}