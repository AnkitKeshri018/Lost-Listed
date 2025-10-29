import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const Marketplace = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddClick = () => {
    alert("This feature will allow users to list new items for sale.");
    setShowAddModal(true);
  };

  // Dummy marketplace items
  const dummyItems = [
    {
      id: 1,
      title: "Used Laptop",
      description: "Dell Inspiron, great condition, ₹25,000",
    },
    {
      id: 2,
      title: "Cycle for Sale",
      description: "Decathlon cycle, lightly used, ₹7,000",
    },
    {
      id: 3,
      title: "Study Table",
      description: "Wooden table, perfect for students, ₹2,000",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">
            Buy and sell second-hand items within your college community.
          </p>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            List an Item
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Filters Placeholder */}
          <aside className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <p className="text-sm text-muted-foreground">
              Sorting and category filters will appear here.
            </p>
          </aside>

          {/* Items Grid */}
          <main>
            {dummyItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                <p className="text-lg font-medium mb-2">No items found</p>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or be the first to list an item.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {dummyItems.map((item) => (
                  <Card
                    key={item.id}
                    className="hover:shadow-md transition-all cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
