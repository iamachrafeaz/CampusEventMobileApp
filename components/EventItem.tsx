import { typography } from "@/constants/typography";
import { Pencil, Trash } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Event } from '../models/event';
import Button from "./ui/Button";

type EventItemProps = {
  event : Partial<Event>
  onEdit?: () => void;
  onDelete?: () => void;
};

const EventItem = ({
  event,
  onEdit,
  onDelete,
}: EventItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.subtitle}>
          {event.startDateTime ? new Date(event.startDateTime).toLocaleDateString() : ""} · {event.locationName ?? ""}
        </Text>
      </View>

      <View style={styles.actions}>
        {onEdit && (
          <Button
            variant="secondary"
            onPress={onEdit}
            icon={<Pencil size={16} color="black" />}
          />
        )}

        {onDelete && (
          <Button
            variant="destructive"
            onPress={onDelete}
            icon={<Trash size={16} color="white" />}
          />
        )}
      </View>
    </View>
  );
};

export default EventItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  info: {
    flex: 1,
    gap : 5
  },

  title: {
    fontSize: typography.title,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: typography.body,
    color: "#6B7280",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
  },
});