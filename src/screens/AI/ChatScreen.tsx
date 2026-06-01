import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAccountStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { apiClient } from '../../api/client';
import ChatBubble from '../../components/ChatBubble';
import { CryptofyIcon } from '../../components/icons';
import type { AiAction } from '../../components/ChatBubble';

const HEADER_EST_HEIGHT = 64;

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const { address } = useAccountStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg = { id: Date.now().toString(), text, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', { address, message: text });
      const data = response.data;
      
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        text: data.response || data.message || 'AI service unavailable',
        isUser: false,
        insights: data.insights,
        actions: data.actions
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, text: 'AI service unavailable', isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: AiAction) => {
    switch (action.type) {
      case 'RECEIVE':
        navigation.navigate('Receive');
        return;
      case 'SEND':
        navigation.navigate('Send', action.params || {});
        return;
      case 'ADD_ASSET':
        navigation.navigate('Main', { screen: 'Portfolio', params: { openAddAsset: true, symbol: action.symbol } });
        return;
      case 'NAVIGATE':
        if (action.screen === 'Main') {
          const tab = (action.params as any)?.tab;
          const screen = tab === 'Wallets' ? 'Portfolio' : tab === 'Home' ? 'Home' : undefined;
          navigation.navigate('Main', screen ? { screen } : (action.params || {}));
          return;
        }
        navigation.navigate(action.screen as any, action.params || {});
        return;
      default:
        return;
    }
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  }, [messages, loading]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? HEADER_EST_HEIGHT + insets.top : 0}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Close</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <View style={styles.aiMark}>
                <CryptofyIcon name="ai" size={16} color={COLORS.primaryLight} />
              </View>
              <Text style={styles.headerTitle}>Cryptofy Intelligence</Text>
            </View>
            <Text style={styles.headerSubtitle}>Portfolio-aware - Real-time</Text>
          </View>
          <View style={{ width: 50 }} />
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item.text}
              isUser={item.isUser}
              insights={item.insights}
              actions={item.actions}
              onActionPress={handleAction}
            />
          )}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.listContent,
            // Ensure content isn't hidden behind the floating tab bar.
            { paddingBottom: Math.max(tabBarHeight, insets.bottom) + SPACING.l },
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No AI history yet</Text>
              <Text style={styles.emptyText}>Ask a question when live intelligence is available for your account.</Text>
            </View>
          }
        />

        <View
          style={[
            styles.inputContainer,
            // Keep the composer above the floating tab bar on all devices.
            { paddingBottom: insets.bottom + 10, marginBottom: tabBarHeight + 8 },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Ask about your portfolio..."
            placeholderTextColor={COLORS.textSecondary}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.disabledSend]}
            onPress={() => handleSend(input)}
            disabled={!input.trim() || loading}
          >
            {loading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.sendText}>Send</Text>}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerInfo: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiMark: {
    width: 28,
    height: 28,
    borderRadius: 12,
    backgroundColor: 'rgba(10,132,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(165,216,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 16,
  },
  headerSubtitle: {
    fontSize: 10,
    color: COLORS.success,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  listContent: {
    flexGrow: 1,
    padding: SPACING.l,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: 8,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SPACING.m,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSend: {
    opacity: 0.5,
  },
  sendText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
