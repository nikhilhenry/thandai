const ImageGrid: React.FC<{ pixels: number[] }> = ({ pixels }) => {
  const size = 8;
  const baseClassname = "h-20 w-20";

  return (
    <div className="grid grid-cols-8 gap-0">
      {pixels.map((px) => (
        <div
          className={baseClassname}
          style={{ backgroundColor: lerpColor((px * 10) / 500) }}
        >
          {px}
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
  const endRgb = { r: 103, g: 0, b: 13 };
  const lerpedRgb = {
    r: Math.round(startRgb.r + t * (endRgb.r - startRgb.r)),
    g: Math.round(startRgb.g + t * (endRgb.g - startRgb.g)),
    b: Math.round(startRgb.b + t * (endRgb.b - startRgb.b)),
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
