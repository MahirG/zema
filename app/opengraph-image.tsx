import { ImageResponse } from "next/og";

export const alt = "Zema — Your music, everywhere. Royalties, home.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage(): ImageResponse {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#f4efe7", backgroundColor: "#0b0a08", backgroundImage: "radial-gradient(circle at 15% 0%, #4a3418 0%, #0b0a08 46%)", padding: "72px 82px", fontFamily: "sans-serif" }}><div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 800, letterSpacing: "-0.04em" }}><div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e8b04b", borderRadius: 15, color: "#e8b04b" }}>Z</div>Zema <span style={{ color: "#9c958a", fontSize: 25 }}>ዜማ</span></div><div style={{ display: "flex", flexDirection: "column" }}><div style={{ maxWidth: 920, display: "flex", flexWrap: "wrap", fontSize: 78, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 1 }}>Your music, everywhere.<br /><span style={{ color: "#e8b04b" }}>Royalties, home.</span></div><div style={{ marginTop: 30, color: "#9c958a", fontSize: 24 }}>Built in Addis Ababa for African artists</div></div><div style={{ display: "flex", justifyContent: "space-between", color: "#736c62", fontSize: 18 }}><span>Distribution · Splits · Royalties · Birr payouts</span><span>Hisab Technologies</span></div></div>, size);
}
