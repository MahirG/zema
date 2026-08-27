import { Music2 } from "lucide-react";
import type { IconType } from "react-icons";
import { SiApplemusic, SiAudiomack, SiDeezer, SiSpotify, SiTidal, SiTiktok, SiYoutubemusic } from "react-icons/si";
import { ALL_MARKETING_DSP_NAMES } from "@/lib/domain/constants";

const logoMap: Partial<Record<(typeof ALL_MARKETING_DSP_NAMES)[number], IconType>> = {
  Spotify: SiSpotify,
  "Apple Music": SiApplemusic,
  "YouTube Music": SiYoutubemusic,
  TikTok: SiTiktok,
  Audiomack: SiAudiomack,
  Deezer: SiDeezer,
  Tidal: SiTidal,
};

export function DspCloud(): React.JSX.Element {
  return (
    <div className="dsp-cloud" aria-label="Supported streaming platforms">
      {ALL_MARKETING_DSP_NAMES.map((name) => {
        const Logo = logoMap[name] ?? Music2;
        return <span className="dsp-chip" key={name}><Logo aria-hidden="true" />{name}</span>;
      })}
    </div>
  );
}
