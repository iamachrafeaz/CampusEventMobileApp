import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EventCompactCard from '../EventCompactCard';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  justification: string;
}

interface AIError {
  error: string;
}

const RecommendResponse = ({ agentResponse }: { agentResponse: string }) => {
  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(agentResponse);

      if (parsed && typeof parsed === 'object' && 'error' in parsed) {
        return { type: 'error', data: parsed.error };
      }

      if (Array.isArray(parsed)) {
        return { type: 'events', data: parsed as CalendarEvent[] };
      }

      return { type: 'error', data: 'Unexpected response format' };
    } catch (e) {
      return { type: 'error', data: 'Failed to parse agent response' };
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
      {result.data.map((e: CalendarEvent, index : number) => <EventCompactCard key={index} event={e} />)}
    </View>)
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    width: '100%',
    alignItems: 'flex-start',
    gap: 12,
    marginVertical: 8,
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
  // --- Custom Error Styles ---
  errorCard: {
    borderColor: '#FCA5A5', // Soft red border
    backgroundColor: '#FEF2F2', // Very light red background
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  errorIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B', // Dark red
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 14,
    color: '#B91C1C',
    lineHeight: 20,
  },
  // --- Standard Card Styles ---
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  metaRow: {
    marginBottom: 12,
  },
  dateTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: '#6B7280',
  },
  justificationBox: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  justificationText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonPressed: {
    opacity: 0.7,
    backgroundColor: '#E5E7EB',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
});

export default RecommendResponse;