import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import useFetchAllLostItems from "@/hooks/usefetchallLostItems";
import axios from "axios";

const LostItems = () => {
  useFetchAllLostItems();
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    dateLost: "",
    location: "",
    image: null,
  });

  const lostItems = useSelector((state: any) => state.lostitem.lostItems);
   
  // 🧾 Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 📸 Handle image file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setForm({ ...form, image: file });
  };




  // 🚀 Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await axios.post("/api/v1/lost-item/create", formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        alert("Lost item reported successfully!");
        setShowAddModal(false);
        
      }
    } catch (error: any) {
      console.error("Error reporting item:", error);
      alert("Failed to report lost item");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-purple-700">
              Lost Items
            </h1>
            <p className="text-muted-foreground">
              Report your lost items and help others find them.
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4" />
            Report Lost Item
          </Button>
        </div>

        {/* Items Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {lostItems.length === 0 ? (
            <p>No lost items yet.</p>
          ) : (
            lostItems.map((item: any) => (
              <Card key={item._id} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <img
                    src={item.image?.url}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground mb-2">
                    {item.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Lost at: {item.location}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Simple Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4"
          >
            <h2 className="text-2xl font-semibold mb-4">Report Lost Item</h2>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option>Electronics</option>
              <option>Documents</option>
              <option>Clothing</option>
              <option>Accessories</option>
              <option>Other</option>
            </select>

            <input
              type="date"
              name="dateLost"
              value={form.dateLost}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />

            <input type="file" accept="image/*" onChange={handleFileChange} />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                onClick={() => setShowAddModal(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LostItems;
