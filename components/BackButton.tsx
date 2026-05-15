import { colors } from '@/constants/theme'
import { ArrowLeft } from 'lucide-react-native'
import { StyleSheet, TouchableOpacity } from 'react-native'

const BackButton = ({onPress} : {onPress : () => void}) => {

    return (
        <TouchableOpacity
            style={styles.backButton}
            onPress={onPress}
        >
            <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    backButton: {
        marginLeft: 5,
        backgroundColor: colors.button.secondary,
        padding: 10,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
})
export default BackButton