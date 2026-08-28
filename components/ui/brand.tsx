import Image from "next/image";
import Link from "next/link";
import { INTERFACE_LANGUAGE_SWITCH_ENABLED } from "@/lib/config/interface";
import { cn } from "@/lib/utils";

export function Brand({ compact = false, className }: { compact?: boolean; className?: string }): React.JSX.Element {
  return (
    <Link href="/" className={cn("brand", className)} aria-label="Zema home">
      <Image src="/zema-mark.svg" alt="" width={28} height={28} priority />
      {!compact && <><span>Zema</span>{INTERFACE_LANGUAGE_SWITCH_ENABLED && <small lang="am">ዜማ</small>}</>}
    </Link>
  );
}
