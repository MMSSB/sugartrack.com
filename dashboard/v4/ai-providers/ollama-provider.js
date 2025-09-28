class OllamaProvider {
    constructor(baseUrl = 'http://localhost:11434', model = 'qwen2.5-coder:3b') {
        this.baseUrl = baseUrl;
        this.model = model;
    }

    async generateResponse(prompt) {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                    stream: false
                })
            });
            
            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.message.content;
        } catch (error) {
            console.error('Ollama API error:', error);
            throw error;
        }
    }
}