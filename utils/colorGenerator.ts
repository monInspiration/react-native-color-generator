import { ColorTheme } from "@/models/theme";
import { ColorValue } from "react-native";

/*
 * Function generates color theme pallete, that includes background color and text color variations.
 * Background color is generated randomly
 * text colors are generated based on the background color, to make it readable with any background
 */
export const generateColorTheme = (): ColorTheme => {
  const backgroundColor = generateRandomColor();

  return {
    backgroundColor: backgroundColor,
    mainTextColor: generateTextColorFromBackgroundColor(
      backgroundColor,
      "main"
    ),
    secondaryTextColor: generateTextColorFromBackgroundColor(
      backgroundColor,
      "secondary"
    ),
  };
};

/*
    * Function generates random color in rgb.
    ** Function explanation:
        1. Random number from 0 to 1 is generated 
        2. Number is converted to hexadecimal string
        3. Last 6 elements of the string are taken to generate hex code of the color
*/
const generateRandomColor = (): ColorValue => {
  return rgbChannelsToColor(
    hexToRgbChannels(`#${Math.random().toString(16).slice(-6)}`)
  );
};

/*
 * Modify given color to create extra color that can be used with this one.
 * I'm using this function to create colors for text, that will be readable with any given background.
 */
const generateTextColorFromBackgroundColor = (
  color: string | ColorValue,
  mode: "main" | "secondary"
): ColorValue => {
  if (isHexColor(color)) {
    return hslToRgbColor(
      adaptHslColor(
        rgbToHslChannels(hexToRgbChannels(color)),
        mode == "main" ? "major" : "minor"
      )
    );
  } else if (isRgbColor(color)) {
    return hslToRgbColor(
      adaptHslColor(
        rgbToHslChannels(rgbToRgbChannels(color)),
        mode == "main" ? "major" : "minor"
      )
    );
  }

  return color;
};

type RgbChannels = {
  r: number;
  g: number;
  b: number;
};
/*
 * Convert hex color into rgb channels
 */
export const hexToRgbChannels = (
  color: string | ColorValue | undefined
): RgbChannels => {
  let hexCode = color as string;
  let r = 0,
    g = 0,
    b = 0;

  // Check that hexCode is valid
  if (/^#[0-9A-F]{6}$/i.test(hexCode)) {
    // 6 digits
    r = Number("0x" + hexCode[1] + hexCode[2]);
    g = Number("0x" + hexCode[3] + hexCode[4]);
    b = Number("0x" + hexCode[5] + hexCode[6]);
  } else if (/^#[0-9A-F]{3}$/i.test(hexCode)) {
    // 3 digits
    r = Number("0x" + hexCode[1] + hexCode[1]);
    g = Number("0x" + hexCode[2] + hexCode[2]);
    b = Number("0x" + hexCode[3] + hexCode[3]);
  }

  return { r: r, g: g, b: b };
};
/*
 * Split rgb string to channels
 */
const rgbToRgbChannels = (color: string | ColorValue): RgbChannels => {
  let r = 0,
    g = 0,
    b = 0;

  if (isRgbColor(color)) {
    const preparedString = String(color)
      .substring(String(color).indexOf("(") + 1, String(color).indexOf(")"))
      .replaceAll(" ", "");
    const splitted = preparedString.split(",");

    if (splitted.length == 3) {
      r = Number(splitted[0]);
      g = Number(splitted[1]);
      b = Number(splitted[2]);
    }
  }

  return { r: r, g: g, b: b };
};
/*
 * Create rgb color string from channels
 */
export const rgbChannelsToColor = (rgbChannels: RgbChannels): ColorValue => {
  return `rgb(${rgbChannels.r}, ${rgbChannels.g}, ${rgbChannels.b})`;
};

type HslChannels = {
  h: number;
  s: number;
  l: number;
};
/*
 * Convert rgb channels into hsl channels
 */
const rgbToHslChannels = (rgbChannels: RgbChannels): HslChannels => {
  // Make r, g, b channels fractions of 1
  let r = rgbChannels.r / 255,
    g = rgbChannels.g / 255,
    b = rgbChannels.b / 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  // No difference
  if (delta == 0) h = 0;
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h: h, s: s, l: l };
};
/*
 * Create hsl color string from channels
 */
const hslChannelsToColor = (hslChannels: HslChannels): ColorValue => {
  return `hsl(${hslChannels.h}, ${hslChannels.s}%, ${hslChannels.l}%)`;
};

const hslToRgbColor = (hslChannels: HslChannels) => {
  let { h, s, l } = hslChannels;
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return `rgb(${255 * f(0)}, ${255 * f(8)}, ${255 * f(4)})`;
};

/*
 * Modify given color to create extra colors that can be used with this one.
 * I'm using this function to create colors for text, that will be readable with any given background.
 */
const adaptHslColor = (
  hslChannels: HslChannels,
  mode: "minor" | "major"
): HslChannels => {
  let lightChannel = hslChannels.l;

  // Making color darker
  if (lightChannel >= 50) {
    lightChannel =
      mode == "minor" ? randomInteger(35, 40) : randomInteger(5, 25);
  } else if (lightChannel >= 30) {
    if (randomInteger(0, 1)) {
      lightChannel =
        mode == "minor" ? randomInteger(65, 75) : randomInteger(80, 95);
    } else {
      lightChannel =
        mode == "minor" ? randomInteger(15, 20) : randomInteger(5, 15);
    }
  } else {
    // Making color lighter
    lightChannel =
      mode == "minor" ? randomInteger(60, 75) : randomInteger(80, 95);
  }

  return { ...hslChannels, l: lightChannel };
};

/*
 * Check is given color dark
 */
export const isDarkColor = (color: ColorValue | string): boolean => {
  if (isHexColor(color)) {
    let hslChannels = rgbToHslChannels(hexToRgbChannels(color));
    if (hslChannels.l <= 40) return true;
  } else if (isRgbColor(color)) {
    let hslChannels = rgbToHslChannels(rgbToRgbChannels(color));
    if (hslChannels.l < 40) return true;
  }

  return false;
};

/*
 * Generate random integer for selected range
 */
const randomInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/*
 * Check that input is valid hex color
 */
const isHexColor = (color: string | ColorValue): boolean => {
  if (
    /^#[0-9A-F]{6}$/i.test(color as string) ||
    /^#[0-9A-F]{3}$/i.test(color as string)
  )
    return true;
  return false;
};
/*
 * Check that input is valid rgb color
 */
const isRgbColor = (color: string | ColorValue): boolean => {
  if (
    RegExp(
      /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/gm
    ).test(color as string)
  )
    return true;
  return false;
};
