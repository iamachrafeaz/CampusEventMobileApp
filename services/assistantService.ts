import { LLMRole } from "@/constants/types";
import { getActiveEvents, getFavoriteEvents } from "@/database/events";
import { getMyRegistrations } from "@/database/registrations";
import { Event } from "@/models/event";
import { useAuthStore } from "@/store/useAuthStore";
import Groq from "groq-sdk";
import { planPrompt } from "./prompts/plan.prompt";
import { qaPrompt } from "./prompts/qa.prompt";
import { recommendPrompt } from "./prompts/recommend.prompt";
import { searchPrompt } from "./prompts/search.prompt";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


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

const buildQAPrompt = async (question : string): Promise<string> => {
    const events = await getUpcomingEvent()
    return qaPrompt(question,events)
}

const buildSearchPrompt = async (): Promise<string> => {
    const events = await getUpcomingEvent()
    return searchPrompt(events)
}

const buildPlanPrompt = async (question : string): Promise<string> => {
    const events = await getUpcomingEvent()
    return planPrompt(question,events)
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

export const askAI = async (question: string, role: LLMRole): Promise<string> => {
    const { system, user } = await buildPrompt(question, role);

    try {
        const answer = await callLlm(system, user);

        return answer;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`askAI failed [role=${role}]: ${message}`);
    }
}