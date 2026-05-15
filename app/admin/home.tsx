import EventItem from '@/components/EventItem';
import LoadingModal from '@/components/LoadingModal';
import Button from '@/components/ui/Button';
import { colors } from '@/constants/theme';
import { typography } from '@/constants/typography';
import { eventService } from '@/services/eventService';
import { useAuthStore } from '@/store/useAuthStore';
import { useEventStore } from '@/store/useEventStore';
import { useFocusEffect, useRouter } from 'expo-router';
import { Calendar, LogOut, Plus, Share2 } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function EventList() {

  const router = useRouter();
  const { logout } = useAuthStore()

  const { events, fetchEvents, loading } = useEventStore()

  const [isExporting, setIsExporting] = useState(false);

  const handleEdit = (id: string) => {
    router.push({
      pathname: "/admin/eventFormScreen",
      params: {
        id: id
      }
    })
  }

  const handleDelete = async (id: string) => {
    await eventService.delete(id)
    fetchEvents(null);

    Toast.show({
      text1: "Évenement supprimé avec succéss"
    })
  }

  const handleLogout = () => {
    logout()
    router.replace("/")
  }

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await eventService.exportEvents();

      Toast.show({
        text1: "Export réussi"
      });
    } catch (e) {
      Toast.show({
        text1: "Erreur lors de l'export"
      });
    } finally {
      setIsExporting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents(null);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <LoadingModal text={'Exportation en cours...'} isVisible={isExporting} />
     
      <LoadingModal text={'Chargement en cours...'} isVisible={loading} />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Événements</Text>
          <Text style={styles.subTitle}>Gérez vos activités académiques</Text>
        </View>
        <Button onPress={handleLogout}
          icon={
            <LogOut color={"white"} size={18} />
          }
          variant='destructive' size='sm' />
      </View>

      <View style={styles.actionSection}>
        <View style={{ flex: 1 }}>
          <Button
            onPress={() => { router.push("/admin/eventFormScreen") }}
            icon={<Plus size={18} color={"white"} />}
            title={'Créer un événement'}
          />
        </View>
        <Button
          variant='secondary'
          icon={<Share2 color="black" size={18} />}
          onPress={handleExport} />
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/events/${item.id}`)}>
            <EventItem
              event={item}
              onEdit={() => handleEdit(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Calendar />
            </View>
            <Text style={styles.emptyTitle}>Aucun événement trouvé</Text>
            <Text style={styles.emptySubtitle}>
              Il semblerait que votre calendrier soit vide. Appuyez sur le bouton pour ajouter un nouvel événement !
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    marginTop: 24,
    marginBottom: 20,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    fontSize: typography.display,
    fontWeight: "bold",
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: typography.body,
    fontWeight: "500",
    color: colors.text.secondary,
    marginTop: 4,
  },
  actionSection: {
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 50,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  emptyButton: {
    marginTop: 24,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});