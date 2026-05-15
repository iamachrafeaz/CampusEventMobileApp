import { colors } from '@/constants/theme';
import { typography } from '@/constants/typography';
import { Event } from '@/models/event';
import { Star } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Pill from './ui/Pill';


const EventCard = ({ event, onFavorite }: { event: Event, onFavorite : () => void }) => {
    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{event.title}</Text>
                <Pressable style={{padding : 3}} onPress={onFavorite}>
                    <Star size={18} fill={event.isFavorited ? colors.primary.main : "transparent"} color={colors.primary.main} />
                </Pressable>
            </View>

            {/* Tag */}
            <View style={styles.tags}>
                <Pill label={event.category} />
            </View>

            {/* Info */}
            <Text style={styles.info}>
                {formatEventInfo(event.startDateTime, event.locationName)}
            </Text>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.attendees}>{event.registeredCount}/{event.capacity} inscrits</Text>
            </View>
        </View>
    );
};

export default EventCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.ui.backgroundAlt,
        borderWidth: 1,
        borderColor: colors.ui.borderDark,
        borderRadius: 16,
        padding: 14,
        gap: 10,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        fontSize: typography.body,
        fontWeight: '700',
        color: colors.text.primary,
        flex: 1,
        paddingRight: 10,
    },

    tags: {
        flexDirection: 'row',
    },

    info: {
        fontSize: typography.hint,
        color: colors.text.secondary,
    },

    footer: {
        marginTop: 4,
        gap: 6,
    },

    attendees: {
        fontSize: typography.hint,
        color: colors.text.secondary,
    },
});

function formatEventInfo(
    startDateTime: string,
    locationName: string
) {
    const date = new Date(startDateTime);

    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);

    return `${formattedDate} · ${formattedTime} · ${locationName}`;
}