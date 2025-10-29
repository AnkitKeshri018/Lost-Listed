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
  KeyRound, // 👈 Password icon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";

const Profile = () => {
  const { user } = useSelector((store: any) => store.auth);
  const dispatch = useDispatch();

  const [editData, setEditData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false); // 👈 for password dialog
  const [uploading, setUploading] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleInfoChange = (e: any) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: any) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleInfoUpdate = async () => {
    try {
      const res = await axios.put(`/api/v1/user/update-profile`, editData, {
        withCredentials: true,
      });
      dispatch(setUser(res.data.user));
      toast.success("Profile info updated!");
      setEditOpen(false);
    } catch (error) {
      toast.error("Failed to update profile info.");
      console.error(error);
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
    } catch (error) {
      toast.error("Failed to update avatar.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      return toast.error("Please fill in both fields.");
    }

    setUpdatingPassword(true);
    try {
      await axios.put(`/api/v1/user/update-password`, passwords, {
        withCredentials: true,
      });
      toast.success("Password updated successfully!");
      setPasswordOpen(false);
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update password."
      );
      console.error(error);
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-lg text-muted-foreground">No user data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-orange-400 flex items-center justify-center p-6">
      <Card className="max-w-2xl mx-2 shadow-lg border rounded-2xl overflow-hidden bg-card">
        {/* Gradient Header */}
        <div className="flex flex-col items-center p-8 md:flex-row md:items-center md:gap-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white">
          <div className="relative group">
            <img
              src={user.avatar?.url || "/default-avatar.png"}
              alt="User Avatar"
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
            />

            {/* Overlay with loader or upload text */}
            <label
              htmlFor="avatarUpload"
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-6 h-6 text-white animate-spin mb-1" />
                  <span className="text-xs">Updating...</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-white" />
                  <span className="text-xs mt-1">Update</span>
                </>
              )}
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>

          <div className="text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            <p className="opacity-90">@{user.username}</p>
            <Badge variant="secondary" className="mt-2 bg-white/20 text-white">
              Member
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <span>{user.phone}</span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span>{user.location}</span>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>
              Joined on{" "}
              {new Date(user.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Edit Profile & Change Password Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-orange-500 text-white hover:opacity-90 w-full sm:w-auto">
                  <PencilLine className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Profile Info</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={editData.fullName}
                      onChange={handleInfoChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInfoChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={editData.location}
                      onChange={handleInfoChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleInfoUpdate}
                    className="bg-gradient-to-r from-purple-500 to-orange-500 text-white hover:opacity-90"
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-purple-600 border-purple-500 hover:bg-purple-50 w-full sm:w-auto"
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handlePasswordUpdate}
                    disabled={updatingPassword}
                    className="bg-gradient-to-r from-purple-500 to-orange-500 text-white hover:opacity-90"
                  >
                    {updatingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
