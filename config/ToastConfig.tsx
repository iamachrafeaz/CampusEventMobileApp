import { BaseToast, ErrorToast } from 'react-native-toast-message';

const BASE_STYLE = {
  borderRadius: 14,
  borderLeftColor: 'transparent',
  backgroundColor: '#ffffff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 4,
  borderWidth: 1,
  borderColor: '#f1f5f9',
  height: 'auto' as const,
};

const CONTENT_STYLE = {
  paddingHorizontal: 14,
  paddingVertical: 14,
};

const TEXT1_STYLE = {
  fontSize: 14,
  fontWeight: '600' as const,
  color: '#0f172a',
};

const TEXT2_STYLE = {
  fontSize: 13,
  color: '#94a3b8',
  fontWeight: '400' as const,
};

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        ...BASE_STYLE,
        borderLeftColor: '#22c55e',
        borderLeftWidth: 3,
      }}
      contentContainerStyle={CONTENT_STYLE}
      text1Style={TEXT1_STYLE}
      text2Style={TEXT2_STYLE}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        ...BASE_STYLE,
        borderLeftColor: '#ef4444',
        borderLeftWidth: 3,
      }}
      contentContainerStyle={CONTENT_STYLE}
      text1Style={TEXT1_STYLE}
      text2Style={TEXT2_STYLE}
    />
  ),

  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        ...BASE_STYLE,
        borderLeftColor: '#3b82f6',
        borderLeftWidth: 3,
      }}
      contentContainerStyle={CONTENT_STYLE}
      text1Style={TEXT1_STYLE}
      text2Style={TEXT2_STYLE}
    />
  ),

  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{
        ...BASE_STYLE,
        borderLeftColor: '#f59e0b',
        borderLeftWidth: 3,
      }}
      contentContainerStyle={CONTENT_STYLE}
      text1Style={TEXT1_STYLE}
      text2Style={TEXT2_STYLE}
    />
  ),
};