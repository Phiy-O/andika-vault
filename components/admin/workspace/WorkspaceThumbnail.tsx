import Image from "next/image";

export function WorkspaceThumbnail({
  src,
  size = "row",
  fallback,
}: {
  src: string | null;
  size?: "row" | "card";
  fallback: React.ReactNode;
}) {
  const className =
    size === "row"
      ? "h-10 w-12 border-2 border-line shadow-[2px_2px_0_var(--foreground)]"
      : "aspect-[16/9] w-full border-b-2 border-line";

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-admin-wash ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          width={size === "row" ? 48 : 640}
          height={size === "row" ? 40 : 360}
          unoptimized
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="grid h-full w-full place-items-center bg-surface">
          {fallback}
        </span>
      )}
    </div>
  );
}
