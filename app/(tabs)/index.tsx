import { StatusBar, View } from "react-native";
import { useState } from "react";

// Components
import ColorChangingContainer from "@/components/ColorChangingContainer";
import Title from "@/components/Title";

// Models
import { ColorTheme } from "@/models/theme";
import { generateColorTheme, isDarkColor } from "@/utils/colorGenerator";

export default function Index() {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(
    generateColorTheme()
  );

  const updateColorTheme = () => {
    setColorTheme(generateColorTheme());
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar
        translucent
        barStyle={
          isDarkColor(colorTheme.backgroundColor)
            ? "light-content"
            : "dark-content"
        }
        animated
        backgroundColor={"transparent"}
      />
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
