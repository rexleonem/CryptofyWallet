import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';

export default function BuyScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>Payment rails not enabled</Text>
        <Text style={styles.subtitle}>Buying will appear once card and bank integrations are configured for your region.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.m },
  headerTitle: { ...TYPOGRAPHY.h2, fontSize: 20 },
  backText: { color: COLORS.primary, fontSize: 16 },
  body: { flex: 1, padding: SPACING.l, justifyContent: 'center' },
  title: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: COLORS.textSecondary, marginTop: 8, textAlign: 'center', lineHeight: 20 },
});

