import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '@constants/theme';
import { AI_GREETING, AI_SUGGESTIONS } from '@constants/aiPrompt';
import { useTheme } from '@contexts/ThemeContext';
import { askShopAI, toFriendlyError, type ChatTurn } from '@services/geminiService';

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  status?: 'sent' | 'error'; // 'error' -> hiện nút Thử lại (Phần 8.10)
};

export default function AIChatScreen() {
  const { colors } = useTheme();
  // Chiều cao thanh tiêu đề "Tư vấn AI ShopAI" — KeyboardAvoidingView tự đo chiều cao
  // của chính nó nên KHÔNG biết phía trên còn thanh này; thiếu là bàn phím che ô nhập.
  const headerHeight = useHeaderHeight();

  const [messages, setMessages] = useState<Message[]>([
    { id: 'greeting', text: AI_GREETING, isBot: true, status: 'sent' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const listRef = useRef<FlatList<Message>>(null);
  // Lưu lại câu hỏi vừa lỗi để nút "Thử lại" biết phải gửi lại cái gì
  const lastQuestionRef = useRef<string>('');

  const scrollToEnd = () => {
    // Hoãn một nhịp để FlatList kịp render item mới rồi mới cuộn
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  /** Dựng lịch sử hội thoại theo đúng định dạng Gemini yêu cầu. */
  const buildHistory = useCallback((list: Message[]): ChatTurn[] => {
    return list
      .filter(m => m.id !== 'greeting' && m.status !== 'error') // Bỏ câu chào và các tin lỗi
      .map(m => ({
        role: m.isBot ? ('model' as const) : ('user' as const),
        parts: [{ text: m.text }],
      }));
  }, []);

  /** Lõi gửi tin — dùng chung cho cả nút Gửi lẫn nút Thử lại. */
  const send = useCallback(
    async (question: string, historySource: Message[]) => {
      lastQuestionRef.current = question;
      setIsTyping(true);
      scrollToEnd();

      try {
        const reply = await askShopAI(question, buildHistory(historySource));
        setMessages(prev => [
          ...prev,
          { id: `bot-${Date.now()}`, text: reply, isBot: true, status: 'sent' },
        ]);
      } catch (error) {
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            text: toFriendlyError(error),
            isBot: true,
            status: 'error',
          },
        ]);
      } finally {
        setIsTyping(false);
        scrollToEnd();
      }
    },
    [buildHistory],
  );

  const handleSend = useCallback(
    (overrideText?: string) => {
      const text = (overrideText ?? inputText).trim();
      if (!text || isTyping) return; // Chống spam: đang chờ AI thì không cho gửi tiếp

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        text,
        isBot: false,
        status: 'sent',
      };

      setMessages([...messages, userMsg]);
      setInputText(''); // Xoá ô nhập NGAY để user thấy phản hồi tức thì
      // Lịch sử gửi lên KHÔNG gồm câu vừa hỏi — sendMessage() tự thêm nó vào
      send(text, messages);
    },
    [inputText, isTyping, messages, send],
  );

  /** Nút Thử lại: xoá bong bóng lỗi rồi gửi lại đúng câu hỏi cũ. */
  const handleRetry = useCallback(() => {
    if (isTyping || !lastQuestionRef.current) return;
    const cleaned = messages.filter(m => m.status !== 'error');
    setMessages(cleaned);
    // Bỏ câu hỏi cuối khỏi lịch sử (nó sẽ được gửi lại qua sendMessage)
    send(lastQuestionRef.current, cleaned.slice(0, -1));
  }, [isTyping, messages, send]);

  /** Avatar tròn: robot cho bot, hình người cho user. */
  const renderAvatar = (isBot: boolean) => (
    <View style={[styles.avatar, isBot ? styles.botAvatar : styles.userAvatar]}>
      <Icon name={isBot ? 'robot' : 'account'} size={18} color={COLORS.surface} />
    </View>
  );

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.row, !item.isBot && styles.rowUser]}>
      {renderAvatar(item.isBot)}
      <View style={[styles.rowBody, !item.isBot && styles.rowBodyUser]}>
        <Text style={[styles.sender, { color: colors.textLight }]}>
          {item.isBot ? 'ShopAI Trợ lý' : 'Bạn'}
        </Text>
        <View
          style={[
            styles.bubble,
            item.isBot
              ? [styles.botBubble, { backgroundColor: colors.surface }]
              : styles.userBubble,
            item.status === 'error' && styles.errorBubble,
          ]}
        >
          <Text
            selectable // Cho phép chạm giữ để copy (Phần 8.10)
            style={
              item.status === 'error'
                ? styles.errorText
                : item.isBot
                  ? { color: colors.text }
                  : styles.userText
            }
          >
            {item.text}
          </Text>
        </View>

        {item.status === 'error' && (
          <Pressable onPress={handleRetry} style={styles.retryBtn}>
            <Icon name="refresh" size={14} color={COLORS.primary} />
            <Text style={styles.retryText}>Thử lại</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  /** Trạng thái rỗng: gợi ý sẵn câu hỏi để user biết hỏi gì (Phần 8.10). */
  const renderSuggestions = () => (
    <View style={styles.suggestBox}>
      <View style={styles.suggestHeader}>
        <Icon name="lightbulb-on-outline" size={16} color={SUGGEST_ACCENT} />
        <Text style={styles.suggestTitle}>Gợi ý câu hỏi nhanh</Text>
      </View>
      <View style={styles.chipRow}>
        {AI_SUGGESTIONS.map(s => (
          <Pressable
            key={s}
            style={styles.chip}
            onPress={() => handleSend(s)} // Bấm chip = gửi câu đó như user vừa gõ
            disabled={isTyping}
          >
            <Text style={styles.chipText}>{s}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const canSend = inputText.trim().length > 0 && !isTyping;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['left', 'right']}
    >
      {/* KeyboardAvoidingView — "phao cứu sinh" chống bàn phím che khung Chat.
          App bật edge-to-edge nên Android cũng cần 'padding' như iOS. */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={headerHeight}
      >
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <View style={[styles.avatar, styles.headerAvatar, styles.botAvatar]}>
            <Icon name="robot" size={24} color={COLORS.surface} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Trợ lý Mua sắm ShopAI</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={[styles.headerSub, { color: colors.textLight }]}>
                {isTyping ? 'Đang trả lời...' : 'Sẵn sàng tư vấn 24/7'}
              </Text>
            </View>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={scrollToEnd}
          keyboardShouldPersistTaps="handled" // Bấm chip được cả khi bàn phím đang mở
          ListFooterComponent={
            <>
              {/* Chỉ hiện gợi ý khi user chưa hỏi câu nào (mới có mỗi câu chào) */}
              {messages.length <= 1 && renderSuggestions()}
              {/* Typing indicator (Phần 8.10) */}
              {isTyping && (
                <View style={styles.row}>
                  {renderAvatar(true)}
                  <View
                    style={[
                      styles.bubble,
                      styles.botBubble,
                      styles.typingBubble,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <ActivityIndicator size="small" color={COLORS.textLight} />
                    <Text style={[styles.typingText, { color: colors.textLight }]}>
                      Đang trả lời...
                    </Text>
                  </View>
                </View>
              )}
            </>
          }
        />

        <View style={[styles.inputArea, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nhập câu hỏi tư vấn..."
            placeholderTextColor={colors.textLight}
            maxLength={500} // Chặn dán cả cuốn tiểu thuyết (Phần 8.11, chiến lược #2)
            // KHÔNG khoá ô nhập (editable) khi chờ AI: khoá là Android đóng bàn phím sau
            // mỗi lần gửi. Chống spam đã có nút Gửi bị disabled + chốt isTyping ở handleSend.
            multiline
          />
          <Pressable
            style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!canSend} // Ô rỗng hoặc đang chờ -> nút mờ, không bấm được
            accessibilityRole="button"
            accessibilityLabel="Gửi tin nhắn"
          >
            {isTyping ? (
              <ActivityIndicator size="small" color={COLORS.surface} />
            ) : (
              <Icon name="send" size={20} color={COLORS.surface} />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Tông vàng của khung "Gợi ý câu hỏi nhanh" — cố định ở cả nền Sáng lẫn Tối
const SUGGEST_BG = '#FFF8E1';
const SUGGEST_BORDER = '#FFE082';
const SUGGEST_ACCENT = '#B7791F';

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  headerAvatar: { width: 44, height: 44, borderRadius: 22 },
  headerTitle: { fontSize: SIZES.body1, fontWeight: 'bold' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  headerSub: { fontSize: 12 },

  listContent: { padding: SIZES.padding, flexGrow: 1 },

  // Một dòng chat = avatar + (nhãn người gửi, bong bóng). User thì đảo chiều sang phải.
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 14 },
  rowUser: { flexDirection: 'row-reverse' },
  rowBody: { maxWidth: '78%', alignItems: 'flex-start' },
  rowBodyUser: { alignItems: 'flex-end' },
  sender: { fontSize: 11, marginBottom: 4 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botAvatar: { backgroundColor: COLORS.secondary },
  userAvatar: { backgroundColor: COLORS.primary },

  bubble: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 18 },
  botBubble: { borderTopLeftRadius: 4 },
  userBubble: { backgroundColor: COLORS.primary, borderTopRightRadius: 4 },
  errorBubble: {
    backgroundColor: '#FFE0E0',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  userText: { color: COLORS.surface },
  errorText: { color: COLORS.text },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typingText: { fontSize: 13 },

  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  retryText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 13 },

  suggestBox: {
    backgroundColor: SUGGEST_BG,
    borderWidth: 1,
    borderColor: SUGGEST_BORDER,
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 16,
  },
  suggestHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  suggestTitle: { fontSize: 13, fontWeight: 'bold', color: SUGGEST_ACCENT },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: SUGGEST_BORDER,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: { color: COLORS.text, fontSize: 13 },

  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 11,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
});
