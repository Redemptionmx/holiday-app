import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const COLORS = {
  white: "#FFFFFF",
  blueLight: "#5AB3FF",
  blueLight2: "#8FD0FF",
  orange: "#FF7A00",
  orange2: "#FF9E42",
  textDark: "#22303A",
  textMuted: "#5E6B77",
  border: "#E5EEF5",
};

export default function AboutScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <LinearGradient
      colors={[COLORS.white, COLORS.blueLight2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.pageBg}
    >
      <View style={styles.container}>
        {/* Page title */}
        <LinearGradient
          colors={[COLORS.blueLight, COLORS.blueLight2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <Text style={styles.title}>About</Text>
        </LinearGradient>

        {/* Content wrapper */}
        <View
          style={[
            styles.content,
            isLandscape ? styles.landscape : styles.portrait,
          ]}
        >
          {/* Image */}
          <Image
            source={require("../../assets/images/icon.png")}
            style={[
              styles.image,
              isLandscape ? styles.imageLandscape : styles.imagePortrait,
            ]}
            resizeMode="contain"
          />

          {/* Text block */}
          <LinearGradient
            colors={[COLORS.cardBg || COLORS.white, COLORS.white]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.textContainer}
          >
            <Text style={styles.text}>
              Deze app toont schoolvakanties voor Nederland.
            </Text>
            <Text style={styles.text}>Gemaakt door: Zain Daniel</Text>
            <Text style={styles.text}>Opleiding: Software Development</Text>
          </LinearGradient>
        </View>
      </View>
    </LinearGradient>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  pageBg: { flex: 1 },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "transparent",
  },

  headerGradient: {
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.white,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  portrait: {
    flexDirection: "column",
  },

  landscape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
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
    alignItems: "flex-start",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  text: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.textDark,
  },
});
    