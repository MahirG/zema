"use client";

import { Disc3, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/app-shell/page-header";
import { AlbumArt } from "@/components/ui/album-art";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { selectCurrentUser, useZemaStore } from "@/lib/store/zema-store";

export function MusicCatalog(): React.JSX.Element {
  const db = useZemaStore((state) => state.db);
  const user = useZemaStore(selectCurrentUser);
  const [query, setQuery] = useState("");
  const releases = useMemo(() => db.releases.filter((release) => release.ownerId === user?.id && release.title.toLowerCase().includes(query.toLowerCase())), [db.releases, query, user?.id]);
  const allCount = db.releases.filter((release) => release.ownerId === user?.id).length;
  return (
    <>
      <PageHeader title="My Music" eyebrow="Catalog" action={<Link href="/app/release/new" className={buttonStyles({ size: "sm" })}><Plus aria-hidden="true" />New Release</Link>} />
      <Panel>
        <PanelHeader title={`${allCount} release${allCount === 1 ? "" : "s"}`} description="Your full catalog, identifiers and delivery states." action={<div className="catalog-search"><Search aria-hidden="true" /><label htmlFor="catalog-search" className="sr-only">Search catalog</label><input id="catalog-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search music" /></div>} />
        {releases.length ? <div className="release-list">{releases.map((release) => { const tracks = db.tracks.filter((track) => track.releaseId === release.id); const liveStores = db.deliveries.filter((delivery) => delivery.releaseId === release.id && delivery.status === "live").length; return <article className="release-row catalog-row" key={release.id}><AlbumArt title={release.title} size="md" /><div className="release-row-main"><strong>{release.title}</strong><span>{release.type} · {tracks.length} track{tracks.length === 1 ? "" : "s"} · {release.primaryArtist}</span><small>{release.upc ? `UPC ${release.upc}` : "UPC assigned at submit"} · {liveStores ? `${liveStores} stores live` : "Not live yet"}</small></div><StatusBadge status={release.status} /><Link href={`/app/release/${release.id}`} aria-label={`Open ${release.title}`} /></article>; })}</div> : <EmptyState icon={Disc3} title={query ? "No matching releases." : "No releases yet."} description={query ? "Try another title or clear your search." : "Build your first release, set splits and watch it deliver."} action={query ? <button type="button" className={buttonStyles({ variant: "ghost", size: "sm" })} onClick={() => setQuery("")}>Clear search</button> : <Link href="/app/release/new" className={buttonStyles({ size: "sm" })}>Create your first release</Link>} />}
      </Panel>
    </>
  );
}
