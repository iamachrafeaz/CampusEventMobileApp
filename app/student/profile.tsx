import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import TagInput from '@/components/ui/TagInput'
import { colors } from '@/constants/theme'
import { typography } from '@/constants/typography'
import { useAuthStore } from '@/store/useAuthStore'
import { useProfileStore } from '@/store/useProfile'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { LogOut } from 'lucide-react-native'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

const ProfileScreen = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { profile } = useProfileStore();

  const [profileForm, setProfileForm] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    major: profile?.major || "",
    year: profile?.year || "",
    interests: profile?.interests || []
  });

  const [isFormDisabled, setIsFormDisabled] = useState(false)

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  const validateProfile = () => {
    if (!profileForm.firstName.trim()) {
      Toast.show({ type: "error", text1: "Prénom requis" });
      return false;
    }

    if (!profileForm.lastName.trim()) {
      Toast.show({ type: "error", text1: "Nom requis" });
      return false;
    }

    if (!profileForm.major.trim()) {
      Toast.show({ type: "error", text1: "Filière requise" });
      return false;
    }

    if (!profileForm.year.toString().trim()) {
      Toast.show({ type: "error", text1: "Année requise" });
      return false;
    }

    if (!profileForm.interests || profileForm.interests.length === 0) {
      Toast.show({ type: "error", text1: "Ajoutez au moins un centre d'intérêt" });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateProfile()) return
    try {
      setIsFormDisabled(true)
      const jsonValue = JSON.stringify(profileForm);
      await AsyncStorage.setItem('profile', jsonValue);
      Toast.show(
        { type: "success", text1: "Modification sauvgardée" }
      )
    } catch (e) {
      console.error(e)
      Toast.show(
        { type: "error", text1: "Erreur" }
      )
    } finally {
      setIsFormDisabled(false)

    }
  }

  const handleFieldChange = (field: keyof typeof profileForm, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Profile</Text>

        <Button onPress={handleLogout}
          icon={
            <LogOut color={"white"} size={18} />
          }
          variant='destructive'
          size='sm'
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1, gap: 10 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Input
          label={'Prénom'}
          placeholder={'Prénom'}
          value={profileForm.firstName}
          onChangeText={(val) => handleFieldChange('firstName', val)}
        />

        <Input
          label={'Nom'}
          placeholder={'Nom'}
          value={profileForm.lastName}
          onChangeText={(val) => handleFieldChange('lastName', val)}
        />

        <Input
          label={'Filière'}
          placeholder={'Filière'}
          value={profileForm.major}
          onChangeText={(val) => handleFieldChange('major', val)}
        />

        <Input
          label={'Année'}
          placeholder={'Annéee'}
          value={profileForm.year.toString()}
          keyboardType='numeric'
          onChangeText={(val) => handleFieldChange('year', val)}
        />

        <TagInput
          label={"Centres d'intérêt"}
          tags={profileForm.interests}
          setTags={(v) => setProfileForm(prev => ({ ...prev, interests: [...prev.interests, v] }))}
          removeTag={(v) => setProfileForm(prev => ({ ...prev, interests: prev.interests.filter((interest, index) => index !== v) }))}
        />

        <Button
          disabled={isFormDisabled}
          title='Sauvgarder'
          onPress={handleSubmit} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    paddingBottom: 70,
    backgroundColor: "white",
    paddingHorizontal: 24,
  },
  headerSection: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: typography.display,
    fontWeight: "bold",
    color: colors.text.primary,
  },
})

export default ProfileScreen