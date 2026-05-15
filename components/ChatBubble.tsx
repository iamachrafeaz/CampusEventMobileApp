import { StyleSheet, Text, View } from "react-native";

export const ChatBuble = ({ text }: { text: string }) => (
  <View style={styles.userBubble}>
    <Text style={styles.userText}>{text}</Text>
  </View>
);

export const styles = StyleSheet.create({

  userBubble: {
    backgroundColor: "#edededdd",
    alignSelf: "flex-end",
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginVertical: 8,
    maxWidth: "80%",
  },

  userText: {
    fontSize: 16,
  },
});