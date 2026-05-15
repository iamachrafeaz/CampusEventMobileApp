import { colors } from '@/constants/theme';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: colors.ui.backgroundAlt,
        borderRadius: 12,
        borderLeftColor: "transparent",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingVertical: 10,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: "600",

      }}
      text2Style={{
        fontSize: 13,
        color: "#cbd5e1",
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#ef4444",
        backgroundColor: "#0f172a",
        borderRadius: 12,
        borderWidth: 0,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingVertical: 10,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: "600",
        color: "#ffffff",
      }}
      text2Style={{
        fontSize: 13,
        color: "#cbd5e1",
      }}
    />
  ),

  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#3b82f6",
        backgroundColor: "#0f172a",
        borderRadius: 12,
        borderWidth: 0,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingVertical: 10,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: "600",
        color: "#ffffff",
      }}
      text2Style={{
        fontSize: 13,
        color: "#cbd5e1",
      }}
    />
  ),
};