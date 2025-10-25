import { Mail, MapPin, Calendar, Heart, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Item, useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface ItemDetailModalProps {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ItemDetailModal = ({ item, open, onOpenChange }: ItemDetailModalProps) => {
  const { user, updateItem, deleteItem, wishlist, toggleWishlist } = useApp();
  
  if (!item) return null;

  const isWishlisted = wishlist.includes(item.id);
  const isOwner = user?.id === item.userId;

  const handleMarkAsClaimed = () => {
    updateItem(item.id, { status: 'claimed' });
    toast.success('Item marked as claimed!');
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(item.id);
      toast.success('Item deleted successfully');
      onOpenChange(false);
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className={getCategoryColor(item.category)}>
              {item.category}
            </Badge>
            {item.type !== 'marketplace' && (
              <Badge 
                className={
                  item.type === 'lost' 
                    ? 'bg-destructive text-destructive-foreground' 
                    : 'bg-green-600 text-white'
                }
              >
                {item.type === 'lost' ? 'Lost' : 'Found'}
              </Badge>
            )}
            {item.status === 'claimed' && (
              <Badge variant="outline" className="border-green-600 text-green-600">
                Claimed
              </Badge>
            )}
            {item.price && (
              <span className="ml-auto text-2xl font-bold text-primary">
                ${item.price}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold text-lg">Description</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Contact: {item.contactInfo}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {item.type === 'marketplace' && !isOwner && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => toggleWishlist(item.id)}
              >
                <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? 'fill-current text-destructive' : ''}`} />
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            )}
            
            {item.type !== 'marketplace' && isOwner && item.status === 'active' && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleMarkAsClaimed}
              >
                Mark as {item.type === 'lost' ? 'Found' : 'Claimed'}
              </Button>
            )}

            {isOwner && (
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}

            {!isOwner && (
              <Button className="flex-1">
                <Mail className="mr-2 h-4 w-4" />
                Contact Seller
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailModal;
