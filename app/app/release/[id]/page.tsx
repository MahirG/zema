import type { Metadata } from "next";
import { ReleaseDetail } from "@/components/music/release-detail";

export const metadata: Metadata = { title: "Release" };
export default async function ReleasePage({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> { const { id } = await params; return <ReleaseDetail releaseId={id} />; }
