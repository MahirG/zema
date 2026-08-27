import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: "Terms" };
export default function TermsPage(): React.JSX.Element { return <LegalPage type="terms" />; }
