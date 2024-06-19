type ChipProps = {
  text: string;
  size?: "sm" | "xs";
  color: "gray" | "green" | "yellow" | "red";
};

export default function Chip({ text, size, color }: ChipProps) {
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

  return (
    <div className={`${sizeStyles} ${colorStyles} flex justify-center drop-shadow-sm drop-shadow-glow rounded`}>
      <span className="text-center">{text}</span>
    </div>
  );
}
