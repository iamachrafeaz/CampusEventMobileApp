import { LLMRole } from "@/types/LLMRole";

export interface LLMResult {
  id: string;
  eventId?: string | null;
  userId: string;
  type: LLMRole;
  inputText: string;
  outputText: string;
  createdAt: string;
}