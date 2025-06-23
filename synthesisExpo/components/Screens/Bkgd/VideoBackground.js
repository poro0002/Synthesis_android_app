import { Video } from 'expo-av';
import { Asset } from 'expo-asset';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

const localVideo = require('../../../assets/jelly4.mp4');

export default function VideoBackground({ source = localVideo }) {
  const [videoUri, setVideoUri] = useState(null);

  useEffect(() => {
    async function loadAsset() {
      const asset = Asset.fromModule(source);
      await asset.downloadAsync();
      setVideoUri(asset.localUri || asset.uri);
    }
    loadAsset();
  }, [source]);

  if (!videoUri) return null;

  return (
    <View style={styles.absoluteContainer}>
      <Video
        source={{ uri: videoUri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
      />
      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    
  },
});