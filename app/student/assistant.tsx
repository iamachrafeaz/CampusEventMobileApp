import WeeklySchedule from '@/components/ai/PlanResponse'
import RecommendResponse from '@/components/ai/RecommendResponse'
import SearchResponse from '@/components/ai/SearchResponse'
import AssistantInput from '@/components/AssistantInput'
import { ChatBuble } from '@/components/ChatBubble'
import TextShimmer from '@/components/TextShimmer'
import { MarkdownStyles } from '@/constants/markdownStyles'
import { colors } from "@/constants/theme"
import { typography } from "@/constants/typography"
import { askAI } from '@/services/assistantService'
import { LLMRole } from '@/types/LLMRole'
import React, { useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import Markdown from "react-native-markdown-display"
import { SafeAreaView } from 'react-native-safe-area-context'


const AssistantScreen = () => {

  const [messages, setMessages] = useState<{ message: string, role: LLMRole | null, isAgent: Boolean }[]>([]);

  const [currentMessage, setCurrentMessage] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  const [loading, setLoading] = useState(false)

  const onSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const textToSend = currentMessage;

    setCurrentMessage("")

    setLoading(true)

    setMessages(prev => [...prev, { message: textToSend, role: null, isAgent: false }]);

    askAI(textToSend)
      .then((res) => {
        setMessages(prev => [...prev, { message: res.answer, role: res.role, isAgent: true }]);
      })
      .finally(() => setLoading(false))
  }

  return (
    <SafeAreaView
      edges={{bottom : "off", top : "additive", left : "additive"}}
      style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Assistant IA</Text>
          <View style={{
            backgroundColor: "#FFF3E0",
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.accent.orange,
          }}>
            <Text
              style={{
                color: "#E65100",
                fontWeight: "600",
                textAlign: "left"
              }}>Ne soumettez pas de données personnelles ou sensibles.</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            messages.length === 0 && { flex: 1, justifyContent: 'center' }
          ]}
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
        >
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            messages.map((m, index) =>
              m.isAgent ? (
                m.role == "search" ? <SearchResponse key={index} agentResponse={m.message} /> :
                  m.role == "recommend" ? <RecommendResponse key={index} agentResponse={m.message} /> :
                    m.role == "plan" ? <WeeklySchedule key={index} data={m.message} /> :
                      <Markdown
                        style={MarkdownStyles}
                        key={index}>{m.message}</Markdown>
              ) : (
                <ChatBuble key={index} text={m.message} />
              )
            )
          )}

          {loading && <TextShimmer text='Chargement...' />}

        </ScrollView>

        {/* Input */}
        <AssistantInput
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          onSendMessage={onSendMessage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView >
  )
}

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconCircle}>
      <Text style={{ fontSize: 40 }}>✨</Text>
    </View>
    <Text style={styles.emptyTitle}>Comment puis-je vous aider ?</Text>
    <Text style={styles.emptySubtitle}>
      Posez-moi une question ou commencez une discussion pour explorer mes capacités.
    </Text>
  </View>
);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    backgroundColor: "white",
    paddingHorizontal: 24,
  },

  keyboardContainer: {
    flex: 1,
  },

  headerSection: {
    marginTop: 24,
    gap: 5
  },

  title: {
    fontSize: typography.display,
    fontWeight: "bold",
    color: colors.text.primary,
  },

  scroll: {
    flex: 1,
    marginTop: 10,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  // Empty State Styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee'
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 22,
  },

  inputContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },

  input: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    paddingVertical: 13,
    paddingHorizontal: 13,
    borderRadius: 20,
  },

  sendButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 30,
    padding: 12,
    marginLeft: 10,
  },
});


export default AssistantScreen;