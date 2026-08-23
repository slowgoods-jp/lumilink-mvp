interface Props {
  name: string;
  color: string;
  size?: number;
  ring?: boolean;
}

export default function Avatar({ name, color, size = 40, ring = false }: Props) {
  const initial = name.trim().charAt(0);
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${
        ring ? "ring-2 ring-white" : ""
      }`}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.4,
      }}
    >
      {initial}
    </div>
  );
}
