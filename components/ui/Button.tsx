import { colors } from '@/constants/theme';
import { typography } from '@/constants/typography';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Variant = "primary" | "secondary" | "tertiary" | "destructive";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  onPress: () => void;
  title?: string;
  icon?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  style?: any;
};

const Button = ({
  onPress,
  title,
  icon,
  variant = "primary",
  size = "md",
  disabled = false,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        getSizeStyle(size),
        getVariantStyle(variant, pressed, disabled),
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      {title && <Text
        style={[
          styles.title,
          { color: getTextColor(variant, disabled) },
        ]}
      >
        {title}
      </Text>}
    </Pressable>
  );
};

export default Button;

const getVariantStyle = (
  variant: Variant,
  pressed: boolean,
  disabled: boolean
) => {
  if (variant === "primary") {
    if (disabled) return { backgroundColor: colors.button.primaryDisabled };
    return {
      backgroundColor: pressed
        ? colors.button.primaryHover
        : colors.button.primary,
    };
  }

  if (variant === "secondary") {
    if (disabled) return { backgroundColor: colors.button.secondaryDisabled };
    return {
      backgroundColor: pressed
        ? colors.button.secondaryHover
        : colors.button.secondary,
    };
  }

  if (variant === "tertiary") {
    return {
      backgroundColor: pressed
        ? colors.button.tertiaryHover
        : colors.button.tertiary,
      borderWidth: 1,
      borderColor: colors.button.tertiaryBorder,
    };
  }

  if (variant === "destructive") {
    if (disabled) {
      return {
        backgroundColor: colors.button.destructiveDisabled,
      };
    }

    return {
      backgroundColor: pressed
        ? colors.button.destructiveHover
        : colors.button.destructive,
    };
  }
};

const getTextColor = (variant: Variant, disabled: boolean) => {
  if (disabled) return "#9CA3AF";

  if (variant === "primary") return "#fff";
  if (variant === "secondary") return "#111827";
  if (variant === "destructive") return "#fff";
  if (variant === "tertiary") return "#111827";
};

const getSizeStyle = (size: Size) => {
  switch (size) {
    case "sm":
      return {
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
      };

    case "lg":
      return {
        paddingVertical: 18,
        paddingHorizontal: 18,
        borderRadius: 12,
      };

    case "md":
    default:
      return {
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderRadius: 10,
      };
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

  },

  title: {
    textAlign : "center",
    fontSize: typography.button,
    color: "#fff",
    fontWeight: "bold",
  },

  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
});