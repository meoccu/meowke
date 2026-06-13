import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Fonts, BorderRadius, Spacing } from '../../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'primary': return { bg: Colors.primary, text: '#fff', border: Colors.primary };
      case 'secondary': return { bg: Colors.secondary, text: '#fff', border: Colors.secondary };
      case 'danger': return { bg: Colors.danger, text: '#fff', border: Colors.danger };
      case 'outline': return { bg: 'transparent', text: Colors.primary, border: Colors.primary };
      default: return { bg: Colors.primary, text: '#fff', border: Colors.primary };
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small': return { py: Spacing.sm, px: Spacing.md };
      case 'large': return { py: Spacing.md, px: Spacing.xl };
      default: return { py: Spacing.sm, px: Spacing.lg };
    }
  };

  const { bg, text, border } = getColors();
  const { py, px } = getPadding();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: bg, borderColor: border, paddingVertical: py, paddingHorizontal: px },
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.text, { color: text, fontSize: size === 'small' ? Fonts.sizeSmall : Fonts.sizeMedium }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: Fonts.weightBold as any,
  },
  icon: {
    marginRight: Spacing.sm,
  },
});
