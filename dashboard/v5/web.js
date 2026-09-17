// web.js - Clean UI AI Search Engine
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('aiSearchInput');
    const searchBtn = document.getElementById('aiSearchBtn');
    const resultsCard = document.getElementById('resultsCard');
    const resultContent = document.getElementById('aiResultContent');
    const loadingState = document.getElementById('loadingState');
    const resourceButtons = document.getElementById('resourceButtons');
    const copyBtn = document.getElementById('copyResultBtn');

    // Make Quick Tags clickable
    document.querySelectorAll('.quick-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            searchInput.value = tag.innerText;
            performSearch();
        });
    });

    // Setup Listeners
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    copyBtn.addEventListener('click', () => {
        const text = resultContent.innerText;
        navigator.clipboard.writeText(text).then(() => {
            copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--success);"></i>';
            setTimeout(() => copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>', 2000);
        });
    });

    async function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        // UI Updates
        resultsCard.style.display = 'none';
        loadingState.style.display = 'block';
        searchBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
        searchBtn.disabled = true;

        try {
            const prompt = `
                You are a helpful, empathetic medical assistant for a diabetes management app called SugarTrack. 
                The user is asking: "${query}".
                
                Please provide a clear, concise, and accurate answer formatted in Markdown.
                - Use bullet points for readability.
                - Use bold text for key medical terms.
                - Keep the tone encouraging and highly professional.
                
                IMPORTANT: Conclude with a short italicized disclaimer that you are an AI and this is not a substitute for professional medical advice.
            `;

            const response = await puter.ai.chat(prompt);
            const message = response.message.content;

            displayResults(message, query);

        } catch (error) {
            console.error("AI Error:", error);
            displayResults("**Error:** I'm having trouble connecting to the medical database right now. Please try again or check your internet connection.", query);
        } finally {
            loadingState.style.display = 'none';
            searchBtn.innerHTML = 'Ask AI';
            searchBtn.disabled = false;
        }
    }

    function displayResults(markdownText, originalQuery) {
        if (typeof marked !== 'undefined') {
            resultContent.innerHTML = marked.parse(markdownText);
        } else {
            resultContent.innerHTML = markdownText
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');
        }

        generateExternalLinks(originalQuery);

        resultsCard.style.display = 'block';
        
        // Smooth scroll to results
        setTimeout(() => {
            resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    function generateExternalLinks(query) {
        const encodedQuery = encodeURIComponent(query + " diabetes");
        
        const sources = [
            { name: "WebMD", icon: "fa-solid fa-user-md", color: "#3b82f6", url: `https://www.webmd.com/search/search_results/default.aspx?query=${encodedQuery}` },
            { name: "Mayo Clinic", icon: "fa-regular fa-hospital", color: "var(--text-primary)", url: `https://www.mayoclinic.org/search/search-results?q=${encodedQuery}` },
            { name: "Google", icon: "fa-brands fa-google", color: "#f59e0b", url: `https://www.google.com/search?q=${encodedQuery}` },
            { name: "DuckDuckGo", icon: "fas fa-search", color: "#de5833", url: `https://duckduckgo.com/?q=${encodedQuery}` }
        ];

        resourceButtons.innerHTML = sources.map(source => `
            <a href="${source.url}" target="_blank" class="resource-btn" style="border-left: 4px solid ${source.color}">
                <i class="${source.icon}" style="color: ${source.color}; font-size: 1.1rem;"></i>
                <span>${source.name}</span>
            </a>
        `).join('');
    }
});