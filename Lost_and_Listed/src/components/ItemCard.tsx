import { useState } from "react";
import { MapPin, Calendar, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  image: string;
  price?: number;
  type: "lost" | "found" | "marketplace";
}

interface ItemCardProps {
  item: Item;
  onClick: () => void;
}

const ItemCard = ({ item, onClick }: ItemCardProps) => {
  // Local wishlist logic (temporary; you’ll replace with your backend or Redux)
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents triggering onClick (opening modal, etc.)
    setIsWishlisted(!isWishlisted);
  };

  // Category color logic (kept same for visual consistency)
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      electronics: "bg-primary/10 text-primary",
      clothing: "bg-accent/10 text-accent",
      books: "bg-blue-500/10 text-blue-600",
      accessories: "bg-purple-500/10 text-purple-600",
      furniture: "bg-green-500/10 text-green-600",
      other: "bg-muted text-muted-foreground",
    };
    return colors[category] || colors.other;
  };

  const getTypeLabel = (type: string) => {
    if (type === "lost") return "Lost";
    if (type === "found") return "Found";
    return null;
  };

  return (
    <Card
      className="group overflow-hidden transition-all hover:shadow-hover cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />

        {/* Lost/Found badge */}
        {item.type !== "marketplace" && (
          <Badge
            className={`absolute top-2 left-2 ${
              item.type === "lost"
                ? "bg-destructive text-destructive-foreground"
                : "bg-green-600 text-white"
            }`}
          >
            {getTypeLabel(item.type)}
          </Badge>
        )}

        {/* Wishlist (marketplace only) */}
        {item.type === "marketplace" && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted ? "fill-current text-destructive" : ""
              }`}
            />
          </Button>
        )}
      </div>

      {/* Item content */}
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge
            variant="secondary"
            className={getCategoryColor(item.category)}
          >
            {item.category}
          </Badge>

          {item.price && (
            <span className="ml-auto text-lg font-bold text-primary">
              ${item.price}
            </span>
          )}
        </div>

        <h3 className="mb-2 font-semibold text-lg line-clamp-1">
          {item.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {item.description}
        </p>
      </CardContent>

      {/* Footer details */}
      <CardFooter className="p-4 pt-0 gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{item.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{new Date(item.date).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
