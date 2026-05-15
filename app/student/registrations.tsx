import RegistrationCard from '@/components/RegistrationCard'
import { colors } from '@/constants/theme'
import { typography } from '@/constants/typography'
import { useRegister } from '@/hooks/useRegister'
import { Registration } from '@/models/registration'
import { useAuthStore } from '@/store/useAuthStore'
import { invalidateEvents } from '@/store/useEventStore'
import { useRegistrationStore } from '@/store/useRegistrationStore'
import { useFocusEffect } from 'expo-router'
import React, { useCallback } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const RegistrationsScreen = () => {
  const user = useAuthStore(s => s.user);

  const {
    registrations,
    loading,
    fetchRegistrations,
    setRegistrations
  } = useRegistrationStore()

  const { unregister } = useRegister();

  const cancelRegistration = async (registration: Registration) => {
    // 1. Keep track of the original state in case of failure
    const previousRegistrations = [...registrations];

    // 2. Optimistic Update: Toggle status locally
    const updatedData = registrations.map(r =>
      r.id === registration.id
        ? { ...r, status: r.status === "confirmed" ? "cancelled" : "confirmed" }
        : r
    );
    setRegistrations(updatedData as Registration[]);

    try {
      const res = await unregister(registration.id, registration.eventId);
      if (!res) throw new Error("API Update failed");

      invalidateEvents(user!);
    } catch (error) {
      // 3. Rollback: If API fails, revert to previous data
      setRegistrations(previousRegistrations);
      // Optional: Add a Toast or Alert here to notify the user
    }
  };
 
  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      fetchRegistrations(user);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Inscriptions</Text>
      </View>

      {loading && registrations.length === 0 ? (
        <ActivityIndicator size="large" color={colors.primary.main} />
      ) : (
        <FlatList
          data={registrations}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>Aucune inscription</Text>
            </View>
          }
          renderItem={({ item }) => (
            <RegistrationCard registration={item} onCancel={() => cancelRegistration(item)} />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default RegistrationsScreen;

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
  emptyContainer: {
    alignItems: "center"
  }
});
