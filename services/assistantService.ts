import { getActiveEvents, getFavoriteEvents } from "@/database/events";
import { createLLMResult, getLLMResultByQuestion } from "@/database/llmResults";
import { getMyRegistrations } from "@/database/registrations";
import { Event } from "@/models/event";
import { LLMResult } from "@/models/llmResult";
import { useAuthStore } from "@/store/useAuthStore";
import { LLMRole } from "@/types/LLMRole";
import Groq from "groq-sdk";
import { basePrompt } from "./prompts/base.prompt";
import { planPrompt } from "./prompts/plan.prompt";
import { qaPrompt } from "./prompts/qa.prompt";
import { recommendPrompt } from "./prompts/recommend.prompt";
import { searchPrompt } from "./prompts/search.prompt";

const groq = new Groq({ apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY });

const getUpcomingEvent = async () => {
    return await getActiveEvents() as Event[];
}

const getUserFavoriteEvents = async () => {
    const user = useAuthStore.getState().user;

    if (!user) return [];

    return await getFavoriteEvents(user) as Event[];
};

const getUserRegisteredEvents = async () => {
    const user = useAuthStore.getState().user;

    if (!user) return [];

    return await getMyRegistrations(user) as Event[];
};

const buildQAPrompt = async (question: string): Promise<string> => {
    const events = await getUpcomingEvent()
    return qaPrompt(question, events)
}

const buildSearchPrompt = async (): Promise<string> => {
    const events = await getUpcomingEvent()
    return searchPrompt(events)
}

const buildPlanPrompt = async (question: string): Promise<string> => {
    const events = await getUpcomingEvent()
    return planPrompt(question, events)
}

const buildRecommendPrompt = async (): Promise<string> => {

    const [favoriteEvents, registeredEvents, upcomingEvents] = await Promise.all([
        getUserFavoriteEvents(),
        getUserRegisteredEvents(),
        getUpcomingEvent()
    ]);

    return recommendPrompt(favoriteEvents, registeredEvents, upcomingEvents)
}

const buildPrompt = async (
    question: string,
    role: LLMRole
): Promise<{ system: string; user: string }> => {

    switch (role) {
        case "search":
            return {
                system: await buildSearchPrompt(),
                user: question,
            };

        case "plan":
            return {
                system: await buildPlanPrompt(question),
                user: question,
            };

        case "qa":
            return {
                system: await buildQAPrompt(question),
                user: question,
            };

        case "recommend":
            return {
                system: await buildRecommendPrompt(),
                user: question,
            };
    }
}

const callLlm = async (system: string, user: string): Promise<string> => {
    const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from model");
    return content;
}

const saveChatResult = async (
    userId: string,
    role: LLMRole,
    question: string,
    answer: string,
    eventId?: string | null
) => {
    return createLLMResult(userId, role, question, answer, eventId);
};

export const askAI = async (question: string, eventId?: string | null): Promise<{ role: LLMRole, answer: string }> => {
    try {
        const currentUser = useAuthStore.getState().user;

        if (currentUser) {
            const cachedResult = await getLLMResultByQuestion(currentUser, question, eventId) as LLMResult;
            if (cachedResult) {
                return {
                    role: cachedResult.type as LLMRole,
                    answer: cachedResult.outputText,
                };
            }
        }

        const classification_string = await callLlm(basePrompt(), question);
        const classification: { type: LLMRole } = JSON.parse(classification_string)

        const { system, user } = await buildPrompt(question, classification.type);

        const answer = await callLlm(system, user);

        if (currentUser) {
            await saveChatResult(currentUser, classification.type, question, answer, eventId);
        }
      
        return { role: classification.type, answer: answer };
        
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`askAI failed : ${message}`);
    }
}