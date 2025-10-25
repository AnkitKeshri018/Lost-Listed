import { MapPin, Calendar, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item } from '@/contexts/AppContext';
import { useApp } from '@/contexts/AppContext';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
}

const ItemCard = ({ item, onClick }: ItemCardProps) => {
  const { wishlist, toggleWishlist } = useApp();
  const isWishlisted = wishlist.includes(item.id);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      electronics: 'bg-primary/10 text-primary',
      clothing: 'bg-accent/10 text-accent',
      books: 'bg-blue-500/10 text-blue-600',
      accessories: 'bg-purple-500/10 text-purple-600',
      furniture: 'bg-green-500/10 text-green-600',
      other: 'bg-muted text-muted-foreground',
    };
    return colors[category] || colors.other;
  };

  const getTypeLabel = (type: string) => {
    return type === 'lost' ? 'Lost' : type === 'found' ? 'Found' : null;
  };

  return (
    <Card 
      className="group overflow-hidden transition-all hover:shadow-hover cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {item.type !== 'marketplace' && (
          <Badge 
            className={`absolute top-2 left-2 ${
              item.type === 'lost' 
                ? 'bg-destructive text-destructive-foreground' 
                : 'bg-green-600 text-white'
            }`}
          >
            {getTypeLabel(item.type)}
          </Badge>
        )}
        {item.type === 'marketplace' && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(item.id);
            }}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-destructive' : ''}`} />
          </Button>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary" className={getCategoryColor(item.category)}>
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
