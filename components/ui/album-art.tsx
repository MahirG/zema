import Image from "next/image";
import { cn } from "@/lib/utils";

export function AlbumArt({ title, size = "md", className }: { title: string; size?: "sm" | "md" | "lg"; className?: string }): React.JSX.Element {
  return (
    <div className={cn("album-art", `album-art-${size}`, className)} aria-label={`${title} cover art`} role="img">
      <span className="album-rings" aria-hidden="true" />
      <Image src="/zema-mark.svg" alt="" width={50} height={50} />
      <span className="album-title">{title}</span>
    </div>
  );
}
