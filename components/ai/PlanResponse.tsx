import { AIResponsePlan } from '@/types/AIResponses';
import { CalendarEvent } from '@/types/EventCalendar';
import { Schedule } from '@/types/Schedule';
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

const isValidSchedule = (schedule: any): schedule is Schedule => {
  return (
    typeof schedule === 'object' &&
    schedule !== null &&
    typeof schedule.day === 'string' &&
    Array.isArray(schedule.events) &&
    schedule.events.every(isValidEvent)
  );
};

const isValidResponsePlan = (data: any): data is AIResponsePlan => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.opening === 'string' &&
    typeof data.closing === 'string' &&
    Array.isArray(data.content) &&
    data.content.every(isValidSchedule)
  );
};

const WeeklySchedule = ({ data }: { data: string }) => {
  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(data);

      if (parsed && typeof parsed === 'object' && 'error' in parsed) {
        return {
          type: 'error' as const,
          data: parsed.error,
        };
      }

      if (isValidResponsePlan(parsed)) {
        return {
          type: 'plan' as const,
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
        data: 'Failed to parse response',
      };
    }
  }, [data]);

  if (result.type === 'error') {
    return (
      <View style={styles.container}>
        <Text>{result.data}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{result.data.opening}</Text>

      {result.data.content
        .filter(day => day.events.length > 0)
        .map((day) => (
          <View key={day.day} style={styles.daySection}>
            <Text style={styles.dayLabel}>
              {day.day.toUpperCase()}
            </Text>

            {day.events.map((event) => (
              <EventCompactCard
                key={event.id}
                event={event}
              />
            ))}
          </View>
        ))}

      <Text>{result.data.closing}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    alignSelf: 'stretch',
  },
  daySection: {
    marginBottom: 15,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666',
    marginBottom: 8,
    letterSpacing: 1,
  },
  message: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 10,
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

export default WeeklySchedule;