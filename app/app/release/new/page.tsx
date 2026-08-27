import type { Metadata } from "next";
import { ReleaseWizard } from "@/components/releases/release-wizard";

export const metadata: Metadata = { title: "New Release" };
export default function NewReleasePage(): React.JSX.Element { return <ReleaseWizard />; }
