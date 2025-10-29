import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ItemCard from "@/components/ItemCard";
import AddItemModal from "@/components/AddItemModal";

import FiltersPanel from "@/components/FiltersPanel";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const FoundItems = () => {
  // Local States
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [items, setItems] = useState<any[]>([]); // Fetched from your backend
  const [user, setUser] = useState<any>(null); // You can set this from localStorage or JWT later

  // Fetch found items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Example:
        // const res = await axios.get("/api/items?type=found");
        // setItems(res.data);
        console.log("Fetching found items from backend...");
      } catch (error) {
        toast.error("Failed to load items.");
      }
    };
    fetchItems();
  }, []);

  // Filter items by category or search
  const filteredItems = items.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (
      searchQuery &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // Handle Add Found Item
  const handleAddClick = () => {
    if (!user) {
      toast.error("Please sign in to post an item.");
      return;
    }
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-green-600 dark:text-green-500">
            Found Items
          </h1>
          <p className="text-muted-foreground">
            Report items you’ve found and help reunite them with their owners
          </p>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <Button
            onClick={handleAddClick}
            variant="secondary"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Report Found Item
          </Button>
        </div>

        {/* Layout */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Filters */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <FiltersPanel
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              category={category}
              onCategoryChange={setCategory}
            />
          </aside>

          {/* Items Grid */}
          <main>
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                <p className="text-lg font-medium mb-2">
                  No found items reported
                </p>
                <p className="text-muted-foreground">
                  Try adjusting your filters or be the first to report a found
                  item
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <AddItemModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        type="found"
      />

      
    </div>
  );
};

export default FoundItems;
