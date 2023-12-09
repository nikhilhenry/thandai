import { number } from "zod";

const ImageGrid: React.FC<{ pixels: number[] }> = ({ pixels }) => {
  const size = 8;
  const baseClassname = "h-20 w-20";

  return (
    <div className="grid grid-cols-8 gap-0">
      {pixels.map((px) => (
        <div
          className={baseClassname}
          style={{ backgroundColor: lerpColor(px / 100 + 20 / 100) }}
        >
          <span className="diplay-none">{px}</span>
        </div>
      ))}
    </div>
  );
};

type RGBColor = {
  r: number;
  g: number;
  b: number;
};

const lerpColor = (t: number) => {
  const startRgb = { r: 8, g: 48, b: 107 };
  const midRgb = { r: 255, g: 255, b: 255 };
  const endRgb = { r: 103, g: 0, b: 13 };

  if (t <= 0.5) {
    const lerpedRgb = {
      r: Math.round(startRgb.r + t * (midRgb.r - startRgb.r)),
      g: Math.round(startRgb.g + t * (midRgb.g - startRgb.g)),
      b: Math.round(startRgb.b + t * (midRgb.b - startRgb.b)),
    };
    const lerpedHex = rgbToHex(lerpedRgb);
    return lerpedHex;
  }

  const lerpedRgb = {
    r: Math.round(midRgb.r + t * (endRgb.r - midRgb.r)),
    g: Math.round(midRgb.g + t * (endRgb.g - midRgb.g)),
    b: Math.round(midRgb.b + t * (endRgb.b - midRgb.b)),
  };
  const lerpedHex = rgbToHex(lerpedRgb);
  return lerpedHex;
};

const rgbToHex = (rgb: RGBColor) => {
  const toHex = (value: number) => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
};

export default ImageGrid;
