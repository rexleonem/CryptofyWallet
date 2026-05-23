import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAccountStore } from '../../store/walletStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { apiClient } from '../../api/client';
import ChatBubble from '../../components/ChatBubble';
import SuggestionChips from '../../components/SuggestionChips';

export default function ChatScreen() {
  const navigation = useNavigation();
  const { userId } = useAccountStore();
  const [messages, setMessages] = useState<any[]>([
    { 
      id: '1', 
      text: "I monitor your custodial portfolio, market exposure, risk, and opportunities. Ask me what changed and what deserves attention.", 
      isUser: false 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const suggestions = [
    "What changed today?",
    "Analyze my risk level",
    "Am I too exposed to ETH?",
    "Summarize my portfolio"
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg = { id: Date.now().toString(), text, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', { userId, message: text });
      const data = response.data;
      
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        text: data.response, 
        isUser: false,
        insights: data.insights,
        actions: data.actions
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: 'err', text: "Sorry, I'm offline right now.", isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  }, [messages, loading]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Close</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Cryptofy Intelligence</Text>
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
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <SuggestionChips suggestions={suggestions} onSelect={handleSend} />
        
        <View style={styles.inputContainer}>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    padding: SPACING.l,
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
