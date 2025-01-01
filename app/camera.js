import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './theme';
import * as ImageManipulator from 'expo-image-manipulator';


export default function CameraScreen() {
  const [photo, setPhoto] = useState(null);
  const [cameraType, setCameraType] = useState('back');
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7, // Lower initial quality
        });
        const compressed = await compressImage(photo.uri);
        setPhoto(compressed);
      } catch (error) {
        console.error('Camera error:', error);
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7, // Lower initial quality
      });
  
      if (!result.canceled) {
        const compressed = await compressImage(result.assets[0].uri);
        setPhoto(compressed);
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const compressImage = async (uri) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1080 } }], // Resize to reasonable dimensions
        {
          compress: 0.7, // Compression quality (0 to 1)
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true
        }
      );

      const checkFileSize = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const sizeInMB = blob.size / (1024 * 1024);
        return sizeInMB <= 5;
      };
    
      return manipulatedImage;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
  };

  const usePhoto = async () => {
    try {
      setIsProcessing(true);
      router.back(); // Use back instead of replace
      router.setParams({
        imageUri: photo.uri
      });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (permission?.status !== 'granted') {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photo ? (
        // Preview screen
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo.uri }} style={styles.preview} />
          <View style={styles.previewButtons}>
            {isProcessing ? (
              <ActivityIndicator size="large" color={theme.colors.button} />
            ) : (
              <>
                <TouchableOpacity 
                  style={[styles.button, styles.previewButton]} 
                  onPress={retakePhoto}
                >
                  <Ionicons name="close" size={24} color="white" />
                  <Text style={styles.buttonText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.previewButton]} 
                  onPress={usePhoto}
                >
                  <Ionicons name="checkmark" size={24} color="white" />
                  <Text style={styles.buttonText}>Use Photo</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      ) : (
        // Camera screen
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            type={cameraType}
          >
            <View style={styles.cameraButtons}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.captureButton} 
                onPress={takePhoto}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.button} 
                onPress={pickImage}
              >
                <Ionicons name="images" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  cameraButtons: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  previewButtons: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: theme.colors.button,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  previewButton: {
    minWidth: 120,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
  }
});