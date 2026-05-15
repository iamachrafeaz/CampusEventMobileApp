export type LLMResultType = 'search' | 'recommendation' | 'planning' | 'qa'
export interface LLMResult {
  id: string;
  eventId?: string | null;
  userId: string;
  type: LLMResultType;
  inputText: string;
  outputText: string;
  createdAt: string;
}