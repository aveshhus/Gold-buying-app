import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function TaglineMarquee() {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: -100,
            duration: 30000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    animate();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.marqueeContainer} overflow="hidden">
        <Animated.View
          style={[
            styles.marqueeContent,
            {
              transform: [{ translateX: animatedValue }],
            },
          ]}
        >
          {[...Array(5)].map((_, i) => (
            <Text key={i} style={styles.taglineText}>
              ✨ Here, you don't buy digital gold you buy real, physical gold and silver. ✨
            </Text>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#681412',
    paddingVertical: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  marqueeContainer: {
    overflow: 'hidden',
  },
  marqueeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  taglineText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 32,
  },
});

