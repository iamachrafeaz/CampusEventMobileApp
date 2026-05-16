import { AIResponseRecommend } from '@/types/AIResponses';
import { CalendarEvent } from '@/types/EventCalendar';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EventCompactCard from '../EventCompactCard';

const isValidEvent = (event: any): event is CalendarEvent => {
  return (
    typeof event === 'object' &&
    event !== null &&
    typeof event.id === 'string' &&
    typeof event.title === 'string' &&
    typeof event.date === 'string' &&
    typeof event.time === 'string' &&
    typeof event.location === 'string' &&
    typeof event.justification === 'string'
  );
};

const isValidResponse = (data: any): data is AIResponseRecommend => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.opening === 'string' &&
    typeof data.closing === 'string' &&
    Array.isArray(data.content) &&
    data.content.every(isValidEvent)
  );
};

const RecommendResponse = ({
  agentResponse,
}: {
  agentResponse: string;
}) => {
  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(agentResponse);

      if (
        parsed &&
        typeof parsed === 'object' &&
        'error' in parsed
      ) {
        return {
          type: 'error' as const,
          data: parsed.error,
        };
      }

      if (isValidResponse(parsed)) {
        return {
          type: 'events' as const,
          data: parsed,
        };
      }

      return {
        type: 'error' as const,
        data: 'Unexpected response format',
      };
    } catch (e) {
      return {
        type: 'error' as const,
        data: 'Failed to parse agent response',
      };
    }
  }, [agentResponse]);

  if (result.type === 'error') {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <Text style={styles.errorText}>{result.data}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        {result.data.opening}
      </Text>

      {result.data.content.map((event, index) => (
        <EventCompactCard
          key={index}
          event={event}
        />
      ))}

      <Text style={styles.message}>
        {result.data.closing}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    width: '100%',
    alignItems: 'flex-start',
    gap: 12,
    marginVertical: 8,
  },

  message: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  errorCard: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },

  errorText: {
    fontSize: 14,
    color: '#B91C1C',
    lineHeight: 20,
  },
});

export default RecommendResponse;