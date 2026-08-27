import type { Locale } from "@/lib/domain/types";

export interface LocalizedText {
  en: string;
  am: string;
}

export const t = (value: LocalizedText, locale: Locale): string => value[locale];

export const marketingNav = [
  { href: "/#distribution", label: { en: "Distribution", am: "ስርጭት" } },
  { href: "/#publishing", label: { en: "Publishing", am: "ኅትመት" } },
  { href: "/pricing", label: { en: "Pricing", am: "ዋጋ" } },
  { href: "/#company", label: { en: "Company", am: "ኩባንያ" } },
] satisfies Array<{ href: string; label: LocalizedText }>;

export const heroCopy = {
  badge: { en: "Built in Addis Ababa for African artists", am: "ለአፍሪካ አርቲስቶች በአዲስ አበባ የተሰራ" },
  title: { en: "Your music, everywhere.", am: "ሙዚቃህ በሁሉም ቦታ።" },
  accent: { en: "Royalties, home.", am: "ገቢህ ወደ አገርህ።" },
  description: {
    en: "Distribute Ethiopian music to Spotify, Apple Music and 150+ platforms. Collect royalties. Get paid in birr — Telebirr, Chapa or bank.",
    am: "የኢትዮጵያን ሙዚቃ ወደ Spotify፣ Apple Music እና 150+ መድረኮች አድርስ። ሮያሊቲህን ሰብስብ። በብር ተከፈል።",
  },
};

export const howSteps = [
  { title: { en: "Upload", am: "ጫን" }, body: { en: "Add audio and cover art. We validate so DSPs accept it.", am: "ድምጽና ሽፋን ጨምር። መድረኮች እንዳይመልሱት እናረጋግጣለን።" } },
  { title: { en: "We distribute", am: "እናሰራጫለን" }, body: { en: "ISRC and UPC included. Live on every major platform.", am: "ISRC እና UPC ተካቷል። በሁሉም መድረክ ይወጣል።" } },
  { title: { en: "Royalties come in", am: "ገቢ ይገባል" }, body: { en: "We collect what you earn from every stream, in one place.", am: "ከእያንዳንዱ ስትሪም ገቢህን በአንድ ቦታ እንሰበስባለን።" } },
  { title: { en: "Get paid in birr", am: "በብር ተከፈል" }, body: { en: "Cash out to Telebirr, Chapa or bank. Splits pay collaborators.", am: "ወደ ቴሌብር፣ ቻፓ ወይም ባንክ አውጣ። ክፍፍል አጋሮችን ይከፍላል።" } },
] satisfies Array<{ title: LocalizedText; body: LocalizedText }>;

export const featureCopy = [
  { icon: "globe", title: { en: "Global reach", am: "ዓለም አቀፍ ተደራሽነት" }, body: { en: "150+ stores — Spotify, Apple, YouTube, TikTok, Boomplay and more.", am: "150+ መደብሮች — Spotify፣ Apple፣ YouTube፣ TikTok እና ሌሎችም።" } },
  { icon: "money", title: { en: "Paid in birr", am: "በብር መከፈል" }, body: { en: "Withdraw to Telebirr, Chapa, CBE Birr or bank. No foreign account.", am: "ወደ ቴሌብር፣ ቻፓ ወይም ባንክ ውሰድ። የውጭ አካውንት አያስፈልግም።" } },
  { icon: "users", title: { en: "Fair splits", am: "ፍትሃዊ ክፍፍል" }, body: { en: "Set percentages for writers, producers, features. Auto-paid.", am: "ለጸሐፊዎችና ፕሮዲውሰሮች መቶኛ አስቀምጥ። በራሱ ይከፈላል።" } },
  { icon: "chart", title: { en: "Real analytics", am: "ትክክለኛ ትንታኔ" }, body: { en: "Streams, earnings and where fans are — by platform and country.", am: "ስትሪም፣ ገቢና አድናቂዎች የት እንዳሉ — በመድረክና በአገር።" } },
  { icon: "shield", title: { en: "You keep your rights", am: "መብትህ ያንተ" }, body: { en: "Masters stay yours. Transparent contracts, no lock-in.", am: "ማስተርህ ያንተ ነው። ግልጽ ውል፣ ማሰሪያ የለም።" } },
  { icon: "language", title: { en: "In your language", am: "በቋንቋህ" }, body: { en: "Amharic, Afaan Oromo, Tigrinya, Somali and more.", am: "አማርኛ፣ አፋን ኦሮሞ፣ ትግርኛ፣ ሶማልኛ እና ሌሎችም።" } },
] satisfies Array<{ icon: string; title: LocalizedText; body: LocalizedText }>;
