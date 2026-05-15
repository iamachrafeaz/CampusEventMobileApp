import BackButton from "@/components/BackButton";
import Button from "@/components/ui/Button";
import Pill from "@/components/ui/Pill";
import { colors } from "@/constants/theme";
import { useFavoriteEvent } from "@/hooks/useFavoriteEvent";
import { useRegister } from "@/hooks/useRegister";
import { Event } from "@/models/event";
import { eventService } from "@/services/eventService";
import { useAuthStore } from "@/store/useAuthStore";
import { invalidateEvents } from "@/store/useEventStore";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import { formatDateTime } from "@/utils/timeFormater";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle, Calendar, Star } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

const EventDetails = () => {
  const router = useRouter()

  const { id } = useLocalSearchParams();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { userType, user } = useAuthStore();
  
  const { register } = useRegister()

  const {
    favorite
  } = useFavoriteEvent();

  const registrations = useRegistrationStore(s => s.registrations)

  const isRegistered = registrations.some(
    r => r.eventId === id && r.userId === user!
  )

  const toggleFavorite = async () => {
    if (!event) return
    setEvent(
      prev => ({ ...prev!, isFavorited: !prev!.isFavorited })
    )

    try {
      await favorite(event.id)
      invalidateEvents(user!)
    } catch (e) {
      setEvent(prev => ({ ...prev!, isFavorited: !prev!.isFavorited }))
    }
  }

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await eventService.getOneById(id as string, user!) as Event;
        setEvent(data)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <AlertCircle size={48} color={colors.text.secondary} />
        <Text style={[styles.title, { marginTop: 10 }]}>Événement introuvable</Text>
        <Text style={styles.description}>Cet événement n'existe plus ou a été supprimé.</Text>
      </View>
    );
  }

  const isFull =
    event.capacity != null
      ? event.registeredCount! >= event.capacity
      : false

  const isPast =
    new Date(event.startDateTime).getTime() < Date.now()

  const isDisabled = isPast || isFull;


  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={{
          position: "absolute",
          top: 50,
          left: 20,
          zIndex: 10,
        }}>
          <BackButton onPress={() => router.back()} />
        </View>

        {
          event.imageUrl ? <Image source={{ uri: event.imageUrl }} style={styles.image} />
            : <Calendar size={50} color={colors.secondary.main} />
        }

        <View style={styles.pillOverlay}>
          <Pill label={event.category} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.organizer}>
            par {event.organizerName}
          </Text>
        </View>

        {event.tags && (
          <View style={styles.tagsContainer}>
            {event.tags.map((t, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.infoSection}>
          <InfoRow
            label="Date & Heure"
            value={`${formatDateTime(event.startDateTime)} ${event.endDateTime ? ` — ${formatDateTime(event.endDateTime)}` : ""
              }`}
          />

          <InfoRow
            label="Lieu"
            value={event.locationName + (event.locationAddress ? ` · ${event.locationAddress}` : "")}
          />

          <InfoRow
            label="Place"
            value={event.registeredCount + "/" + event.capacity}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            À propos de l'événement
          </Text>

          <Text style={styles.description}>
            {event.description}
          </Text>
        </View>
      </ScrollView>

      {userType == "STUDENT" && <View style={styles.bottomBar}>
        <View style={{ flex: 1 }}>
          <Button
            disabled={isDisabled || isRegistered}
            onPress={() => {
              register(event.id, user!)
            }} title="S'inscrire" />
        </View>

        <View style={{ flex: 1 }}>
          <Button
            variant="secondary"
            onPress={() => {
              toggleFavorite()
            }}
            title="Favoris"
            icon={<Star size={16} color={"orange"} fill={event.isFavorited ? "orange" : "transparent"} />}
          />
        </View>
      </View>}
    </View>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, // if not supported, use margin
  },

  tag: {
    backgroundColor: "#E6F4EA", // soft green
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999, // pill shape
    borderWidth: 1,
    borderColor: "#B7E4C7",
  },

  tagText: {
    fontSize: 12,
    color: "#1B5E20",
    fontWeight: "500",
  },

  imageContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    height: "30%",
    backgroundColor: colors.ui.backgroundAlt
  },

  image: {
    width: "100%",
    height: 280,
  },

  pillOverlay: {
    position: "absolute",
    bottom: 16,
    left: 20,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120,
    gap: 20
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text.primary,
  },

  organizer: {
    marginTop: 4,
    fontSize: 14,
    color: colors.text.secondary,
  },

  infoSection: {
    gap: 10
  },

  section: {
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.text.primary,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.secondary,
  },

  bottomBar: {
    flexDirection: "row",
    gap: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },

});

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={infoStyles.row}>
    <Text style={infoStyles.label}>{label}</Text>
    <Text style={infoStyles.value}>{value}</Text>
  </View>
);

const infoStyles = StyleSheet.create({
  row: {
    backgroundColor: colors.ui.backgroundAlt,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.ui.border,
    gap: 5
  },

  label: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
  },

});