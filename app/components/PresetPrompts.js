// components/PresetPrompts.js
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const presetPrompts = [
  {
    id: 1,
    text: 'Pick a wine from a menu',
    prompt: 'Can you help me pick a wine from this menu?',
    icon: '📖',
    backgroundColor: '#F5E6E8', // Light pink/beige
    textColor: '#6B4246',
  },
  {
    id: 2,
    text: 'Pick a bottle for a friend',
    prompt: 'I need help picking a wine bottle for a friend',
    icon: '🍷',
    backgroundColor: '#E8F0E6', // Light mint
    textColor: '#465E43',
  },
  {
    id: 3,
    text: 'Wine pairing help',
    prompt: 'What wine would pair well with my meal?',
    icon: '🍽️',
    backgroundColor: '#E6E8F0', // Light periwinkle
    textColor: '#434B5E',
  },
];

export default function PresetPrompts({ onPromptSelect }) {
  return (
    <ScrollView 
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {presetPrompts.map((prompt) => (
        <TouchableOpacity
          key={prompt.id}
          style={[styles.promptButton, { backgroundColor: prompt.backgroundColor }]}
          onPress={() => onPromptSelect(prompt.prompt)}
        >
          <Text style={styles.promptIcon}>{prompt.icon}</Text>
          <Text style={[styles.promptText, { color: prompt.textColor }]}>
            {prompt.text}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// components/PresetPrompts.js
const styles = StyleSheet.create({
    container: {
      padding: 10,
      gap: 8,
    },
    promptButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,  // reduced from 16
      paddingVertical: 8,     // reduced from 12
      borderRadius: 20,
      marginRight: 8,
      height: 36,             // explicitly set height
    },
    promptIcon: {
      fontSize: 14,           // reduced from 16
      marginRight: 6,
    },
    promptText: {
      fontSize: 13,           // reduced from 14
      fontWeight: '400',
    },
  });