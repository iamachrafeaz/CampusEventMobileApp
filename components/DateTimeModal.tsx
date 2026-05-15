import { colors } from "@/constants/theme";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
};

export default function DateTimeModal({
  visible,
  onClose,
  onConfirm,
  initialDate,
}: Props) {
  const [date, setDate] = useState(initialDate ?? new Date());
  const [androidStep, setAndroidStep] = useState<"date" | "time">("date");

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      if (event.type === "dismissed") {
        setAndroidStep("date");
        onClose();
        return;
      }

      if (event.type === "set" && selectedDate) {
        if (androidStep === "date") {
          setDate(selectedDate);
          setAndroidStep("time");
        } else {
          const finalDate = new Date(date);
          finalDate.setHours(selectedDate.getHours());
          finalDate.setMinutes(selectedDate.getMinutes());
          setAndroidStep("date"); 
          onConfirm(finalDate);
          onClose();
        }
      }
    } else {
      if (selectedDate) setDate(selectedDate);
    }
  };

  const handleConfirmIOS = () => {
    onConfirm(date);
    onClose();
  };

  if (Platform.OS === "android") {
    if (!visible) return null;
    return (
      <DateTimePicker
        value={date}
        mode={androidStep}
        display="default"
        onChange={handleChange}
        accentColor={colors.primary.main}
      />
    );
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      onDismiss={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Date & Time</Text>
            <Text style={styles.subtitle}>Pick a schedule for your event</Text>
          </View>

          <View style={styles.pickerWrapper}>
            <DateTimePicker
              value={date}
              mode="datetime"
              display="spinner"
              onChange={handleChange}
              textColor={colors.text.primary}
              accentColor={colors.primary.main}
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={[styles.btn, styles.secondaryBtn]}
            >
              <Text style={styles.secondaryBtnText}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleConfirmIOS}
              style={[styles.btn, styles.confirmBtn]}
            >
              <Text style={styles.confirmBtnText}>Done</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.ui.overlay,
    justifyContent: "flex-end",
    padding: 16,
  },
  container: {
    backgroundColor: colors.ui.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 30,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  pickerWrapper: {
    backgroundColor: colors.ui.backgroundAlt,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    paddingVertical: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBtn: {
    backgroundColor: colors.button.primary,
  },
  confirmBtnText: {
    color: colors.text.inverse,
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: colors.button.secondary,
  },
  secondaryBtnText: {
    color: colors.text.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});