import { colors } from '@/constants/theme'
import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

const RadioButton = ({ title, isSelected, onPress }: { title: String, isSelected: boolean, onPress: () => void }) => {
    return (
        <Pressable
            onPress={onPress}
            style={[styles.container, isSelected && styles.containerSelected]}>
            <Text style={[styles.title, isSelected && styles.titleSelected]}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        minWidth : 100,
        flex: 1,
        backgroundColor: colors.secondary.light,
        borderWidth: 1,
        borderColor: colors.ui.border,
        borderRadius: 10,
        paddingVertical: 10,
    },
    containerSelected: {
        backgroundColor: colors.primary.lighter,
        borderColor: colors.primary.main,
    },
    title: {
        textAlign: "center",
        fontWeight: "medium",
        color: colors.text.secondary
    },
    titleSelected: {
        fontWeight: "bold",
        color: colors.primary.main
    }
})

export default RadioButton