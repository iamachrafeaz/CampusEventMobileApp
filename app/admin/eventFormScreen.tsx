import BackButton from '@/components/BackButton';
import ImagePickerInput from '@/components/ImagePickerInput';
import LoadingModal from '@/components/LoadingModal';
import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import Input from '@/components/ui/Input';
import RadioButton from '@/components/ui/RadioButton';
import TagInput from '@/components/ui/TagInput';
import TextArea from '@/components/ui/TextArea';
import { EventCategories } from '@/constants/eventCategory';
import { colors } from '@/constants/theme';
import { typography } from '@/constants/typography';
import { eventService } from "@/services/eventService";
import { EventForm } from '@/types/EventForm';
import { EventFormErrors } from '@/types/EventFormErrors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const initialForm: EventForm = {
    title: "",
    locationName: "",
    organizerName: "",
    capacity: "",
    description: "",
    category: null,
    startDateTime: null,
    endDateTime: null,
    locationAddress: "",
    imageUrl: "",
    tags: [],
};

export default function EventFormScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter()

    const [form, setForm] = useState<EventForm>(initialForm);
    const [errors, setErrors] = useState<EventFormErrors>({});
    const [image, setImage] = useState<string | null>(null);
    const [isImageDeleted, setIsDeleted] = useState(false)

    const [isLoading, setIsLoading] = useState(false);

    const setField = <K extends keyof EventForm>(
        field: K,
        value: EventForm[K]
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const removeTag = (index: number) => {
        setForm((prev) => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index),
        }));
    };

    const validate = (): boolean => {
        const newErrors: EventFormErrors = {};

        if (!form.title.trim()) {
            newErrors.title = "Le titre est obligatoire";
        }

        if (!form.locationName.trim()) {
            newErrors.locationName = "Le nom du lieu est obligatoire";
        }

        if (!form.locationAddress.trim()) {
            newErrors.locationAddress = "L’adresse est obligatoire";
        }

        if (!form.description.trim()) {
            newErrors.description = "La description est obligatoire";
        }

        if (!form.startDateTime) {
            newErrors.startDateTime = "La date de début est obligatoire";
        }

        if (!form.category) {
            newErrors.category = "La catégorie est obligatoire";
        }

        if (
            form.startDateTime &&
            form.endDateTime &&
            form.endDateTime.getTime() <= form.startDateTime.getTime()
        ) {
            newErrors.endDateTime =
                "La date de fin doit être après la date de début";
        }

        if (form.capacity && !/^\d+$/.test(form.capacity)) {
            newErrors.capacity =
                "La capacité doit être un entier positif";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const reset = () => {
        setForm(initialForm);
        setErrors({});
        setImage(null);
        setIsDeleted(false);
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setIsLoading(true);

            if (id) {
                await eventService.update(id as string, form, image, isImageDeleted);

                Toast.show({
                    text1: "Évenement modifié avec success"
                })
            } else {
                await eventService.create(form, image);

                Toast.show({
                    text1: "Évenement créé avec success"
                })
            }

            reset();
            router.back();
        } catch (error) {

            Toast.show({
                type : "error",
                text1: `Erreur lors la ${id ? "modification" : "création"} de l'événements.`
            })
            console.error("Erreur :", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof typeof form, value: string) => {
        setField(field, value);
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setIsLoading(true);
                const data = await eventService.getById(id as string);

                setForm({
                    title: data.title,
                    locationName: data.locationName,
                    organizerName: data.organizerName,
                    capacity: data.capacity?.toString() || "",
                    description: data.description,
                    category: data.category,
                    startDateTime: new Date(data.startDateTime),
                    endDateTime: data.endDateTime ? new Date(data.endDateTime) : null,
                    locationAddress: data.locationAddress || "",
                    imageUrl: data.imageUrl || "",
                    tags: data.tags || [],

                })

                setImage(data.imageUrl || null)
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchEvent();
    }, []);

    return (
        <SafeAreaView style={{
            flex: 1, backgroundColor: "white", paddingHorizontal: 24,
        }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    <LoadingModal isVisible={isLoading} text="Patientez s'il vous plaît..." />

                    <View style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center"
                    }}>

                        <BackButton onPress={() => router.back()} />
                        <Text style={styles.title}>{id ? "Modifier" : "Nouvel"} événement</Text>
                    </View>

                    {isLoading && <View>
                    </View>}

                    <View style={styles.form}>

                        <ImagePickerInput image={image} setImage={setImage} setIsDeleted={setIsDeleted} />

                        <Input
                            label="Titre *"
                            placeholder="Ex: Workshop React Native"
                            value={form.title}
                            onChangeText={(text) => handleChange("title", text)}
                            error={errors.title}
                        />

                        <TextArea
                            label="Description *"
                            placeholder="Décrire l'événement..."
                            value={form.description}
                            onChangeText={(text) => handleChange("description", text)}
                            error={errors.description}

                        />

                        <View style={{ gap: 8 }}>
                            <Text style={styles.label}>Catégorie *</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 10 }}
                            >
                                {EventCategories.map((c, index) => (
                                    <RadioButton
                                        key={index}
                                        title={c}
                                        onPress={() => handleChange("category", c)}
                                        isSelected={form.category === c}
                                    />
                                ))}
                            </ScrollView>
                            {
                                errors.category && <Text style={{
                                    fontSize: typography.hint,
                                    color: colors.status.error
                                }}>{errors.category}</Text>
                            }
                        </View>

                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <DatePicker error={errors.startDateTime} label={'Début *'} selectedDate={form.startDateTime} setSelectedDate={(val) => setField("startDateTime", val)} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <DatePicker label={'Fin'} selectedDate={form.endDateTime} setSelectedDate={(val) => setField("endDateTime", val)} />
                            </View>
                        </View>

                        <Input
                            label="Lieu *"
                            placeholder="Ex: Salle B12"
                            value={form.locationName}
                            onChangeText={(text) => handleChange("locationName", text)}
                            error={errors.locationName}
                        />

                        <Input
                            label="Address *"
                            placeholder="Ex: Boukhalef"
                            value={form.locationAddress}
                            onChangeText={(text) => handleChange("locationAddress", text)}
                            error={errors.locationAddress}
                        />

                        <Input
                            label="Organisateur"
                            placeholder="Ex: Club Info"
                            value={form.organizerName || ""}
                            onChangeText={(text) => handleChange("organizerName", text)}
                            error={errors.organizerName}

                        />

                        <TagInput
                            label='Tags'
                            tags={form.tags}
                            setTags={(v: string) => setField("tags", [...form.tags, v])}
                            removeTag={removeTag}
                        />

                        <Input
                            label="Capacité"
                            placeholder="Ex: 50"
                            keyboardType="numeric"
                            value={form.capacity || ""}
                            onChangeText={(text) => handleChange("capacity", text)}
                            error={errors.capacity}
                        />

                    </View>
                </ScrollView>
            </KeyboardAvoidingView >
            <Button
                disabled={isLoading}
                onPress={handleSubmit}
                title='Enregistrer'
                style={{ marginTop: 10 }}
            />
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: typography.heading,
        fontWeight: "bold",
        marginVertical: 20,
        color: "#1A1A1A",
    },
    form: {
        gap: 20,
    },
    label: {
        fontWeight: "bold",
        color: colors.text?.secondary || '#666',
        fontSize: typography.body
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
});