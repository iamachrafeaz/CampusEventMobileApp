import { colors } from "@/constants/theme";
import { typography } from "@/constants/typography";
import { Registration } from "@/models/registration";
import { formatDateTime } from "@/utils/timeFormater";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "./ui/Button";

type Props = {
    registration: Registration;
    onCancel : (registration: Registration) => void
};

const RegistrationCard = ({ registration, onCancel }: Props) => {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "confirmed":
                return styles.statusConfirmed;
            case "cancelled":
                return styles.statusCancelled;
            default:
                return styles.statusDefault;
        }
    };
    const registrationStatusLabel = {
        confirmed: "confirmée",
        cancelled: "annulée",
    } as const;

    return (
        <View style={styles.card}>
            <Text style={[styles.status, getStatusStyle(registration.status)]}>
                {registrationStatusLabel[registration.status]}
            </Text>
            <Text style={styles.title}>{registration.title}</Text>

            <Text style={styles.subtitle}>
                {formatDateTime(registration.startDateTime)} · {registration.locationName}
            </Text>

            {registration.status == "confirmed" && <Button size="sm" title="Annuler" onPress={() => onCancel(registration)} />}
        </View>
    );
};

export default RegistrationCard;

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: colors.ui.border,
        borderRadius: 15,
        padding: 15,
        gap: 10,
        backgroundColor: colors.ui.backgroundAlt,
    },

    status: {
        borderRadius: 100,
        fontWeight: "600",
        paddingHorizontal: 10,
        paddingVertical: 3,
        fontSize: 12,
        overflow: "hidden",
    },

    statusConfirmed: {
        backgroundColor: "#E8F5E9",
        color: "#2E7D32",
    },

    statusCancelled: {
        backgroundColor: "#F5F5F5",
        color: "#616161",
    },

    statusDefault: {
        backgroundColor: "#E3F2FD",
        color: "#1565C0",
    },

    title: {
        fontSize: typography.subtitle,
        fontWeight: "600",
        color: "#111",
    },

    subtitle: {
        color: colors.text.secondary,
        fontWeight: "600",
        fontSize: 13,
    },
});