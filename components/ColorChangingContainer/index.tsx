import { FC, ReactNode } from "react";
import { Pressable, ColorValue, StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  return (
    <Pressable
      style={[
        styles.container,
        containerStyles,
        backgroundColor && { backgroundColor: backgroundColor },
      ]}
      onPress={onPress}
    >
      <SafeAreaView style={styles.innerContainer}>{children}</SafeAreaView>
    </Pressable>
  );
};

export default ColorChangingContainer;
