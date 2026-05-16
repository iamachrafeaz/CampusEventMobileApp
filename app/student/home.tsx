import EventCard from '@/components/EventCard'
import RadioButton from '@/components/ui/RadioButton'
import SearchInput from '@/components/ui/SearchInput'
import { CATEGORY_OPTIONS, ORDER_OPTIONS, PERIOD_OPTIONS } from '@/constants/eventFilterOptions'
import { colors } from '@/constants/theme'
import { typography } from '@/constants/typography'
import { useFavoriteEvent } from '@/hooks/useFavoriteEvent'
import { useAuthStore } from '@/store/useAuthStore'
import { useEventStore } from '@/store/useEventStore'
import { SelectedCategory, SelectedOrder, SelectedPeriod } from '@/types/EventFilters'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

const StudentHomeScreen = () => {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>("ALL")
  const [selectedPeriod, setSelectedPeriod] = useState<SelectedPeriod>("ALL")
  const [selectedOrder, setSelectedOrder] = useState<SelectedOrder>("DESC")

  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['50%', '65%'], [])

  const { events, fetchEvents, loading: eventsLoading, setEvents } = useEventStore()
  const user = useAuthStore(s => s.user)
  const router = useRouter()
  const { favorite } = useFavoriteEvent()

  const openFilters = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  const filteredEvents = useMemo(() => {
    let result = [...events]
    const now = Date.now()

    if (selectedPeriod !== "ALL") {
      result = result.filter(e => {
        const eventTime = new Date(e.startDateTime).getTime()
        if (selectedPeriod === "UPCOMING") return eventTime >= now
        if (selectedPeriod === "PASSED") return eventTime < now
        return true
      })
    }

    if (selectedCategory !== "ALL") {
      result = result.filter(e => e.category === selectedCategory)
    }

    if (selectedOrder === "DESC") {
      result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    if (selectedOrder === "ASC") {
      result = result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }

    const keyword = searchKeyword.trim().toLowerCase()
    if (keyword) {
      result = result.filter(e =>
        e.title.toLowerCase().includes(keyword) ||
        e.description.toLowerCase().includes(keyword)
      )
    }

    return result
  }, [events, selectedCategory, searchKeyword, selectedPeriod, selectedOrder])

  const toggleFavorite = async (eventId: string) => {
    setEvents(events.map(e => e.id === eventId ? { ...e, isFavorited: !e.isFavorited } : e))
    try {
      await favorite(eventId)
    } catch {
      setEvents(events.map(e => e.id === eventId ? { ...e, isFavorited: !e.isFavorited } : e))
    }
  }

  const activeFilterCount = (selectedCategory !== "ALL" ? 1 : 0) + (selectedPeriod !== "ALL" ? 1 : 0)

  useEffect(() => {
    fetchEvents(user!)
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={{ bottom: "off", top: "additive" }}>
        <View style={styles.headerSection}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Événements</Text>
            <Pressable style={styles.filterToggle} onPress={openFilters}>
              <Text style={styles.filterToggleText}>Filtres</Text>
              {activeFilterCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{activeFilterCount}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        <SearchInput value={searchKeyword} onChangeText={setSearchKeyword} />

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            eventsLoading ? (
              <ActivityIndicator size="large" color={colors.primary.dark} style={{ marginTop: 20 }} />
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20 }}>Aucun événement trouvé</Text>
            )
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/events/${item.id}`)}>
              <EventCard event={item} onFavorite={() => toggleFavorite(item.id)} />
            </Pressable>
          )}
        />
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        containerStyle={styles.bottomSheetShadow}
      >
        <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Filtres</Text>

          <View style={styles.filterGroup}>
            <Text style={styles.label}>Catégories</Text>
            <ScrollView
              horizontal
              directionalLockEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}>
              {Object.entries(CATEGORY_OPTIONS).map(([value, label]) => (
                <RadioButton
                  key={value}
                  title={label}
                  onPress={() => setSelectedCategory(value as SelectedCategory)}
                  isSelected={selectedCategory === value}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.label}>Période</Text>
            <ScrollView horizontal directionalLockEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {Object.entries(PERIOD_OPTIONS).map(([value, label]) => (
                <RadioButton
                  key={value}
                  title={label}
                  onPress={() => setSelectedPeriod(value as SelectedPeriod)}
                  isSelected={selectedPeriod === value}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.label}>Ordre</Text>
            <ScrollView horizontal directionalLockEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {Object.entries(ORDER_OPTIONS).map(([value, label]) => (
                <RadioButton
                  key={value}
                  title={label}
                  onPress={() => setSelectedOrder(value as SelectedOrder)}
                  isSelected={selectedOrder === value}
                />
              ))}
            </ScrollView>
          </View>

          {activeFilterCount > 0 && (
            <Pressable
              style={styles.resetButton}
              onPress={() => {
                setSelectedCategory("ALL")
                setSelectedPeriod("ALL")
                setSelectedOrder("DESC")
              }}
            >
              <Text style={styles.resetButtonText}>Réinitialiser les filtres</Text>
            </Pressable>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
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
    fontSize: typography.body,
  },
  listContent: {
    gap: 10,
  },
  // Bottom sheet styles
  bottomSheetBackground: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: colors.ui.border,
    width: 40,
  },
  bottomSheetContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 20,
  },
  bottomSheetTitle: {
    fontSize: typography.display,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 4,
  },
  filterGroup: {
    gap: 8,
  },
  chipsRow: {
    gap: 10,
  },
  resetButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary.dark,
    alignItems: "center",
  },
  resetButtonText: {
    color: colors.primary.dark,
    fontWeight: "600",
    fontSize: typography.body,
  },
  bottomSheetShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
})

export default StudentHomeScreen