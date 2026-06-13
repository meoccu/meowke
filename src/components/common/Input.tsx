import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Colors, Fonts, BorderRadius, Spacing } from '../../theme/colors';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'url';
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry,
  keyboardType = 'default',
  multiline,
  numberOfLines,
  style,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          focused && styles.focused,
          error && styles.error,
          multiline && styles.multiline,
        ]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Fonts.sizeNormal,
    color: Colors.text,
    marginBottom: Spacing.sm,
    fontWeight: Fonts.weightMedium as any,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Fonts.sizeMedium,
    color: Colors.text,
    backgroundColor: Colors.card,
    minHeight: 44,
  },
  focused: {
    borderColor: Colors.primary,
  },
  error: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontSize: Fonts.sizeSmall,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },
  multiline: {
    paddingVertical: Spacing.md,
    textAlignVertical: 'top',
  },
});
