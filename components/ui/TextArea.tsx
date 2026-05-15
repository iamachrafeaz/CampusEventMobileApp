import { colors } from "@/constants/theme";
import { typography } from "@/constants/typography";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const TextArea = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string | null;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          styles.textArea,
          error && styles.inputError,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top" 
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },

  label: {
    fontWeight: "bold",
    color: colors.text.secondary,
    fontSize: typography.body,
  },

  input: {
    backgroundColor: colors.ui.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.ui.borderDark,
    borderRadius: 10,
    padding: 15,
    color: colors.text.primary,
  },

  textArea: {
    minHeight: 120, // 🔥 makes it a textarea
  },

  inputError: {
    borderColor: colors.status.error,
  },

  error: {
    fontSize: typography.hint,
    color: colors.status.error,
  },
});

export default TextArea;