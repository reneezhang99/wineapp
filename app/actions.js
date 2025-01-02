import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, SafeAreaView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Composer } from 'react-native-gifted-chat';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from './theme';
import { generateClaudeResponse, analyzeWineImage } from './prompts';
import { Ionicons } from '@expo/vector-icons';
import { getStoredWineProfile } from './storage-utils';
import { initializeSession, saveMessages, formatMessagesForContext } from './chat-session';

export default function Page() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [wineProfile, setWineProfile] = useState(null);
  const [pendingImage, setPendingImage] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const loadWineProfile = async () => {
      const profile = await getStoredWineProfile();
      setWineProfile(profile);
    };
    loadWineProfile();
  }, []);

  useEffect(() => {
    const initChat = async () => {
      const savedMessages = await initializeSession();
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      } else {
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
      }
    };
    
    initChat();
  }, []);

  useEffect(() => {
    if (params?.imageUri) {
      setPendingImage(params.imageUri);
    }
  }, [params?.imageUri]);

  const onSend = useCallback(async (newMessages = []) => {
    const userMessage = newMessages[0]?.text;
    
    // Create the message object
    const messageToSend = {
      _id: Math.random().toString(),
      text: userMessage || "",
      createdAt: new Date(),
      user: { _id: 1 },
      ...(pendingImage && { image: pendingImage }),
    };

    // Update chat with user's message
    const updatedMessages = GiftedChat.append(messages, [messageToSend]);
    setMessages(updatedMessages);
    await saveMessages(updatedMessages);

    // Clear pending image
    setPendingImage(null);

    setIsTyping(true);

    try {
      if (pendingImage) {
        // Process image with Claude
        const response = await fetch(pendingImage);
        const blob = await response.blob();
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            try {
              const base64Data = reader.result.split(',')[1];
              resolve(base64Data);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        const formattedImageData = {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: base64
          }
        };

        const analysis = await analyzeWineImage(formattedImageData, wineProfile);
        const botMessage = {
          _id: Math.random().toString(),
          text: analysis,
          createdAt: new Date(),
          user: { _id: 2, name: 'Remi' },
        };

        const finalMessages = GiftedChat.append(updatedMessages, [botMessage]);
        setMessages(finalMessages);
        await saveMessages(finalMessages);
      } else {
        // Regular text message processing
        const messageHistory = formatMessagesForContext(messages);
        const response = await generateClaudeResponse(userMessage, wineProfile, messageHistory);
        
        const botMessage = {
          _id: Math.random().toString(),
          text: typeof response === 'string' ? response : JSON.stringify(response),
          createdAt: new Date(),
          user: { _id: 2, name: 'Remi' },
        };

        const finalMessages = GiftedChat.append(updatedMessages, [botMessage]);
        setMessages(finalMessages);
        await saveMessages(finalMessages);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        _id: Math.random().toString(),
        text: 'Oops! Something went wrong. Please try again later.',
        createdAt: new Date(),
        user: { _id: 2, name: 'Remi' },
      };

      const finalMessages = GiftedChat.append(updatedMessages, [errorMessage]);
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    } finally {
      setIsTyping(false);
    }
  }, [messages, pendingImage, wineProfile]);

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

  const renderMessageImage = (props) => {
    return (
      <Image 
        source={{ uri: props.currentMessage.image }} 
        style={{ 
          width: 200, 
          height: 200, 
          borderRadius: 13, 
          margin: 3,
        }}
        resizeMode="cover"
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
            {pendingImage && (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: pendingImage }} 
                  style={styles.imagePreview} 
                />
                <TouchableOpacity 
                  style={styles.clearImageButton}
                  onPress={() => setPendingImage(null)}
                >
                  <Ionicons name="close-circle" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
            <Composer
              {...composerProps}
              textInputStyle={styles.textInput}
              placeholder={pendingImage ? "Add a question about this wine..." : "Ask Remi..."}
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
              disabled={!props.text.trim() && !pendingImage}
            >
              <Ionicons 
                name="arrow-forward" 
                size={24} 
                color={(!props.text.trim() && !pendingImage) ? '#ccc' : theme.colors.button} 
              />
            </TouchableOpacity>
          </View>
        )}
        renderSend={null}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.name}>Renee</Text>
        <Text style={styles.helperText}>
          Ask Remi for wine suggestions, pairings or just have a chat about wine ✨
        </Text>
      </View>
      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: 1 }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderMessageImage={renderMessageImage}
          renderAvatar={null}
          minInputToolbarHeight={60}
          maxComposerHeight={100}
          isTyping={isTyping}
          textInputProps={{
            keyboardAppearance: 'dark',
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  chatContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
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
  imagePreviewContainer: {
    position: 'relative',
    marginRight: 10,
  },
  imagePreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  clearImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: theme.colors.button,
    borderRadius: 10,
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
  }
});