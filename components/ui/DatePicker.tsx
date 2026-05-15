import { colors } from '@/constants/theme';
import { typography } from '@/constants/typography';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimeModal from '../DateTimeModal';


const DatePicker = ({
  label,
  selectedDate,
  setSelectedDate,
  error,
}: {
  label: string;
  error?: string | null;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        onPress={() => setVisible(true)}
        style={[styles.input, error && {borderColor: colors.status.error} ]}
      >
        {selectedDate == null && <Text style={styles.placeholder}>Selectioner une date</Text>}
        {selectedDate != null && <Text> {selectedDate?.toDateString() + " · " + selectedDate?.toLocaleTimeString()}</Text>}
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      <DateTimeModal
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={(date) => date != null && setSelectedDate(date)}
      />
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
    fontSize: typography.body
  },
  placeholder: {
    color: colors.text.muted
  },
  input: {
    backgroundColor: colors.ui.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.ui.borderDark,
    borderRadius: 10,
    padding: 15,
    color: colors.text.primary
  },
  error: {
    fontSize: typography.hint,
    color: colors.status.error
  }
})

export default DatePicker