import { FC } from "react";
import { ColorValue, StyleProp, Text, TextStyle } from "react-native";

import { styles } from "./styles";

interface Props {
  textValue?: string;
  textColor?: ColorValue;
  textStyles?: StyleProp<TextStyle>;
}

const Title: FC<Props> = ({ textValue, textColor, textStyles }) => {
  return (
    <Text style={[styles.title, textStyles, textColor && { color: textColor }]}>
      {textValue}
    </Text>
  );
};

export default Title;
