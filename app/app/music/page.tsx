import type { Metadata } from "next";
import { MusicCatalog } from "@/components/music/music-catalog";

export const metadata: Metadata = { title: "My Music" };
export default function MusicPage(): React.JSX.Element { return <MusicCatalog />; }
