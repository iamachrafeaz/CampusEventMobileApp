import { colors } from '@/constants/theme';
import { typography } from '@/constants/typography';
import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';


const Input = ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    keyboardType
}: {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string | null;
    keyboardType?: KeyboardTypeOptions
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TextInput
                keyboardType={keyboardType || "default"}
                style={[styles.input, error && styles.inputError]}
                placeholder={placeholder}
                value={value}
                placeholderTextColor={colors.text.secondary}
                onChangeText={onChangeText}
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
        fontSize: typography.body
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
    },
    inputError: {
        borderColor: colors.status.error,
    },
})

export default Input