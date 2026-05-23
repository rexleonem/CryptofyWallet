import React from 'react';
import { StyleSheet, Text } from 'react-native';

type TextIconProps = {
  label: string;
  color: string;
  size?: number;
};

export default function TextIcon({ label, color, size = 18 }: TextIconProps) {
  return <Text style={[styles.icon, { color, fontSize: size }]}>{label}</Text>;
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    textAlign: 'center',
    fontWeight: '900',
    lineHeight: 24,
  },
});
