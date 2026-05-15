import { colors } from "@/constants/theme";
import React, { useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";

function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
    const scale = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 200,
            friction: 12,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.tag, { transform: [{ scale }] }]}>
            <Text style={styles.tagText}>{label}</Text>
            <TouchableOpacity onPress={onRemove} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                <Text style={styles.tagRemove}>✕</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default Tag;

const styles = StyleSheet.create({
  container: { gap: 10, padding: 16 },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary.main,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  tagText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  tagRemove: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "700" },
});