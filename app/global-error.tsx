"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }): React.JSX.Element {
  return <html lang="en"><body><main className="route-error"><div><h1>Zema needs another beat.</h1><p>The application could not finish loading.</p><button className="button button-gold button-md" type="button" onClick={reset}>Reload Zema</button></div></main></body></html>;
}
