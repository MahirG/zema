"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }): React.JSX.Element {
  return <main className="route-error" id="main-content"><div><AlertTriangle aria-hidden="true" /><span className="eyebrow">Something slipped off beat</span><h1>This screen could not load.</h1><p>Your browser data is still safe. Try this view again.</p><Button onClick={reset}><RotateCw aria-hidden="true" />Try again</Button></div></main>;
}
