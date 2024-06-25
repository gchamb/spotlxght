import { getRandomColorPair } from "~/lib/utils";

type ChipProps = {
  text: string;
  size?: "sm" | "xs";
  color?: "gray" | "green" | "yellow" | "red";
  randomColor?: boolean;
};

export default function Chip({ text, size, color, randomColor }: ChipProps) {
  const sizeStyles =
    size === "sm" || size === undefined
      ? "p-1 text-sm max-w-[100px]"
      : "p-1 text-xs max-w-[75px]";
  const colorStyles =
    color === "gray"
      ? "bg-gray-700 text-gray-200"
      : color === "green"
        ? "bg-green-800 text-green-500"
        : color === "yellow"
          ? "bg-yellow-800 text-yellow-500"
          : "bg-red-800 text-red-500";

  //   const randomColorPair = randomColor ? getRandomColorPair() : null;

  return (
    <div
      className={`${sizeStyles} ${!randomColor && colorStyles} drop-shadow-glow flex justify-center rounded drop-shadow-sm`}
      style={
        {
          // background: randomColorPair?.darkColor,
        }
      }
    >
      <span
        className="text-center"
        // style={{ color: randomColorPair?.lightColor }}
      >
        {text}
      </span>
    </div>
  );
}
