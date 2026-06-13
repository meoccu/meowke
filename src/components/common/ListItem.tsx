import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Fonts, BorderRadius, Spacing } from '../../theme/colors';

interface ListItemProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  icon?: React.ReactNode;
  divider?: boolean;
  style?: any;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  rightElement,
  onPress,
  icon,
  divider = true,
  style,
}) => {
  const Content = (
    <View style={[styles.container, divider && styles.divider, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightElement && <View style={styles.right}>{rightElement}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.card,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  icon: {
    marginRight: Spacing.md,
    width: 28,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Fonts.sizeMedium,
    color: Colors.text,
    fontWeight: Fonts.weightMedium as any,
  },
  subtitle: {
    fontSize: Fonts.sizeSmall,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  right: {
    marginLeft: Spacing.md,
  },
});
