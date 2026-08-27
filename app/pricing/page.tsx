import type { Metadata } from "next";
import { PricingPage } from "@/components/marketing/pricing-page";

export const metadata: Metadata = { title: "Pricing", description: "Clear early-access pricing for Zema music distribution and birr payouts." };
export default function PricingRoute(): React.JSX.Element { return <PricingPage />; }
