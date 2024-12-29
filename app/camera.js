import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';  // Ensure this import is correct
import { useRouter } from 'expo-router';

export default function CameraScreen() {
  const [photo, setPhoto] = useState(null);
  const [cameraType, setCameraType] = useState('back');
  const cameraRef = useRef(null);
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  const takePhoto = async () => {
    if (cameraRef.current) {
      const capturedPhoto = await cameraRef.current.takePictureAsync();
      setPhoto(capturedPhoto);
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
  };

  const usePhoto = () => {
    router.push({
      pathname: '/actions',  // Replace with the correct path to your actions screen (e.g., /actions or /actions.js)
      query: { photoUri: photo.uri },  // Pass the photo URI as a query parameter
    });
  };

  // Don't use `useRoute()` here, use `router.query` instead to get photo URI
  const { photoUri } = router.query || {};  // Get the photo URI from router.query

  // If the photo is available, show it in the input area of the chat screen
  return (
    <SafeAreaView style={styles.container}>
      {photo ? (
        <SafeAreaView style={styles.container}>
          <Image source={{ uri: photo.uri }} style={styles.preview} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={retakePhoto}>
              <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={usePhoto}>
              <Text style={styles.text}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            type={cameraType}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={takePhoto}>
                <Text style={styles.text}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
  camera: {
    flex: 1,
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  button: {
    backgroundColor: '#FF1493',
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
