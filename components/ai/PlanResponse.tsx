import React from 'react';
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

interface Schedule {
  day: string,
  events: CalendarEvent[]
}

const WeeklySchedule = ({ data }: { data: string }) => {

  const events = JSON.parse(data) as Schedule[]

  const activeDays = events.filter(item => item.events.length > 0);

  return (
    <View style={styles.container}>
      {activeDays.map((dayItem) => (
        <View key={dayItem.day} style={styles.daySection}>
          <Text style={styles.dayLabel}>{dayItem.day.toUpperCase()}</Text>
          {dayItem.events.map((e: CalendarEvent) => <EventCompactCard event={e} />)}
        </View>
      ))}
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
});

export default WeeklySchedule;