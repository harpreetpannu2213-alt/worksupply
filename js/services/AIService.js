import { Config } from '../config.js';
import { Store } from './Store.js';

export const AIService = {
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',

    getApiKey() {
        return localStorage.getItem('worksupply_gemini_key') || Config.AI_API_KEY || '';
    },

    async chatWithGemini(userMessage, chatHistory = []) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            return "API_KEY_MISSING";
        }

        const currentUser = Store.getCurrentUser() || { firstName: 'Guest', lastName: '', role: 'Guest' };
        const cleanUsers = Store.getUsers().map(u => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            role: u.role,
            status: u.status,
            project: u.project,
            phone: u.phone,
            location: u.location
        }));

        const cleanTimesheets = Store.getTimesheets().map(t => ({
            id: t.id,
            userId: t.userId,
            userName: t.userName,
            project: t.project,
            hours: t.hours,
            total: t.total,
            status: t.status,
            submittedAt: t.submittedAt
        }));

        const contextPrompt = `
You are the official WorkSupply Assistant, an intelligent AI helper built into the WorkSupply Time Tracking Single-Page App.

Here is the current simulated database context:
- Current Logged-in User: ${JSON.stringify(currentUser)}
- Registered Team Members: ${JSON.stringify(cleanUsers)}
- Available Projects: ${JSON.stringify(Store.getProjects())}
- Submitted Timesheets: ${JSON.stringify(cleanTimesheets)}

Rules:
1. Answer the user's questions about timesheets, users, employees, projects, and active totals using ONLY this database context.
2. If the user is an 'employee', they should NOT see other users' timesheet details (hours logged) to preserve privacy, though they can see the directory list (names, emails, projects) if asked.
3. If the user is an 'admin', they have full access to view all timesheets and approve them.
4. If the user wants to log hours, submit timesheets, edit their profile, reset their password, delete users, or create projects, inform them they can do so using the pages in the sidebar navigation (e.g. 'Submit Hours' or 'Manage Projects'). Don't pretend to edit the database yourself, as you are read-only.
5. Be concise, professional, helpful, and format your responses in beautiful Markdown.
`;

        const bodyContents = [];
        
        // Add history (limiting to last 10 turns to save tokens)
        chatHistory.slice(-10).forEach(h => {
            bodyContents.push({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
            });
        });

        // Add current user message
        bodyContents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        try {
            const response = await fetch(`${this.API_URL}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: bodyContents,
                    systemInstruction: {
                        parts: [{ text: contextPrompt }]
                    }
                })
            });

            if (!response.ok) {
                if (response.status === 400 || response.status === 403) {
                    return "API_KEY_INVALID";
                }
                throw new Error(`API Request failed with status ${response.status}`);
            }

            const responseData = await response.json();
            if (responseData.candidates && responseData.candidates[0]?.content?.parts[0]?.text) {
                return responseData.candidates[0].content.parts[0].text;
            }
            return "I received an empty response from the assistant. Please try again.";
        } catch (error) {
            console.error("AI Chat Error:", error);
            return "Sorry, I encountered an error communicating with the Gemini API. Please check your network connection and try again.";
        }
    },

    async parseTimesheetEntry(text, projects) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
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
            const response = await fetch(`${this.API_URL}?key=${apiKey}`, {
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
