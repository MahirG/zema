import type { Metadata } from "next";
import { WalletView } from "@/components/wallet/wallet-view";

export const metadata: Metadata = { title: "Wallet" };
export default function WalletPage(): React.JSX.Element { return <WalletView />; }
