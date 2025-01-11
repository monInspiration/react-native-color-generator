import { View } from "react-native";
import { useState } from "react";

// Components
import ColorChangingContainer from "@/components/ColorChangingContainer";
import Title from "@/components/Title";

// Models
import { ColorTheme } from "@/models/theme";
import { generateColorTheme } from "@/utils/colorGenerator";

export default function Index() {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(
    generateColorTheme()
  );
  console.log(colorTheme);
  const updateColorTheme = () => {
    setColorTheme(generateColorTheme());
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ColorChangingContainer
        backgroundColor={colorTheme?.backgroundColor}
        onPress={updateColorTheme}
      >
        <Title textValue="Hello" textColor={colorTheme?.mainTextColor} />
        <Title textValue="there" textColor={colorTheme?.secondaryTextColor} />
      </ColorChangingContainer>
    </View>
  );
}
