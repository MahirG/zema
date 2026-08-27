import type { Metadata } from "next";
import { RoyaltiesView } from "@/components/royalties/royalties-view";

export const metadata: Metadata = { title: "Royalties" };
export default function RoyaltiesPage(): React.JSX.Element { return <RoyaltiesView />; }
