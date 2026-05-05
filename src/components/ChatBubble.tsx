import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/Theme';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  insights?: string[];
  actions?: string[];
}

export default function ChatBubble({ message, isUser, insights, actions }: ChatBubbleProps) {
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>{message}</Text>
        
        {!isUser && insights && insights.length > 0 && (
          <View style={styles.insightSection}>
            {insights.map((insight, i) => (
              <View key={i} style={styles.insightRow}>
                <View style={styles.dot} />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        )}

        {!isUser && actions && actions.length > 0 && (
          <View style={styles.actionSection}>
            <Text style={styles.actionTitle}>Suggestions:</Text>
            {actions.map((action, i) => (
              <View key={i} style={styles.actionChip}>
                <Text style={styles.actionChipText}>{action}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flexDirection: 'row',
  },
  userContainer: {
    justifyContent: 'flex-end',
    paddingLeft: 40,
  },
  aiContainer: {
    justifyContent: 'flex-start',
    paddingRight: 40,
  },
  bubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: COLORS.textPrimary,
  },
  insightSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  insightText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  actionSection: {
    marginTop: 12,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  actionChip: {
    backgroundColor: 'rgba(79, 124, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  actionChipText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});
