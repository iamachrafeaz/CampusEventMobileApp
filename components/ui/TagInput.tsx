import { colors } from "@/constants/theme";
import { typography } from "@/constants/typography";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Tag from "./Tag";

const MAX_TAGS = 10;


export default function TagInput({ label, tags, setTags, removeTag }:
  { label : string, tags: string[], setTags: (v: string) => void, removeTag: (i: number) => void }) {
  const [text, setText] = useState("");

  const [focused, setFocused] = useState(false);

  const addTag = () => {
    const trimmed = text.trim();
    if (!trimmed || tags.includes(trimmed) || tags.length >= MAX_TAGS) {
      setText("");
      return;
    }
    setTags(trimmed);
    setText("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {/* Tag list */}
      {tags.length === 0 ? (
        <Text style={styles.placeholder}>Pas de tags encore</Text>
      ) : <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagRow}
      >
        {tags.map((t, i) => (
          <Tag key={`${t}-${i}`} label={t} onRemove={() => removeTag(i)} />
        ))}

      </ScrollView>
      }

      {/* Input row */}
      <View style={[styles.inputRow]}>
        <TextInput
          placeholder="Add a tag..."
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={addTag}
          returnKeyType="done"
          style={styles.input}
          maxLength={30}
        />
        {text.trim().length > 0 && (
          <TouchableOpacity onPress={addTag} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Count */}
      <Text style={styles.count}>{tags.length}/{MAX_TAGS} tags</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },

  tagRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    minHeight: 36,
    paddingVertical: 4,
  },
  label: {
    fontWeight: "bold",
    color: colors.text.secondary,
    fontSize: typography.body
  },

  placeholder: { color: colors.text.secondary, fontSize: 13 },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.ui.borderDark,
    borderRadius: 10,
    padding: 15,
    backgroundColor: colors.ui.backgroundAlt,
  },
  input: { flex: 1, fontSize: typography.body, color: colors.text.primary, },
  addButton: {
    backgroundColor: colors.button.primary,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  count: { fontSize: 11, color: "#aaa", textAlign: "right" },
});