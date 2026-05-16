import { colors } from "@/constants/theme";
import { ListChecks, MessageCircle, Search, Send, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const AssistantInput = (
  { currentMessage, setCurrentMessage, onSendMessage, disabled }:
    { currentMessage: string, disabled: boolean, setCurrentMessage: (val: string) => void, onSendMessage : () => void }) => {
  const [showMenu, setShowMenu] = useState(false);

  const roles = [
    { label: 'Search', value: 'search', icon: <Search size={16} color={colors.text.primary} /> },
    { label: 'Recommendation', value: 'recommend', icon: <Star size={16} color={colors.text.primary} /> },
    { label: 'Planning', value: 'plan', icon: <ListChecks size={16} color={colors.text.primary} /> },
    { label: 'Q&A', value: 'qa', icon: <MessageCircle size={16} color={colors.text.primary} /> },
  ];

  return (
    <View style={styles.outerContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          value={currentMessage}
          onChangeText={setCurrentMessage}
          placeholder={`Posez une question...`}
          placeholderTextColor="#999"
          multiline={false}
        />

        {/* Send Button Inside */}
        <TouchableOpacity
          style={[styles.sendButton, !currentMessage.trim() && styles.disabledSend]}
          onPress={onSendMessage}
          disabled={!currentMessage.trim() || disabled}
        >
          <Send color="#fff" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 10,
    position: 'relative',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 28,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 8,
    height: 40,
  },
  sendButton: {
    backgroundColor: colors.primary.main,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  disabledSend: {
    backgroundColor: '#D1D5DB',
  },
  /* Simple Menu Styling */
  menuCard: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 8,
    width: 180,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 }
    }),
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    borderRadius: 8,
  },
  activeMenuItem: {
    backgroundColor: '#F3F4F6',
  },
  menuText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  }
});

export default AssistantInput;