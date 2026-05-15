import { colors } from '@/constants/theme';
import { typography } from '@/constants/typography';
import { Search } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const SearchInput = ({
    placeholder = "Search...",
    value,
    onChangeText,
}: {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
}) => {
    return (
        <View style={styles.container}>
            <Search size={18} color={colors.text.secondary} style={styles.icon} />

            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                placeholderTextColor={colors.text.secondary}
                onChangeText={onChangeText}
                returnKeyType="search"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.ui.backgroundAlt,
        borderWidth: 1,
        borderColor: colors.ui.borderDark,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 15,
        gap: 8,
    },
    icon: {
        marginRight: 4,
    },
    input: {
        flex: 1,
        fontSize: typography.body,
        color: colors.text.primary,
    },
});

export default SearchInput;