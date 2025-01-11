import { FC, ReactNode, useState } from "react";
import { Pressable, ColorValue, StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Animation
import {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";

import { styles } from "./styles";

interface Props {
  children?: ReactNode;
  backgroundColor?: ColorValue;
  onPress?: () => void;
  containerStyles?: StyleProp<ViewStyle>;
}

const ColorChangingContainer: FC<Props> = ({
  children,
  backgroundColor,
  onPress,
  containerStyles,
}) => {
  // Color used for color transition animation
  const [oldColor, setOldColor] = useState<ColorValue | undefined>(
    backgroundColor
  );
  // Color transition animation
  const progress = useDerivedValue(() =>
    withTiming(backgroundColor != oldColor ? 1 : 0, { duration: 500 }, () =>
      runOnJS(setOldColor)(backgroundColor)
    )
  );
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [oldColor as string, backgroundColor as string],
        "RGB",
        {
          gamma: 2.2,
        }
      ),
    };
  });

  return (
    <Pressable style={[styles.container, containerStyles]} onPress={onPress}>
      <Animated.View style={[styles.container, containerStyles, animatedStyle]}>
        <SafeAreaView style={styles.innerContainer}>{children}</SafeAreaView>
      </Animated.View>
    </Pressable>
  );
};

export default ColorChangingContainer;
