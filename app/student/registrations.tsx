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
// Added Alert here
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

const RegistrationsScreen = () => {
  const user = useAuthStore(s => s.user);

  const {
    registrations,
    loading,
    fetchRegistrations,
    setRegistrations
  } = useRegistrationStore()

  const { unregister } = useRegister();

  const performCancellation = async (registration: Registration) => {
    const previousRegistrations = [...registrations];

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
     
      Toast.show({
        type: "success",
        text1: "Inscription annulée avec succès"
      })
    } catch (error) {
      setRegistrations(previousRegistrations);
      
      Toast.show({
        type: "error",
        text1: "Erreur lors de l'annulation"
      })
    }
  };

  const cancelRegistration = (registration: Registration) => {
    Alert.alert(
      "Confirmer l'annulation",
      "Voulez-vous vraiment annuler votre inscription ? Une fois annulée, vous ne pourrez plus vous réinscrire à cet événement.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Confirmer l'annulation", 
          onPress: () => performCancellation(registration),
          style: "destructive" 
        }
      ]
    );
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
            <RegistrationCard 
              registration={item} 
              onCancel={() => cancelRegistration(item)} 
            />
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