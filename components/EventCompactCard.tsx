import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    justification: string;
}

const EventCompactCard = ({ event }: { event: CalendarEvent }) => {
    const router = useRouter()

    const onPress = () => { router.push(`/events/${event.id}`) }

    return (
        <Pressable style={styles.card} onPress={onPress}>
            <Text style={styles.title}>{event.title}</Text>

            <View style={styles.metaRow}>
                <Text style={styles.dateTime}>{event.date} · {event.time}</Text>
                <Text style={styles.location} numberOfLines={1}>{event.location}</Text>
            </View>

            <View style={styles.justificationBox}>
                <Text style={styles.justificationText}>{event.justification}</Text>
            </View>
        </Pressable>

    )
}


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

export default EventCompactCard