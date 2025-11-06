import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import useFetchAllLostItems from "@/hooks/usefetchallLostItems";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog.tsx";
import {toast} from "sonner"
import { setLostItems } from "@/redux/lostitemSlice.ts";
import { useEffect } from "react";
import { useFilterLostItems } from "@/hooks/useFilterLostItems.tsx";
import useFetchAllFoundItems from "@/hooks/usefetchallFoundItems.tsx";



const LostItems = () => {
  
    const { refetchItems } = useFetchAllLostItems();


     const filterItems = useFilterLostItems();

     const Spinner = () => (
       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
     );

  const dispatch = useDispatch();
  const [Dialogactive,setDialogactive]= useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const[item,setitem] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    dateLost: "",
    location: "",
    image: null,
  });


  const [filters, setFilters] = useState({
    title: "",
    category: "",
    location: "",
    dateFrom: "",
    dateTo: "",
    isFound: "",
  });

  useEffect(() => {
    applyFilters();
  }, []);


  const handleFilterChange = (e: any) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  

  const applyFilters = async () => {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "") params.append(key, value);
      });
         
      const finalstring = params.toString();
      const res = await filterItems(finalstring);

      if (res.data.success) {
        dispatch(setLostItems(res.data.data));
        console.log("Filtered items:", res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  





  
   
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

  
    const cardClickHandler = async(id:any)=>{
      try {
        const res = await axios.get(`/api/v1/lost-item/${id}`,{withCredentials:true});
        if(res.data.success){
          setitem(res.data.data);
          setDialogactive(true);
        }
        
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }


   const [foundloading,setfoundloading]= useState(false);
    const claimHandler = async(id:any)=>{
     try {
        setfoundloading(true);
       const res = await axios.put(`/api/v1/lost-item/found/${id}`,{},{withCredentials:true});

      if (res.data.success){

        refetchItems()

        
        setitem(res.data.data);

        toast.success("Item marked found and reporter notified");
      }
      
     } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
     }
     finally{
      
      setfoundloading(false)
     }
    }

  const [loadingReport,setloadingReport] = useState(false);
  


  // 🚀 Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setloadingReport(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await axios.post("/api/v1/lost-item/create", formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        await refetchItems()
        toast.success("Lost item reported successfully!");
        setShowAddModal(false);
        
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    finally{
      setloadingReport(false);
      setForm({
        title: "",
        description: "",
        category: "Other",
        dateLost: "",
        location: "",
        image: null,
      });
    }
  };


const lostItems = useSelector((store: any) => store.lostitem.lostItems);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-red-600">Lost Items</h1>
            <p className="text-muted-foreground">
              Report your lost items and help others find them.
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="gap-2 bg-red-500 hover:bg-red-600 text-white"
          >
            <Plus className="h-4 w-4" />
            Report Lost Item
          </Button>
        </div>

        {/*Filter Card ha */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {/* Title Input */}
          <input
            name="title"
            placeholder="Search Title"
            onChange={handleFilterChange}
            value={filters.title}
            className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300"
          />

          {/* Location Input */}
          <input
            name="location"
            placeholder="Location"
            onChange={handleFilterChange}
            value={filters.location}
            className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300"
          />

          {/* Category Select */}
          <div className="relative">
            <select
              name="category"
              onChange={handleFilterChange}
              value={filters.category}
              className="w-full border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white appearance-none pr-8"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Documents">Documents</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
              <option value="Other">Other</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
              ▼
            </span>
          </div>

          {/* Date From */}
          <input
            type="date"
            name="dateFrom"
            onChange={handleFilterChange}
            value={filters.dateFrom}
            className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
          />

          {/* Date To */}
          <input
            type="date"
            name="dateTo"
            onChange={handleFilterChange}
            value={filters.dateTo}
            className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
          />

          {/* Is Found Select */}
          <div className="relative">
            <select
              name="isFound"
              onChange={handleFilterChange}
              value={filters.isFound}
              className="w-full border p-2 rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white appearance-none pr-8"
            >
              <option value="">All</option>
              <option value="true">Found</option>
              <option value="false">Not Found</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
              ▼
            </span>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <Button
            onClick={applyFilters}
            className="bg-red-500  hover:bg-red-400 text-white"
          >
            Apply Filters
          </Button>
          <Button
            variant="secondary"
            className="bg-red-500 text-white hover:bg-red-400"
            onClick={async () => {
              // reset inputs
              setFilters({
                title: "",
                category: "",
                location: "",
                dateFrom: "",
                dateTo: "",
                isFound: "",
              });

              // ✅ reset results in UI
              const res = await filterItems(""); // empty params = get all
              if (res.data.success) {
                dispatch(setLostItems(res.data.data));
              }
            }}
          >
            Reset Filters
          </Button>
        </div>

        {/* Items Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {lostItems?.length === 0 ? (
            <p>No lost items yet.</p>
          ) : (
            lostItems?.map((item: any) => (
              <Card
                key={item._id}
                className="hover:shadow-lg transition-all"
                onClick={() => cardClickHandler(item._id)}
              >
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
                    <strong>Lost at:</strong> {item.location}
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
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                {loadingReport && <Spinner />}
                {loadingReport ? "Reporting Your item..." : "Report Lost Item"}
              </Button>
            </div>
          </form>
        </div>
      )}
      <Dialog open={Dialogactive} onOpenChange={setDialogactive}>
        <DialogContent className="max-w-lg w-[90%] max-h-[80vh] overflow-y-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
          {item ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">
                  {item.title}
                </DialogTitle>
                <DialogDescription className="text-gray-700 dark:text-gray-300">
                  {item.description}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 mt-4">
                <img
                  src={item.image?.url}
                  alt={item.title}
                  className="w-full rounded-lg object-cover"
                />

                <div className="text-sm space-y-1">
                  <p className="text-gray-800 dark:text-gray-100">
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p className="text-gray-800 dark:text-gray-100">
                    <strong>Date Lost:</strong>{" "}
                    {new Date(item.dateLost).toDateString()}
                  </p>
                  <p className="text-gray-800 dark:text-gray-100">
                    <strong>Location:</strong> {item.location}
                  </p>

                  <div>
                    <Button
                      className="w-full p-1 mt-2 bg-green-500 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-500 text-white"
                      onClick={() => claimHandler(item._id)}
                      disabled={item.isFound || foundloading}
                    >
                      {foundloading ? (
                        <>
                          <Spinner /> Marking as Found...
                        </>
                      ) : item.isFound ? (
                        "Found"
                      ) : (
                        "Mark as Found!"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <strong>Reporter's Info:</strong>
                  </p>

                  <div className="flex items-center gap-3">
                    <img
                      src={item.user?.avatar?.url || "/default-avatar.png"}
                      alt={item.user?.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                        {item.user?.fullName || "Unknown Seller"}
                      </p>
                      <p className="text-gray-500 dark:text-gray-300 text-sm">
                        📧 {item.user?.email || "No email provided"}
                      </p>
                      <p className="text-gray-500 dark:text-gray-300 text-sm">
                        📞 {item.user?.phone || "No phone available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="secondary"
                    className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          ) : (
            <p className="text-center py-4 text-gray-700 dark:text-gray-300">
              Loading item details...
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LostItems;
