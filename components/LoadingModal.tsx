import { colors } from "@/constants/theme";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

const LoadingModal = ({text, isVisible} : {text : string, isVisible : boolean}) => {
    return <Modal
        visible={isVisible}
        transparent
        animationType="fade"
    >
        <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={colors.primary.main} />
                <Text style={styles.loadingText}>{text}</Text>
            </View>
        </View>
    </Modal>
}

export default LoadingModal;

const styles = StyleSheet.create({
    loadingOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingBox: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        minWidth: 160,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    }
})