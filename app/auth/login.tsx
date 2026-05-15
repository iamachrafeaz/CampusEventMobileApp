import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import RadioButton from '@/components/ui/RadioButton';
import { colors } from '@/constants/theme';
import { typography } from '@/constants/typography';
import { UserType } from '@/constants/userType';
import { loginService } from '@/services/loginService';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FieldState = { value: string; error: string | null };

type LoginForm = {
  userType: UserType | null;
  email: FieldState;
  password: FieldState;
};

const INITIAL_FORM: LoginForm = {
  userType: "STUDENT",
  email: { value: "etudiant@campus.ma", error: null },
  password: { value: "etudiant123", error: null },
};

export default function LoginScreen() {
  const router = useRouter();

  const login = useAuthStore((s) => s.login);

  const setProfile = useProfileStore((s) => s.setProfile)

  const [form, setForm] = useState<LoginForm>(INITIAL_FORM);


  const setField = (field: "email" | "password", value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: { value, error: null },
    }));
  };

  const setUserType = (userType: UserType) => {
    setForm(prev => ({ ...prev, userType }));
  };

  const validate = (): boolean => {
    let valid = true;

    if (!form.email.value.trim()) {
      setForm(prev => ({ ...prev, email: { ...prev.email, error: "Entrer votre email" } }));
      valid = false;
    }

    if (!form.password.value.trim()) {
      setForm(prev => ({ ...prev, password: { ...prev.password, error: "Entrer votre mot de passe" } }));
      valid = false;
    }

    return valid;
  };

  const submit = async () => {
    setForm(prev => ({
      ...prev,
      password: { error: null, value: prev.password.value },
      email: { error: null, value: prev.email.value }
    })
    )

    if (!form.userType || !validate()) return

    const result = loginService(form.email.value, form.password.value, form.userType);

    if (result.success) {
      login(form.userType, form.email.value);

      if (form.userType === "ADMIN") {
        router.replace("/admin/home");
      } else {
        const value = await AsyncStorage.getItem('profile');
        if (value !== null) {
          setProfile(JSON.parse(value))
          console.log(value)
        }
        router.replace("/student/home");
      }
    }

    if (!result.success) {
      if (result.error == "Invalid email") {
        setForm(prev => ({ ...prev, email: { error: "Email incorrect", value: prev.email.value } }))
      }

      if (result.error == "Invalid password") {
        setForm(prev => ({ ...prev, password: { error: "Mot de passe incorrect", value: prev.password.value } }))
      }
    };
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.headerSection}>
        <Text style={styles.title}>CampusEvents AI</Text>
        <Text style={styles.subTitle}>Université Abdelmalek Essâadi</Text>
      </View>

      <View style={styles.roleSection}>
        <Text style={styles.sectionLabel}>Je suis :</Text>
        <View style={styles.radioContainer}>
          <RadioButton title="Admin" isSelected={form.userType === "ADMIN"} onPress={() => setUserType("ADMIN")} />
          <RadioButton title="Étudiant" isSelected={form.userType === "STUDENT"} onPress={() => setUserType("STUDENT")} />
        </View>
      </View>

      <View style={styles.formSection}>
        <Input
          label="Email"
          placeholder="Entrer votre email"
          value={form.email.value}
          onChangeText={(val) => setField("email", val)}
          error={form.email.error}
        />
        <Input
          label="Mot de passe"
          placeholder="Entrer votre mot de passe"
          value={form.password.value}
          onChangeText={(val) => setField("password", val)}
          error={form.password.error}
        />
        <Button title="Se connecter" onPress={submit} />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
  },
  headerSection: {
    marginTop: 40,
    marginBottom: 32,
    gap: 4,
  },
  title: {
    fontSize: typography.display,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  subTitle: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  roleSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
    fontWeight: '500',
  },
  radioContainer: {
    flexDirection: "row",
    gap: 16,
  },
  formSection: {
    gap: 16
  },
});

