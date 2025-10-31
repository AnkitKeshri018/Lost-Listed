import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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



const dummyFound = [{ id: 1, title: "Found Keys", status: "Claim Approved" }];

const dummyClaims = [
  { id: 1, item: "iPhone", role: "You Claimed", status: "Approved" },
  { id: 2, item: "Bag", role: "Claim on your item", status: "Pending" },
];

const Profile = () => {
  //Lost item Handlers
  const { loading, error, refetchItems } = useGetallUserLostItems();
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


  
  const submitFoundUpdate = async () => {
    try {
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

      setOpenFoundUpdate(false);
      refetchFoundItems();
    } catch (error) {
      console.log(error);
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

  const submitUpdate = async () => {
    try {
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

      setOpenUpdate(false);
      refetchItems();
    } catch (error) {
      console.log(error);
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
        {["lost", "found", "claims"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "lost" && "Lost Items"}
            {tab === "found" && "Found Items"}
            {tab === "claims" && "Claims Activity"}
          </Button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="mt-4 bg-white p-6 rounded-xl shadow">
        {/* Table Heading */}
        <div className="grid grid-cols-4 font-semibold text-gray-600 border-b pb-2 mb-3">
          <span>Item</span>
          <span>Details</span>
          <span className="text-center">Status</span>
          <span className="text-right">Actions</span>
        </div>

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

        {/* Found Items section */}

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
      </div>

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
              Save Changes
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
              Save Changes
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
    </div>
  );
};

export default Profile;
