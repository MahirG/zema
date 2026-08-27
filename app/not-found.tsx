import { ArrowLeft, Music2 } from "lucide-react";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound(): React.JSX.Element { return <main className="route-error" id="main-content"><div><Music2 aria-hidden="true" /><span className="eyebrow">404 · Missing track</span><h1>This page is not in the catalog.</h1><p>Head back to Zema and keep the release moving.</p><Link href="/" className={buttonStyles()}><ArrowLeft aria-hidden="true" />Back home</Link></div></main>; }
