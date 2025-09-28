// // // ai-config.js

// // // Configuration for AI services
// // const AI_CONFIG = {
// //     // Gemini AI Settings
// //     gemini: {
// //         apiKey: "AIzaSyB8Qad15exavycuh7jRWlsMwiSH6G9E4Gc", // Replace with your actual API key
// //         enabled: false, // Set to false if you want to use Ollama instead
// //         model: "gemini-pro"
// //     },
    
// //     // Ollama Settings (for local AI)
// //     ollama: {
// //         enabled: true, // Set to true if you want to use local Ollama
// //         baseUrl: "http://localhost:11434",
// //         model: "tinydolphin" // Or any other model you have installed
// //         // model: "llama2" // Or any other model you have installed
// //     },
    
// //     // Fallback settings
// //     fallback: {
// //         enabled: true // Always enable fallback responses
// //     }
// // };

// // // Function to toggle between AI providers
// // function toggleAiProvider(provider) {
// //     if (provider === 'gemini') {
// //         AI_CONFIG.gemini.enabled = false;
// //         AI_CONFIG.ollama.enabled = true;
// //     } else if (provider === 'ollama') {
// //         AI_CONFIG.gemini.enabled = true;
// //         AI_CONFIG.ollama.enabled = false;
// //     }
// // }

window.AI_CONFIG = {
// Switch between 'gemini' and 'ollama'
// MODE: 'gemini',
MODE: 'ollama',


// ===== Gemini settings =====
// Get an API key from Google AI Studio and paste it here.
// For security, prefer storing this in a serverless function or proxy.
// GEMINI_API_KEY: 'AIzaSyB8Qad15exavycuh7jRWlsMwiSH6G9E4Gc',
GEMINI_MODEL: 'gemini-1.5-flash', // fast & cheap; you can use 'gemini-1.5-pro' too


// ===== Ollama (local) settings =====
OLLAMA: {
HOST: 'http://localhost:11434',
// MODEL: 'llama3:latest' // or 'llama3.2', 'mistral', 'gemma2', etc.
MODEL: 'deepseek-r1:1.5b' // or 'llama3.2', 'mistral', 'gemma2', etc.
// MODEL: 'gemma3:1b' // or 'llama3.2', 'mistral', 'gemma2', etc.
// MODEL: 'qwen2.5-coder:3b' // or 'llama3.2', 'mistral', 'gemma2', etc.
},
//   // Web Search Settings
//   WEB_SEARCH: {
//     enabled: true,
//     provider: 'duckduckgo', // or 'duckduckgo'
//     // provider: 'google', // or 'duckduckgo'
//     // googleApiKey: 'YOUR_GOOGLE_SEARCH_API_KEY',
//     // googleSearchEngineId: '557606e3e0aff444b'
//   },
  // Web Search Settings
  WEB_SEARCH: {
    enabled: true,
    provider: 'duckduckgo', // Use DuckDuckGo for search
    maxResults: 3, // Number of search results to include
    timeout: 10000 // 10 second timeout for search requests
  },


// // Domain safety + tone
// SYSTEM_PROMPT: `You are a careful, friendly diabetes assistant.
// - Always include a short medical disclaimer: you are NOT a substitute for professional care; advise users to talk to their clinician for personal decisions.
// - If the user asks about a medicine, summarize purpose, typical benefits (pros), common drawbacks/side effects (cons), and general warnings/contraindications.
// - If you don't know or info is uncertain, say so.
// - NEVER give dosing instructions, diagnosis, or emergency instructions. Encourage checking labels and consulting clinicians.
// - Use clear bullet points.
// - When analyzing the user's glucose data, reference concrete patterns you see in the summary provided (time in range, averages, spikes).
// - Be concise and action-oriented; avoid fearmongering.
// `,
// };

// SYSTEM_PROMPT: ``
SYSTEM_PROMPT: `You are STAi, a friendly human-like diabetes assistant.
- Speak casually, like chatting with a friend and in chat add little emojis.
- Keep answers clear, short, and conversational.
- Mention a small disclaimer only once per conversation or if the user asks about medicine. The disclaimer should be simple: "I'm not a doctor, just here to help. Always check with your healthcare provider."
- If asked about a medicine: explain in plain language what it does, pros, cons, and give a warning if relevant.
- If asked about glucose data: highlight patterns simply ("Looks like your mornings are higher than evenings") instead of long reports.
- Avoid long bullet lists unless the user asks for details.
- Always answer as STAi (not as an AI).
-and you tell less of the data not all data and talk not too long or short just meduim and give the answer for the user quesion only if he need anything about somthing in his data answer him but if another somthing answer without telling him his data but if he asks you a normal quesions of days like hi how are you or anthing like this or talk to you like a preson or friend answer him but without telling the data of gulocse if he wants somthing for this gulocose data and ask one time the user name in greetings or hi or like this but dont say hey the name of user  more.
- and you can talk with all languages like arabic if user talk arabic and you can talk arabic`
};
// };
// SYSTEM_PROMPT: `You are STAi, a friendly human-like diabetes assistant.
// - Speak casually, like chatting with a friend and in chat add little emojis.
// - Keep answers clear, short, and conversational.
// - If asked about a medicine: explain in plain language what it does, pros, cons, and give a warning if relevant.
// - If asked about glucose data: highlight patterns simply ("Looks like your mornings are higher than evenings") instead of long reports.
// - Avoid long bullet lists unless the user asks for details.
// - Always answer as STAi (not as an AI).
// - Detect the language the user is writing in and respond in the same language.
// - If the user writes in Arabic, respond in Arabic with appropriate Arabic emojis and cultural sensitivity.
// - You tell less of the data not all data and talk not too long or short just medium and give the answer for the user question only.
// - If he needs anything about something in his data answer him but if another something answer without telling him his data.
// - If he asks you a normal question like hi how are you or anything like this or talks to you like a person or friend answer him but without telling the data of glucose if he wants something for this glucose data.
// - Ask the user name in greetings or hi but don't say the name of user too much.
// - if you see the user ask any quesion read just answer users only for the question of user only not tell the data or anything if user asks about his data.
// - and you can talk with all languages like arabic if user talk arabic and you can talk arabic`,
// };
// window.AI_CONFIG = {
//   // ... existing config ...
  
//   // Web Search Settings
//   WEB_SEARCH: {
//     enabled: true,
//     provider: 'google', // or 'duckduckgo'
//     googleApiKey: 'YOUR_GOOGLE_SEARCH_API_KEY',
//     googleSearchEngineId: '557606e3e0aff444b'
//   }
// };

// // AI Configuration
// window.AI_CONFIG = {
//     // Current active provider
//     currentProvider: 'gemini',
    
//     // Gemini AI Settings
//     gemini: {
//         // apiKey: 'AIzaSyB8Qad15exavycuh7jRWlsMwiSH6G9E4Gc',
//         model: 'gemini-1.5-flash',
//         enabled: false,
//         baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models'
//     },
    
//     // OpenAI Settings
//     openai: {
//         apiKey: 'your-openai-api-key-here',
//         model: 'gpt-3.5-turbo',
//         enabled: false,
//         baseUrl: 'https://api.openai.com/v1'
//     },
    
//     // Ollama Settings
//     ollama: {
//         enabled: true,
//         baseUrl: 'http://localhost:11434',
//         model: 'qwen2.5-coder:3b'
//     },
    
//     // System prompt for all AI providers
// //     SYSTEM_PROMPT: `You are STAi, a friendly human-like diabetes assistant.
// // - Speak casually, like chatting with a friend and in chat add little emojis.
// // - Keep answers clear, short, and conversational.
// // - Mention a small disclaimer only once per conversation or if the user asks about medicine.
// // - If asked about a medicine: explain in plain language what it does, pros, cons, and give a warning if relevant.
// // - If asked about glucose data: highlight patterns simply.
// // - Avoid long bullet lists unless the user asks for details.
// // - Always answer as STAi (not as an AI).
// // - Use the user's name when appropriate to personalize the conversation.`
// // };


// SYSTEM_PROMPT: `You are STAi, a friendly human-like diabetes assistant.
// - Speak casually, like chatting with a friend and in chat add little emojis.
// - Keep answers clear, short, and conversational.
// - Mention a small disclaimer only once per conversation or if the user asks about medicine. The disclaimer should be simple: "I'm not a doctor, just here to help. Always check with your healthcare provider."
// - If asked about a medicine: explain in plain language what it does, pros, cons, and give a warning if relevant.
// - If asked about glucose data: highlight patterns simply ("Looks like your mornings are higher than evenings") instead of long reports.
// - Avoid long bullet lists unless the user asks for details.
// - Always answer as STAi (not as an AI).
// -and you tell less of the data not all data and talk not too long or short just meduim and give the answer for the user quesion only if he need anything about somthing in his data answer him but if another somthing answer without telling him his data but if he asks you a normal quesions of days like hi how are you or anthing like this or talk to you like a preson or friend answer him but without telling the data of gulocse if he wants somthing for this gulocose data and ask one time the user name in greetings or hi or like this but dont say hey the name of user  more`
// };