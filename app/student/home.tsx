import EventCard from '@/components/EventCard'
import RadioButton from '@/components/ui/RadioButton'
import SearchInput from '@/components/ui/SearchInput'
import { EventCategories, EventCategory } from '@/constants/eventCategory'
import { colors } from '@/constants/theme'
import { typography } from '@/constants/typography'
import { useFavoriteEvent } from '@/hooks/useFavoriteEvent'
import { useAuthStore } from '@/store/useAuthStore'
import { useEventStore } from '@/store/useEventStore'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ORDER_OPTIONS = { ASC: "Ascendant", DESC: "Descendant" } as const;

type Order = keyof typeof ORDER_OPTIONS


const StudentHomeScreen = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<"All" | EventCategory>("All")
  const [selectedPeriod, setSelectedPeriod] = useState<"Tout" | "À venir" | "Passés">("Tout")
  const [selectedOrder, setSelectedOrder] = useState<Order>("DESC")
  const [filtersVisible, setFiltersVisible] = useState(false)

  const { events, fetchEvents, loading: eventsLoading, setEvents } = useEventStore();

  const user = useAuthStore(s => s.user);

  const router = useRouter();

  const {
    favorite,
    loading: favoriteLoading,
    error: favoriteError,
  } = useFavoriteEvent();

  useEffect(() => {
    fetchEvents(user!)
  }, []);

  const filteredEvents = useMemo(() => {
    let result = [...events];
    const now = Date.now()

    if (selectedPeriod !== "Tout") {
      result = result.filter(e => {
        const eventTime = new Date(e.startDateTime).getTime()

        if (selectedPeriod === "À venir") {
          return eventTime >= now
        }

        if (selectedPeriod === "Passés") {
          return eventTime < now
        }

        return true
      })
    }

    if (selectedFilters !== "All") {
      result = result.filter(e => e.category === selectedFilters);
    }

    if (selectedOrder === "DESC") {
      result = result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    if (selectedOrder === "ASC") {
      result = result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );
    }

    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword) {
      result = result.filter(e =>
        e.title.toLowerCase().includes(keyword) ||
        e.description.toLowerCase().includes(keyword)
      );
    }

    return result;
  }, [events, selectedFilters, searchKeyword, selectedPeriod, selectedOrder]);

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

  const activeFilterCount = (selectedFilters !== "All" ? 1 : 0) + (selectedPeriod !== "Tout" ? 1 : 0)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Événements</Text>
          <Pressable
            style={styles.filterToggle}
            onPress={() => setFiltersVisible(v => !v)}
          >
            <Text style={styles.filterToggleText}>
              {filtersVisible ? "Masquer" : "Filtres"}
            </Text>
            {activeFilterCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <SearchInput value={searchKeyword} onChangeText={setSearchKeyword} />

      {filtersVisible && (
        <View style={{ gap: 14 }}>
          <View style={{ gap: 5 }}>
            <Text style={styles.label}>Catégories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
            >
              {["All", ...EventCategories].map((c, index) => (
                <RadioButton
                  key={index}
                  title={c}
                  onPress={() => setSelectedFilters(c)}
                  isSelected={selectedFilters === c}
                />
              ))}
            </ScrollView>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={styles.label}>Période</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
            >
              {["Tout", "À venir", "Passés"].map((c, index) => (
                <RadioButton
                  key={index}
                  title={c}
                  onPress={() => setSelectedPeriod(c)}
                  isSelected={selectedPeriod === c}
                />
              ))}
            </ScrollView>
          </View>

          <View style={{ gap: 5 }}>
            <Text style={styles.label}>Ordre</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
            >
              {Object.entries(ORDER_OPTIONS).map(([value, label]) => (
                <RadioButton
                  key={value}
                  title={label}
                  onPress={() => setSelectedOrder(value as Order)}
                  isSelected={selectedOrder === value}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      )}
      
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          eventsLoading ? (
            <ActivityIndicator size="large" color={colors.primary.dark} style={{ marginTop: 20 }} />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Aucun événement trouvé
            </Text>
          )
        }
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
      />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: colors.ui.border,
  },
  filterToggleText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  badge: {
    backgroundColor: colors.primary.dark,
    borderRadius: 999,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 11,
    color: "white",
    fontWeight: "500",
  },
  container: {
    flex: 1,
    gap: 20,
    paddingBottom: 55,
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

export default StudentHomeScreen