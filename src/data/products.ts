import silverProduct1 from "@/assets/silver-product-1.jpg";
import silverProduct2 from "@/assets/silver-product-2.jpg";
import silverProduct3 from "@/assets/silver-product-3.jpg";
import goldProduct1 from "@/assets/gold-product-1.jpg";
import goldProduct2 from "@/assets/gold-product-2.jpg";
import goldProduct3 from "@/assets/gold-product-3.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "silver" | "gold";
  description: string;
}

export const silverProducts: Product[] = [
  {
    id: "s1",
    name: "Minimalist Cuff Bracelet",
    price: 185.00,
    image: silverProduct1,
    category: "silver",
    description: "A sleek, polished 925 sterling silver cuff bracelet. Minimalist design meets modern elegance.",
  },
  {
    id: "s2",
    name: "Crystal Drop Earrings",
    price: 145.00,
    image: silverProduct2,
    category: "silver",
    description: "Delicate teardrop earrings in 925 sterling silver with crystal accents. Effortless sophistication.",
  },
  {
    id: "s3",
    name: "Petite Pendant Necklace",
    price: 165.00,
    image: silverProduct3,
    category: "silver",
    description: "A dainty sterling silver chain featuring a hand-polished pendant. Understated luxury.",
  },
];

export const goldProducts: Product[] = [
  {
    id: "g1",
    name: "Cuban Link Bracelet",
    price: 295.00,
    image: goldProduct1,
    category: "gold",
    description: "Bold 18k gold vermeil Cuban link bracelet. Statement luxury with Mediterranean warmth.",
  },
  {
    id: "g2",
    name: "Classic Hoop Earrings",
    price: 225.00,
    image: goldProduct2,
    category: "gold",
    description: "Timeless gold vermeil hoops with a high-polish finish. The perfect everyday luxury.",
  },
  {
    id: "g3",
    name: "Heritage Signet Ring",
    price: 265.00,
    image: goldProduct3,
    category: "gold",
    description: "An intricately engraved gold vermeil signet ring. Heirloom-worthy craftsmanship.",
  },
];
