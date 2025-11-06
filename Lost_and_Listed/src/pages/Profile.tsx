import { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setuserClaimedItems, setuserMarkedfoundItems } from "@/redux/authSlice";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Upload,
  PencilLine,
  Loader2,
  KeyRound,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import useGetallUserLostItems from "@/hooks/useGetallUserLostItems";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/Navbar";
import useGetallUserFoundItems from "@/hooks/useGetallUserFoundItems";
import usefetchUserClaimedItems from "@/hooks/usefetchUserClaimedItems";
import usefetchUserMarkedItems from "@/hooks/usefetchUserMarkedItems";
import store from "@/redux/store";
import useFetchAllUserProducts from "@/hooks/MarketPlace/usefetchUserProducts";




const Profile = () => {
  //Lost item Handlers
  const { refetchItems } = useGetallUserLostItems();
  const lostItems = useSelector((store: any) => store.lostitem.userlostItems);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    dateLost: "",
    location: "",
    isFound: false,
    image: null,
  });

  //Found Item Handlers

  const { refetchFoundItems } = useGetallUserFoundItems();
  const foundItems = useSelector(
    (store: any) => store.founditem.userfoundItems
  );
  const [openFoundUpdate, setOpenFoundUpdate] = useState(false);
  const [currentFoundItem, setCurrentFoundItem] = useState<any>(null);
  const [foundFormData, setfoundFormData] = useState({
    title: "",
    description: "",
    category: "",
    dateFound: "",
    location: "",
    isClaimed: false,
    image: null,
  });

  const handleFoundUpdate = async (item: any) => {
    setCurrentFoundItem(item);
    setfoundFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      dateFound: item.dateLost,
      location: item.location,
      isClaimed: item.isFound,
      image: null,
    });
    setOpenFoundUpdate(true);
  };

  const [FoundLoading,setFoundLoading]=useState(false);
  const submitFoundUpdate = async () => {
    try {
      setFoundLoading(true);
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (foundFormData[key] !== null) fd.append(key, foundFormData[key]);
      });

      await axios.put(`/api/v1/found-item/update/${currentFoundItem._id}`, fd, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

    
      refetchFoundItems();
    } catch (error) {
      console.log(error);
    }
    finally{
      setOpenFoundUpdate(false);
      setFoundLoading(false);
    }
  };

  const [selectedClaimer, setSelectedClaimer] = useState(null);
  const [openClaimerInfo, setOpenClaimerInfo] = useState(false);

  const handleViewClaimer = async (item: any) => {
    setSelectedClaimer(item.claimedBy); // foundBy already has fullName,
    //  email, phoneNumber
    setOpenClaimerInfo(true);
  };

  const handleFoundDeleteItem = async (item: any) => {
    try {
      const res = await axios.delete(`/api/v1/found-item/delete/${item._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.message("Item deleted Successfully");
        refetchFoundItems();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  // Profile Header Handlers
  const { user } = useSelector((store: any) => store.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("lost");
  const [editData, setEditData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleInfoChange = (e: any) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e: any) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleInfoUpdate = async () => {
    try {
      const res = await axios.put(`/api/v1/user/update-profile`, editData, {
        withCredentials: true,
      });
      dispatch(setUser(res.data.user));
      toast.success("Profile info updated!");
      setEditOpen(false);
    } catch {
      toast.error("Failed to update profile info.");
    }
  };

  const handleAvatarUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);

    try {
      const res = await axios.put(`/api/v1/user/update-avatar`, formData, {
        withCredentials: true,
      });
      dispatch(setUser(res.data.user));
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Failed to update avatar.");
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.currentPassword || !passwords.newPassword)
      return toast.error("Please fill in both fields");

    setUpdatingPassword(true);
    try {
      await axios.put(`/api/v1/user/update-password`, passwords, {
        withCredentials: true,
      });
      toast.success("Password updated!");
      setPasswordOpen(false);
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Error updating password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Lost item Handlers

  const handleUpdate = (item: any) => {
    setCurrentItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      dateLost: item.dateLost,
      location: item.location,
      isFound: item.isFound,
      image: null,
    });
    setOpenUpdate(true);
  };

  const [LostLoading,setLostLoading]=useState(false);
  const submitUpdate = async () => {
    try {
      setLostLoading(true);
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) fd.append(key, formData[key]);
      });

      await axios.put(`/api/v1/lost-item/update/${currentItem._id}`, fd, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      
      refetchItems();
    } catch (error) {
      console.log(error);
    }
    finally{
      setOpenUpdate(false);
      setLostLoading(false);
    }
  };

  const [selectedFinder, setSelectedFinder] = useState(null);
  const [open, setOpen] = useState(false);

  const handleViewFinder = (item: any) => {
    setSelectedFinder(item.foundBy); // foundBy already has fullName,
    //  email, phoneNumber
    console.log(selectedFinder);
    setOpen(true);
  };

  const handleDeleteItem = async (item: any) => {
    try {
      const res = await axios.delete(`/api/v1/lost-item/delete/${item._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.message("Item deleted Successfully");
        refetchItems();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  //Claims activity

  const { fetchClaimedItems } = usefetchUserClaimedItems();
  const { fetchMarkedItems } = usefetchUserMarkedItems();
 
  const markedItems = useSelector(
    (store: any) => store.auth.userMarkedfoundItems
  );

  const claimedItems = useSelector((store: any) => store.auth.userClaimedItems);



  const [claimsTab, setClaimsTab] = useState("claimed");


 const handleWithdrawClaim = async (id:any) => {
   try {
       
     dispatch(
       setuserClaimedItems(claimedItems.filter((item:any) => item._id !== id))
     );
    
      await axios.put(
       `/api/v1/found-item/unclaim/${id}`,
       {},
       { withCredentials: true }
     );
     toast.success("Claim withdraw successfull")
     await fetchClaimedItems();

   } catch (err) {
     console.log(err);
     toast.error(err.response?.data?.message || "Failed to withdraw claim");
   }
 };


 const [selectedReporter, setSelectedReporter] = useState(null);
 const [openReporter, setOpenReporter] = useState(false);

 const handleviewReporter = (item: any) => {
   setSelectedReporter(item.user);
   setOpenReporter(true);
 }; 



 const [selectedOwner, setSelectedOwner] = useState(null);
 const [openOwner, setOpenOwner] = useState(false);

 const handleviewOwner = (item: any) => {
   setSelectedOwner(item.user);
   setOpenOwner(true);
 }; 



 const handleUnmarkasFound = async (id: any) => {
  
   try {
    dispatch(
      setuserMarkedfoundItems(markedItems.filter((item:any) => item._id !== id))
    );
     
     await axios.put(
       `/api/v1/lost-item/unmark/${id}`,
       {},
       { withCredentials: true }
     );
     toast.success("Item unmarked as found");
     await fetchMarkedItems();
   } catch (err) {
     console.log(err);
     toast.error(err.response?.data?.message || "Failed to unmark item as found");
   }
 };



 //products activity

  const {refetchUserProducts} = useFetchAllUserProducts();
  const userProducts = useSelector((store:any)=>store.product.userProducts)

 const handleProductDeleteItem = async(item:any)=>{

  try {
    await axios.delete(`/api/v1/products/delete/${item._id}`,{withCredentials:true});
  
    await refetchUserProducts();
    toast.success("Product deleted successfully")
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to delete product"
    );
  }
  
 }


 const [openProductUpdate,setOpenProductUpdate]=useState(false);

 const [userProductForm, setUserProductForm] = useState({
   title:"",
   description:"",
   condition:"",
   price:0,
   category:"",
   images:[]
 })


const [selectedProduct, setSelectedProduct] = useState(null);

 const handleProductUpdate = async (item:any) => {
   setSelectedProduct(item);
   setUserProductForm({
     title:item.title,
     description:item.description,
     condition:item.condition,
     price:item.price,
     category:item.category,
     images: [],
   });
   setOpenProductUpdate(true);
 };


const handleuserProductFormChange = (e) => {
  const { name, type, value, files } = e.target;

  if (type === "file") {
    setUserProductForm((prev) => ({
      ...prev,
      images: Array.from(files), // store multiple files
    }));
  } else {
    setUserProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

const [saveLoading,setSaveLoading] = useState(false);


const submitProductUpdate = async () => {
  try {
    if (!selectedProduct) {
      toast.error("No product selected for update!");
      return;
    }
    setSaveLoading(true);

    const formData = new FormData();

    for (const key in userProductForm) {
      if (key === "images") {
        userProductForm.images.forEach((file) =>
          formData.append("images", file)
        );
      } else {
        formData.append(key, userProductForm[key]);
      }
    }

    const res = await axios.put(
      `/api/v1/products/update/${selectedProduct._id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
     await refetchUserProducts()
    toast.success("Product updated successfully!");
    
  } catch (err) {
    console.error("Error updating product:", err);
    toast.error("Failed to update product");
  }
  finally{
   setOpenProductUpdate(false);
   setSaveLoading(false);

  }
};



  

  










  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        No user data
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Profile Section */}
      <div className="bg-white shadow p-6 rounded-xl flex gap-6 items-center">
        <div className="relative group">
          <img
            src={user.avatar?.url || "/default-avatar.png"}
            className="w-24 h-24 rounded-full border shadow"
          />
          <label
            htmlFor="avatarUpload"
            className="absolute inset-0 flex flex-col justify-center items-center bg-black/40 opacity-0 group-hover:opacity-100 text-white rounded-full cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="text-xs">Update</span>
              </>
            )}
            <input
              id="avatarUpload"
              type="file"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </label>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{user.fullName}</h1>
          <div className="text-sm opacity-70">@{user.username}</div>
          <Badge className="mt-1">Member</Badge>
          <div className="flex items-center gap-3">
            {" "}
            <Phone className="h-5 w-5 text-muted-foreground mt-2" />{" "}
            <span>{user.phone}</span>{" "}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {" "}
            <Mail className="h-5 w-5 text-muted-foreground" />{" "}
            <span>{user.email}</span>{" "}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {" "}
            <MapPin className="h-5 w-5 text-muted-foreground" />{" "}
            <span>{user.location}</span>{" "}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {" "}
            <Calendar className="h-5 w-5 text-muted-foreground" />{" "}
            <span>
              {" "}
              Joined on{" "}
              {new Date(user.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
            </span>{" "}
          </div>

          <div className="mt-3 flex gap-3">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PencilLine className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Info</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    name="fullName"
                    value={editData.fullName}
                    onChange={handleInfoChange}
                    placeholder="fullname"
                  />
                  <Input
                    name="phone"
                    value={editData.phone}
                    onChange={handleInfoChange}
                    placeholder="phone"
                  />
                  <Input
                    name="location"
                    value={editData.location}
                    onChange={handleInfoChange}
                    placeholder="location"
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleInfoUpdate}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <KeyRound className="h-4 w-4 mr-2" /> Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Current"
                  />
                  <Input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New"
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handlePasswordUpdate}>
                    {updatingPassword ? "Updating..." : "Update"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-6 flex gap-3">
        {["lost", "found", "claims", "products"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "lost" && "Lost Items"}
            {tab === "found" && "Found Items"}
            {tab === "claims" && "Claims Activity"}
            {tab == "products" && "Your Products"}
          </Button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="mt-4 bg-white p-6 rounded-xl shadow">
        {/* ✅ Render table headings only if NOT claims */}
        {activeTab !== "claims" && (
          <div className="grid grid-cols-4 font-semibold text-gray-600 border-b pb-2 mb-3">
            <span>Item</span>
            <span>Details</span>
            <span className="text-center">Status</span>
            <span className="text-right">Actions</span>
          </div>
        )}

        {activeTab === "lost" &&
          lostItems?.map((i: any) => (
            <div
              key={i.id}
              className="grid grid-cols-4 items-center border-b py-3"
            >
              <span className="font-medium">{i.title}</span>

              <div className="text-sm text-gray-600 flex flex-col">
                <span className="capitalize">
                  <strong>Category: </strong>: {i.category}
                </span>
                <span>
                  <strong>Date Lost: </strong>:{" "}
                  {new Date(i.dateLost).toLocaleDateString("en-GB")}
                </span>
                <span>
                  {" "}
                  <strong>Location: </strong> {i.location}
                </span>
              </div>

              <Badge
                className={`w-24 mx-auto justify-center text-white rounded-full ${
                  i.isFound ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {i.isFound ? "Found" : "Not Found"}
              </Badge>

              {/* 3 Dot Menu */}
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleUpdate(i)}>
                      Update Item
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleViewFinder(i)}>
                      View Finder Details
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleDeleteItem(i)}>
                      Delete Item
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

        {activeTab === "found" &&
          foundItems?.map((i: any) => (
            <div
              key={i.id}
              className="grid grid-cols-4 items-center border-b py-3"
            >
              <span className="font-medium">{i.title}</span>

              <div className="text-sm text-gray-600 flex flex-col">
                <span className="capitalize">
                  <strong>Category: </strong>: {i.category}
                </span>
                <span>
                  <strong>Date Found: </strong>:{" "}
                  {new Date(i.dateFound).toLocaleDateString("en-GB")}
                </span>
                <span>
                  {" "}
                  <strong>Location: </strong> {i.location}
                </span>
              </div>

              <Badge
                className={`w-24 mx-auto justify-center text-white rounded-full ${
                  i.isClaimed ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {i.isClaimed ? "Claimed" : "Not Claimed"}
              </Badge>

              {/* 3 Dot Menu */}
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleFoundUpdate(i)}>
                      Update Item
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleViewClaimer(i)}>
                      View Claimer Details
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleFoundDeleteItem(i)}>
                      Delete Item
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

        {activeTab === "claims" && (
          <div>
            {/* Inner Tabs */}
            <div className="flex gap-3 mb-4">
              {["claimed", "marked"].map((t) => (
                <Button
                  key={t}
                  variant={claimsTab === t ? "default" : "outline"}
                  onClick={() => setClaimsTab(t)}
                >
                  {t === "claimed" && "Items You Claimed"}
                  {t === "marked" && "Items You Marked as Found"}
                </Button>
              ))}
            </div>

            {/* Table Heading */}
            <div className="grid grid-cols-5 font-semibold text-gray-600 border-b pb-2 mb-3">
              <span>Item</span>
              <span>Details</span>
              <span className="text-center">Activity</span>
              <span className="text-right">Time</span>
              <span className="text-right">Action</span>
            </div>

            {/* ✅ Items YOU claimed */}
            {claimsTab === "claimed" &&
              claimedItems?.map((a: any) => (
                <div
                  key={a._id}
                  className="grid grid-cols-5 border-b py-3 items-center"
                >
                  <span className="font-medium">{a.title}</span>

                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Type:</strong> Found Item
                    </p>
                  </div>

                  <Badge className="bg-blue-500 text-white w-fit mx-auto">
                    You claimed it
                  </Badge>

                  <span className="text-right text-sm text-gray-500">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>

                  {/* 3 Dot Menu */}
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleWithdrawClaim(a._id)}
                        >
                          Withdraw Claim
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleviewReporter(a)}>
                          View Reporter Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

            {/* ✅ Items YOU marked as found */}
            {claimsTab === "marked" &&
              markedItems?.map((a: any) => (
                <div
                  key={a._id}
                  className="grid grid-cols-5 border-b py-3 items-center"
                >
                  <span className="font-medium">{a.title}</span>

                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Type:</strong> Lost Item
                    </p>
                  </div>

                  <Badge className="bg-green-600 text-white w-fit mx-auto">
                    You marked as found
                  </Badge>

                  <span className="text-right text-sm text-gray-500">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>

                  {/* 3 Dot Menu */}
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleUnmarkasFound(a._id)}
                        >
                          Unmark as Found
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleviewOwner(a)}>
                          View Owner Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === "products" &&
          userProducts?.map((i: any) => (
            <div
              key={i.id}
              className="grid grid-cols-4 items-center border-b py-3"
            >
              <span className="font-medium">{i.title}</span>

              <div className="text-sm text-gray-600 flex flex-col">
                <span className="capitalize">
                  <strong>Category: </strong>: {i.category}
                </span>
                <span>
                  <strong>Price: </strong>:{i.price}
                </span>
                <span>
                  {" "}
                  <strong>Condition: </strong> {i.condition}
                </span>
              </div>

              <Badge
                className={`w-24 mx-auto justify-center text-white rounded-full ${
                  i.isSold ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {i.isSold ? "Sold" : "Available"}
              </Badge>

              {/* 3 Dot Menu */}
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleProductUpdate(i)}>
                      Update Item
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleProductDeleteItem(i)}
                    >
                      Delete Item
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => handleProductDeleteItem(i)}>
                      Delete Item
                    </DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
      </div>

      {/* Dialogue Boxes */}

      {/* Lost Items Dialogue boxes */}
      <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Lost Item</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {["title", "description", "category", "location"].map((field) => (
              <div key={field}>
                <Label className="capitalize">{field}</Label>
                <Input
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                />
              </div>
            ))}

            <div>
              <Label>Date Lost</Label>
              <Input
                type="date"
                value={formData.dateLost}
                onChange={(e) =>
                  setFormData({ ...formData, dateLost: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Upload New Image (optional)</Label>
              <Input
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenUpdate(false)}>
              Cancel
            </Button>
            <Button onClick={async () => await submitUpdate()}>
              {LostLoading?"Saving Changes...":"Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lost item founder Dialog box */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finder Information</DialogTitle>
            <DialogDescription>Person who found this item</DialogDescription>
          </DialogHeader>

          {selectedFinder ? (
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedFinder.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedFinder.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedFinder.phone}
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              🚫 This item has not been found yet.
            </p>
          )}

          <DialogFooter>
            <DialogClose className="btn">Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Found Items Dialogue Boxes */}

      <Dialog open={openFoundUpdate} onOpenChange={setOpenFoundUpdate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Found Item</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {["title", "description", "category", "location"].map((field) => (
              <div key={field}>
                <Label className="capitalize">{field}</Label>
                <Input
                  value={foundFormData[field]}
                  onChange={(e) =>
                    setfoundFormData({
                      ...foundFormData,
                      [field]: e.target.value,
                    })
                  }
                />
              </div>
            ))}

            <div>
              <Label>Date Found</Label>
              <Input
                type="date"
                value={foundFormData.dateFound}
                onChange={(e) =>
                  setfoundFormData({
                    ...foundFormData,
                    dateFound: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Upload New Image (optional)</Label>
              <Input
                type="file"
                onChange={(e) =>
                  setfoundFormData({
                    ...foundFormData,
                    image: e.target.files[0],
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenFoundUpdate(false)}>
              Cancel
            </Button>
            <Button onClick={async () => await submitFoundUpdate()}>
              {FoundLoading?"Saving changes...":"Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Found Item Claimer Dialogue Box */}
      <Dialog open={openClaimerInfo} onOpenChange={setOpenClaimerInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Claimer's Information</DialogTitle>
            <DialogDescription>Person who claimed this item</DialogDescription>
          </DialogHeader>

          {selectedClaimer ? (
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedClaimer.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedClaimer.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedClaimer.phone}
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              🚫 This item has not been claimed yet.
            </p>
          )}

          <DialogFooter>
            <DialogClose className="btn">Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Claims activity Dialogue boxes */}

      <Dialog open={openReporter} onOpenChange={setOpenReporter}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reporter's Information</DialogTitle>
            <DialogDescription>
              Person who reported this lost item
            </DialogDescription>
          </DialogHeader>

          {selectedReporter ? (
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedReporter.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedReporter.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedReporter.phone}
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              🚫 This item has not reported yet.
            </p>
          )}

          <DialogFooter>
            <DialogClose className="btn">Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openOwner} onOpenChange={setOpenOwner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reporter's Information</DialogTitle>
            <DialogDescription>
              Person who reported this lost item
            </DialogDescription>
          </DialogHeader>

          {selectedOwner ? (
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedOwner.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedOwner.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOwner.phone}
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              🚫 This item has not reported yet.
            </p>
          )}

          <DialogFooter>
            <DialogClose className="btn">Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Update Dialog Box */}
      <Dialog open={openProductUpdate} onOpenChange={setOpenProductUpdate}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Update Your Product</DialogTitle>
    </DialogHeader>

    <div className="space-y-3">
      {/* Title */}
      <div>
        <Label>Title</Label>
        <Input
          name="title"
          value={userProductForm.title}
          onChange={handleuserProductFormChange}
          placeholder="Enter product title"
        />
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Input
          name="description"
          value={userProductForm.description}
          onChange={handleuserProductFormChange}
          placeholder="Enter product description"
        />
      </div>

      {/* Category Dropdown */}
      <div>
        <Label>Category</Label>
        <select
          name="category"
          value={userProductForm.category}
          onChange={handleuserProductFormChange}
          className="border p-2 rounded w-full"
        >
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Accessories">Accessories</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Condition Dropdown */}
      <div>
        <Label>Condition</Label>
        <select
          name="condition"
          value={userProductForm.condition}
          onChange={handleuserProductFormChange}
          className="border p-2 rounded w-full"
        >
          <option value="new">New</option>
          <option value="like_new">Like New</option>
          <option value="very_good">Very Good</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="for_parts">For Parts</option>
        </select>
      </div>

      {/* Price */}
      <div>
        <Label>Price</Label>
        <Input
          type="number"
          name="price"
          value={userProductForm.price}
          onChange={handleuserProductFormChange}
          placeholder="Enter price"
        />
      </div>

      {/* Upload Images */}
      <div>
        <Label>Upload New Images (optional)</Label>
        <Input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={(e) =>
            setUserProductForm((prev) => ({
              ...prev,
              images: Array.from(e.target.files), // ✅ ensures multiple files are stored
            }))
          }
        />
      </div>
    </div>

    <DialogFooter>
      <Button variant="ghost" onClick={() => setOpenProductUpdate(false)}>
        Cancel
      </Button>
      <Button onClick={submitProductUpdate}>{saveLoading?"Saving Changes...":"Save Changes"}</Button>
    </DialogFooter>
  </DialogContent>
      </Dialog>

    </div>
  );
};

export default Profile;
