import EventCard from '@/components/EventCard'
import { colors } from '@/constants/theme'
import { typography } from '@/constants/typography'
import { useFavoriteEvent } from '@/hooks/useFavoriteEvent'
import { Event } from '@/models/event'
import { useEventStore } from '@/store/useEventStore'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const FavoriteScreen = () => {
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([])
  
  const router = useRouter()

  const { events, loading: eventsLoading, setEvents } = useEventStore();

  const {
    favorite,
  } = useFavoriteEvent();

  useEffect(() => {
    setFavoriteEvents(events.filter(e => e.isFavorited))
  }, [events]);

  const toggleFavorite = async (eventId: string) => {
    setEvents(
      events.map(e =>
        e.id === eventId
          ? { ...e, isFavorited: !e.isFavorited }
          : e
      )
    )

    try {
      await favorite(eventId)
    } catch (e) {
      setEvents(
        events.map(e =>
          e.id === eventId
            ? { ...e, isFavorited: !e.isFavorited }
            : e
        )
      )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Favoris</Text>
      </View>

      <FlatList
        data={favoriteEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/events/${item.id}`)}>
            <EventCard
              event={item}
              onFavorite={() => {
                toggleFavorite(item.id)
              }
              }
            />
          </Pressable>
        )}
        ListEmptyComponent={
          eventsLoading ? (
            <ActivityIndicator size="large" color={colors.primary.dark} style={{ marginTop: 20 }} />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Aucun événement trouvé
            </Text>
          )
        } />
    </SafeAreaView>
  )
}

export default FavoriteScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    backgroundColor: "white",
    paddingHorizontal: 24,
  },
  headerSection: { 
    marginTop: 24,
  },
  title: {
    fontSize: typography.display,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  label: {
    fontWeight: "bold",
    color: colors.text.secondary,
    fontSize: typography.body
  },
  listContent: {
    gap: 10
  },
});