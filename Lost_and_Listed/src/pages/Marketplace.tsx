import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ItemCard from '@/components/ItemCard';
import AddItemModal from '@/components/AddItemModal';
import ItemDetailModal from '@/components/ItemDetailModal';
import FiltersPanel from '@/components/FiltersPanel';
import { useApp, Item } from '@/contexts/AppContext';
import Navbar from '@/components/Navbar';

const Marketplace = () => {
  const { items, user } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredItems = items
    .filter(item => {
      if (item.type !== 'marketplace') return false;
      if (category !== 'all' && item.category !== category) return false;
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date-desc':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const handleAddClick = () => {
    if (!user) {
      alert('Please sign in to list an item');
      return;
    }
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">
            Buy and sell second-hand items within your college community
          </p>
        </div>

        <div className="mb-6">
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            List an Item
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <FiltersPanel
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              category={category}
              onCategoryChange={setCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </aside>

          <main>
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                <p className="text-lg font-medium mb-2">No items found</p>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or be the first to list an item
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <AddItemModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        type="marketplace"
      />

      <ItemDetailModal
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      />
    </div>
  );
};

export default Marketplace;
