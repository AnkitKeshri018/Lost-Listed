import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { USER_API_ENDPOINT } from "@/utils/constants";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);

  const [signupData, setSignupData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!avatar) {
      toast.error("Please upload a profile picture");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.entries(signupData).forEach(([key, value]) =>
        formData.append(key, value)
      );
      formData.append("avatar", avatar);

      const res = await axios.post(
        `/api/v1/user/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Signup failed.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error connecting to server."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-6">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 bg-card/30 backdrop-blur-lg rounded-3xl shadow-lg p-8">
        {/* Left side */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 text-center px-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-card/90 mb-4 shadow-lg">
            <Search className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Lost & Listed</h1>
          <p className="text-white/80 max-w-sm text-sm">
            Find what's lost, list what you don't need — join a community built
            on finding and sharing.
          </p>
        </div>

        {/* Right side form */}
        <Card className="w-full md:w-1/2 bg-white/95 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Join Lost & Listed today</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup} className="grid grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="col-span-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={signupData.fullName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Username */}
              <div className="col-span-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={signupData.username}
                  onChange={(e) =>
                    setSignupData({ ...signupData, username: e.target.value })
                  }
                  required
                />
              </div>

              {/* Email */}
              <div className="col-span-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@college.edu"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Phone */}
              <div className="col-span-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="9876543210"
                  value={signupData.phone}
                  onChange={(e) =>
                    setSignupData({ ...signupData, phone: e.target.value })
                  }
                />
              </div>

              {/* Location */}
              <div className="col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Hostel / City"
                  value={signupData.location}
                  onChange={(e) =>
                    setSignupData({ ...signupData, location: e.target.value })
                  }
                />
              </div>

              {/* Avatar Upload */}
              <div className="col-span-2">
                <Label htmlFor="avatar">Profile Picture</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                  required
                />
              </div>

              {/* Password + Confirm */}
              <div className="col-span-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-span-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="col-span-2 mt-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>

                <p className="text-center text-black/70 text-sm mt-6">
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="underline cursor-pointer text-purple hover:text-blue-300"
                  >
                    Login
                  </span>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
