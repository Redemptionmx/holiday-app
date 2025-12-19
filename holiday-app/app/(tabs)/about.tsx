import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';

export default function AboutScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <View style={styles.container}>
      {/* Page title */}
      <Text style={styles.title}>About</Text>

      {/* Content wrapper */}
      <View
        style={[
          styles.content,
          isLandscape ? styles.landscape : styles.portrait,
        ]}
      >
        {/* Image */}
        <Image
          source={require('../../assets/images/icon.png')}
          style={[
            styles.image,
            isLandscape ? styles.imageLandscape : styles.imagePortrait,
          ]}
          resizeMode="contain"
        />

        {/* Text block */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Deze app toont schoolvakanties voor Nederland.
          </Text>
          <Text style={styles.text}>Gemaakt door: Zain Daniel</Text>
          <Text style={styles.text}>Opleiding: Software Development</Text>
        </View>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  portrait: {
    flexDirection: 'column',
  },

  landscape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  image: {
    width: 150,
    height: 150,
  },

  imagePortrait: {
    marginBottom: 16,
  },

  imageLandscape: {
    marginRight: 24,
  },

  textContainer: {
    maxWidth: 300,
    alignItems: 'flex-start',
  },

  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
});
