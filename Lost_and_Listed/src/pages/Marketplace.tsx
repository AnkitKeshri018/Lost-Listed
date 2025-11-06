import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog.tsx";

import useFetchAllProducts from "@/hooks/MarketPlace/usefetchallProducts";
import { useDispatch, useSelector } from "react-redux";
import { setproducts } from "@/redux/productSlice";
import { Badge } from "@/components/ui/badge";

const Marketplace = () => {
  const { refetchProducts } = useFetchAllProducts();
  const items = useSelector((store: any) => store.product.products);
  const dispatch = useDispatch();

  const Spinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    price: "",
    condition: "",
    images: [],
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const formData = new FormData();
      for (const key in form) {
        if (key === "images") {
          form.images.forEach((file) => formData.append("images", file));
        } else {
          formData.append(key, form[key]);
        }
      }

      const res = await axios.post("/api/v1/products/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      await refetchProducts();
      toast.success("Product listed successfully!");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to create item");
    } finally {
      setShowAddModal(false);
      setloading(false);
      setForm({
        title: "",
        description: "",
        category: "Other",
        price: "",
        condition: "",
        images: [],
      });
    }
  };

  const [showCardDetails, setshowCardDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    title: "",
    description: "",
    category: "Other",
    price: "",
    condition: "",
    images: [],
    seller:null,
    isSold:false
  });

  const handleCardClick = async (id: any) => {
    try {
      setshowCardDetails(true); //for dialogue box opening wha se hi close hoga
      const res = await axios.get(`/api/v1/products/${id}`);
      setSelectedItem(res.data.product);
    } catch (err) {
      console.error("Failed to fetch item details:", err);
    }
  };



  //for showing multiple images in details card

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (selectedItem?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === selectedItem.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedItem?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedItem.images.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    if (showCardDetails) setCurrentImageIndex(0);
  }, [showCardDetails]);






  //Filters section
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    condition: "",
    priceMin: "",
    priceMax: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    try {
      const query = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key]) query.append(key, filters[key]);
      });

      const res = await axios.get(
        `/api/v1/products/filter?${query.toString()}`,
        {
          withCredentials: true,
        }
      );

      dispatch(setproducts(res.data.products));
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };
  const resetFilters = async () => {
    setFilters({
      title: "",
      category: "",
      condition: "",
      priceMin: "",
      priceMax: "",
    });
    refetchProducts();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-blue-600">
              Marketplace
            </h1>
            <p className="text-muted-foreground">
              Buy and sell second-hand items within your college community.
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4" />
            List an Item
          </Button>
        </div>

        {/* Filter Section */}
        {/* Filter Section */}
        <div className="mb-6">
          {/* Inputs grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-3">
            {/* Title */}
            <input
              name="title"
              placeholder="Search title"
              value={filters.title}
              onChange={handleFilterChange}
              className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300"
            />

            {/* Category */}
            <div className="relative">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white appearance-none pr-8"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Furniture">Accessories</option>
                <option value="Clothing">Clothing</option>
                <option value="Home">Home</option>
                <option value="Other">Other</option>
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
                ▼
              </span>
            </div>

            {/* Condition */}
            <div className="relative">
              <select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                className="w-full border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white appearance-none pr-8"
              >
                <option value="">All Conditions</option>
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="very_good">Very Good</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="for_parts">For Parts</option>
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
                ▼
              </span>
            </div>

            {/* Min Price */}
            <input
              type="number"
              name="priceMin"
              placeholder="Min Price"
              value={filters.priceMin}
              onChange={handleFilterChange}
              className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300"
            />

            {/* Max Price */}
            <input
              type="number"
              name="priceMax"
              placeholder="Max Price"
              value={filters.priceMax}
              onChange={handleFilterChange}
              className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={applyFilters}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            >
              Apply Filters
            </Button>

            <Button
              onClick={resetFilters}
              variant="secondary"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items?.length === 0 ? (
            <p>No items found.</p>
          ) : (
            items?.map((item: any) => (
              <Card
                key={item._id}
                className="hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handleCardClick(item?._id)}
              >
                <CardContent className="p-6">
                  <img
                    src={item.images[0]?.url}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">
                    {item.description}
                  </p>
                  <p className="text-blue-600 font-semibold">₹{item.price}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4"
          >
            <h2 className="text-2xl font-semibold mb-4">List New Item</h2>

            <input
              name="title"
              placeholder="Item Title"
              value={form.title}
              onChange={handleFormChange}
              className="w-full border p-2 rounded"
              required
            />

            <textarea
              name="description"
              placeholder="Item Description"
              value={form.description}
              onChange={handleFormChange}
              className="w-full border p-2 rounded"
            />

            <select
              name="condition"
              value={form.condition}
              onChange={handleFormChange}
              className="w-full border p-2 rounded"
            >
              <option>new</option>
              <option>like_new</option>
              <option>very_good</option>
              <option>good</option>
              <option>fair</option>
              <option>for_parts</option>
            </select>

            <input
              type="number"
              name="price"
              placeholder="Price (₹)"
              value={form.price}
              onChange={handleFormChange}
              required
              className="w-full border p-2 rounded"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleFormChange}
              className="w-full border p-2 rounded"
            >
              <option>Electronics</option>
              <option>Books</option>
              <option>Accessories</option>
              <option>Clothing</option>
              <option>Home</option>
              <option>Other</option>
            </select>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />

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
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                {loading && <Spinner />} {loading ? "Listing..." : "List Item"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <Dialog
          open={showCardDetails}
          onOpenChange={() => setshowCardDetails(false)}
        >
          <DialogContent className="max-w-xl w-[90%] max-h-[80vh] overflow-y-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">
                {selectedItem?.title}
              </DialogTitle>
              <DialogDescription className="text-gray-700 dark:text-gray-300">
                {selectedItem?.description}
              </DialogDescription>
            </DialogHeader>

            {/* Image Carousel */}
            {selectedItem?.images?.length > 0 && (
              <div className="relative w-full flex items-center justify-center">
                <img
                  src={selectedItem?.images[currentImageIndex]?.url}
                  alt={selectedItem?.title}
                  className="w-full rounded-lg my-4 object-contain"
                />

                {/* Left Button */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60"
                >
                  ‹
                </button>

                {/* Right Button */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60"
                >
                  ›
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-3 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {selectedItem.images.length}
                </div>
              </div>
            )}

            <p className="my-2">
              <Badge
                className={`px-5 py-1 text-sm font-semibold rounded-full shadow-md ${
                  selectedItem.isSold
                    ? "bg-red-500 text-white dark:bg-red-600"
                    : "bg-green-500 text-white dark:bg-green-600"
                }`}
              >
                {selectedItem.isSold ? "Sold" : "Available"}
              </Badge>
            </p>

            <p className="text-gray-800 dark:text-gray-100">
              <strong>Price:</strong> ₹{selectedItem?.price}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <strong>Category:</strong> {selectedItem?.category}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <strong>Condition:</strong> {selectedItem?.condition}
            </p>

            {/* Seller Information Section */}
            <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                <strong>Seller's Info:</strong>
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedItem.seller?.avatar?.url || "/default-avatar.png"
                  }
                  alt={selectedItem.seller?.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                    {selectedItem.seller?.fullName || "Unknown Seller"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    📧 {selectedItem.seller?.email || "No email provided"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
                    📞 {selectedItem.seller?.phone || "No phone available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                🛍️ Contact the seller to purchase this item
              </p>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Marketplace;
