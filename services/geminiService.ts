import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("API_KEY environment variable not set. Using a placeholder which may fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });
const model = 'gemini-2.5-flash';

const iconCache: Record<string, string> = {};

export const generateTaskIcon = async (taskText: string): Promise<string> => {
    const defaultIcon = "✏️";
    if (!apiKey) return defaultIcon;
    
    const prompt = `為以下學習任務建議一個最相關的表情符號，只回傳表情符號本身，不要有任何其他文字： "${taskText}"`;

    if (iconCache[prompt]) {
        return iconCache[prompt];
    }

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                // Low temperature for more deterministic icon selection
                temperature: 0.2,
            }
        });

        const emoji = response.text.trim();
        
        // Basic validation if the response is likely an emoji
        if (emoji && /\p{Emoji}/u.test(emoji)) {
            iconCache[prompt] = emoji;
            return emoji;
        }
        return defaultIcon;
    } catch (error) {
        console.error("Gemini API call for icon failed:", error);
        return defaultIcon;
    }
};
