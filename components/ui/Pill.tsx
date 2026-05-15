import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: "Workshop" | "Club" | "Talk" | "Exam" | "Other";
};

const config = {
  Workshop: {
    bg: "#E8F0FF",
    text: "#0052CC",
  },
  Club: {
    bg: "#F0E7FF",
    text: "#7C3AED",
  },
  Talk: {
    bg: "#FEF3C7",
    text: "#D97706",
  },
  Exam: {
    bg: "#FEE2E2",
    text: "#DC2626",
  },
  Other: {
    bg: "#E5E7EB",
    text: "#374151",
  },
} as const;

const Pill = ({ label }: Props) => {
  const style = config[label];

  return (
    <View style={[styles.pill, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.text }]}>
        {label}
      </Text>
    </View>
  );
};

export default Pill;

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});