import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Composer } from 'react-native-gifted-chat';
import { useRouter } from 'expo-router';
import { theme } from './theme';
import { generateClaudeResponse } from './prompts'; // Function to call Claude API
import { Ionicons } from '@expo/vector-icons';

export default function Page() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Ask Remi for wine suggestions, pairings or just have a chat about wine ✨',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Remi',
        },
      },
    ]);
  }, []);

  const onSend = useCallback(async (newMessages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );

    const userMessage = newMessages[0]?.text; // Get the user's message
    if (!userMessage) return;

    setIsTyping(true);

    try {
      // Call the Claude API to generate a response
      const response = await generateClaudeResponse(userMessage);
      const botMessage = {
        _id: Math.random().toString(), // Unique ID for the bot message
        text: typeof response === 'string' ? response : JSON.stringify(response), // Ensure text is a string
        createdAt: new Date(),
        user: {
            _id: 2, // ID for the bot
            name: 'Remi',
        },
    };

    console.log('Claude Response:', response);

    

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, botMessage)
      );
    } catch (error) {
      console.error('Error fetching response from Claude:', error);

      const errorMessage = {
        _id: Math.random().toString(),
        text: 'Oops! Something went wrong. Please try again later.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Remi',
        },
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, errorMessage)
      );
    } finally {
      setIsTyping(false);
    }
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: 'white',
          },
          right: {
            backgroundColor: theme.colors.button,
          },
        }}
        textStyle={{
          left: {
            color: theme.colors.text,
          },
          right: {
            color: 'white',
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={[
          styles.inputToolbar,
          { marginBottom: Platform.OS === 'ios' ? 20 : 0 }
        ]}
        renderComposer={(composerProps) => (
          <View style={styles.inputContainer}>
            <Composer
              {...composerProps}
              textInputStyle={styles.textInput}
              placeholder="Ask Remi..."
            />
            <TouchableOpacity
              onPress={() => router.push('/camera')}
              style={styles.iconButton}
            >
              <Ionicons name="camera-outline" size={24} color={theme.colors.button} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.onSend && props.onSend({ text: props.text.trim() }, true)
              }
              style={styles.iconButton}
              disabled={!props.text.trim()}
            >
              <Ionicons name="arrow-forward" size={24} color={theme.colors.button} />
            </TouchableOpacity>
          </View>
        )}
        renderSend={null}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.name}>Renee</Text>
        <Text style={styles.helperText}>
          Ask Remi for wine suggestions, pairings or just have a chat about wine ✨
        </Text>
      </View>

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderAvatar={null}
        minInputToolbarHeight={60}
        maxComposerHeight={100}
        isTyping={isTyping}
        textInputProps={{
          keyboardAppearance: 'dark',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 32,
    fontFamily: theme.fonts.heading,
    color: theme.colors.text,
    textAlign: 'center',
  },
  name: {
    fontSize: 32,
    fontFamily: theme.fonts.heading,
    color: theme.colors.text,
    marginBottom: 20,
  },
  helperText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 15,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: 'transparent',
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputToolbar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    paddingHorizontal: 0,
  },
});
