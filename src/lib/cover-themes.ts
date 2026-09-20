export interface CoverTheme {
  id: string;
  name: string;
  subtitle: string;
  category: "art" | "classic";
  imageUrl?: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  ribbonColor: string;
  tagline?: string;
}

export const COVER_THEMES: CoverTheme[] = [
  {
    id: "embossed-leather",
    name: "Heirloom Embossed Leather",
    subtitle: "Embossed feather into flight with leather wrap strap",
    category: "art",
    imageUrl: "/covers/embossed-leather.png",
    bgColor: "bg-[#38261A]",
    borderColor: "border-[#6E4F36]",
    accentColor: "text-[#FAF5ED]",
    ribbonColor: "bg-[#C49E4F]",
    tagline: "A journey of a thousand miles begins with a single step",
  },
  {
    id: "rain-forest",
    name: "Raindrop Forest Journal",
    subtitle: "Lush watercolor foliage, dewdrops & serene forest rain",
    category: "art",
    imageUrl: "/covers/rain-forest.png",
    bgColor: "bg-[#1E3326]",
    borderColor: "border-[#3A5C46]",
    accentColor: "text-[#E6F3EA]",
    ribbonColor: "bg-[#548762]",
    tagline: "Let the rain wash away your worries and water your soul",
  },
  {
    id: "writer-celestial",
    name: "I Am A Writer (Midnight)",
    subtitle: "Celestial night sky, parchment scroll, inkwell & books",
    category: "art",
    imageUrl: "/covers/writer-celestial.png",
    bgColor: "bg-[#162238]",
    borderColor: "border-[#2D456E]",
    accentColor: "text-[#EBF1FA]",
    ribbonColor: "bg-[#E5C78B]",
    tagline: "Words inscribed under the quiet starlight",
  },
  {
    id: "creative-typewriter",
    name: "Creative Writing Retro",
    subtitle: "Vintage typewriter, artistic watercolors & inspiration swirls",
    category: "art",
    imageUrl: "/covers/creative-typewriter.png",
    bgColor: "bg-[#1B363B]",
    borderColor: "border-[#325E66]",
    accentColor: "text-[#EAF7FA]",
    ribbonColor: "bg-[#D89A38]",
    tagline: "Where imagination meets the tactile stroke of a key",
  },
  {
    id: "burgundy",
    name: "Royal Burgundy Leather",
    subtitle: "Deep wine red with aged gold leaf trim",
    category: "classic",
    bgColor: "bg-[#3D1E24]",
    borderColor: "border-[#572B33]",
    accentColor: "text-[#EBD3D7]",
    ribbonColor: "bg-[#9E5764]",
  },
  {
    id: "forest",
    name: "Emerald Forest Leather",
    subtitle: "Deep moss green with brass hardware",
    category: "classic",
    bgColor: "bg-[#25392B]",
    borderColor: "border-[#38523F]",
    accentColor: "text-[#D3E4D6]",
    ribbonColor: "bg-[#7BA082]",
  },
  {
    id: "navy",
    name: "Midnight Navy Leather",
    subtitle: "Dark indigo ocean leather with silver foil",
    category: "classic",
    bgColor: "bg-[#1E2B3D]",
    borderColor: "border-[#2B3E57]",
    accentColor: "text-[#D2E0F2]",
    ribbonColor: "bg-[#5677A3]",
  },
  {
    id: "leather",
    name: "Classic Oak Leather",
    subtitle: "Warm tanned rustic saddle leather",
    category: "classic",
    bgColor: "bg-[#38261A]",
    borderColor: "border-[#523B2A]",
    accentColor: "text-[#FAF5ED]",
    ribbonColor: "bg-[#C49E4F]",
  },
];

export function getCoverTheme(id: string): CoverTheme {
  return COVER_THEMES.find((t) => t.id === id) || COVER_THEMES[0];
}
