import {
  Smartphone,
  Laptop,
  Tv,
  Camera,
  Headphones,
  Watch,
  Shirt,
  ShoppingBag,
  Home,
  Dumbbell,
  Gamepad2,
  Book,
  Car,
  Utensils,
  Package
} from "lucide-react";

export function getCategoryIcon(name: string, className?: string) {
  const normalized = name.toLowerCase();

  if (normalized.includes("phone") || normalized.includes("mobile")) return <Smartphone className={className} />;
  if (normalized.includes("laptop") || normalized.includes("computer") || normalized.includes("pc")) return <Laptop className={className} />;
  if (normalized.includes("tv") || normalized.includes("television")) return <Tv className={className} />;
  if (normalized.includes("camera") || normalized.includes("photo")) return <Camera className={className} />;
  if (normalized.includes("audio") || normalized.includes("headphone") || normalized.includes("earphone")) return <Headphones className={className} />;
  if (normalized.includes("watch") || normalized.includes("wearable")) return <Watch className={className} />;
  if (normalized.includes("fashion") || normalized.includes("clothing") || normalized.includes("shirt")) return <Shirt className={className} />;
  if (normalized.includes("bag") || normalized.includes("luggage")) return <ShoppingBag className={className} />;
  if (normalized.includes("home") || normalized.includes("appliance") || normalized.includes("furniture")) return <Home className={className} />;
  if (normalized.includes("fitness") || normalized.includes("sport") || normalized.includes("gym")) return <Dumbbell className={className} />;
  if (normalized.includes("game") || normalized.includes("console")) return <Gamepad2 className={className} />;
  if (normalized.includes("book")) return <Book className={className} />;
  if (normalized.includes("auto") || normalized.includes("car") || normalized.includes("bike")) return <Car className={className} />;
  if (normalized.includes("kitchen") || normalized.includes("cook")) return <Utensils className={className} />;

  // Default fallback icon
  return <Package className={className} />;
}
