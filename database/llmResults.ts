import { LLMRole } from '@/types/LLMRole';
import * as Crypto from 'expo-crypto';
import { db } from './db';

export const createLLMResult = (
  userId: string,
  type: LLMRole,
  inputText: string,
  outputText: string,
  eventId?: string | null
) => {
  return db.runAsync(
    `INSERT INTO llm_results (
      id,
      eventId,
      userId,
      type,
      inputText,
      outputText,
      createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      Crypto.randomUUID(),
      eventId ?? null,
      userId,
      type,
      inputText,
      outputText,
      new Date().toISOString(),
    ]
  );
};

export const getLLMResultByQuestion = (
  userId: string,
  inputText: string,
  eventId?: string | null
) => {
  const query = eventId
    ? `SELECT * FROM llm_results WHERE userId = ? AND inputText = ? AND eventId = ? ORDER BY createdAt DESC LIMIT 1`
    : `SELECT * FROM llm_results WHERE userId = ? AND inputText = ? AND eventId IS NULL ORDER BY createdAt DESC LIMIT 1`;

  const params = eventId ? [userId, inputText, eventId] : [userId, inputText];

  return db.getFirstAsync(query, params);
};
