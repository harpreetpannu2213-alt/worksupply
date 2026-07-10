export const AIService = {
    // Browser builds should call AI providers through a backend proxy.
    API_KEY: '',
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',

    async parseTimesheetEntry(text, projects) {
        if (!this.API_KEY) {
            console.warn("AI parsing is disabled in this static website build.");
            return null;
        }

        const prompt = `
            Extract timesheet data from this text: "${text}"
            Available projects: ${projects.join(', ')}

            Return ONLY a JSON object with:
            {
                "project": "matched project name or null",
                "hours": number,
                "day": "monday|tuesday|wednesday|thursday|friday|saturday|sunday|null",
                "notes": "cleaned up note"
            }
        `;

        try {
            const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) {
                throw new Error(`API Request failed with status ${response.status}`);
            }

            const data = await response.json();
            const resultText = data.candidates[0].content.parts[0].text;

            // Extract JSON from the markdown-style response if necessary
            const jsonMatch = resultText.match(/\{.*\}/s);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return null;
        } catch (error) {
            console.error("AI Parsing Error:", error);
            return null;
        }
    }
};
