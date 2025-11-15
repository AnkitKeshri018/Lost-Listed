import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import designimage from "../../public/customimage.png";

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

  const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword)
      return toast.error("Passwords do not match");

    if (signupData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    if (!avatar) return toast.error("Please upload a profile picture");

    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(signupData).forEach(([k, v]) =>
        formData.append(k, v as string)
      );
      formData.append("avatar", avatar);

      const res = await axios.post(`/api/v1/user/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Account created!");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-white dark:bg-black">
      {/* Desktop image */}
      <div className="hidden md:block md:w-[45%] h-full">
        <img
          src={designimage}
          alt="Signup Poster"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Right section */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-14 py-4 md:py-0">
        {/* Form wrapper */}
        <div
          className={`
    w-full max-w-md md:max-w-lg 
    rounded-2xl p-4 md:p-0 
    bg-white/40 dark:bg-gray-900/80 md:bg-transparent md:dark:bg-black 
    backdrop-blur-xl md:backdrop-blur-none 
    shadow-lg md:shadow-none 
    border dark:border-gray-700 md:border-0
  `}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mb-2 text-gray-600 hover:text-indigo-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <h2 className="text-3xl flex justify-start md:text-3xl font-bold text-indigo-700 dark:text-white mb-1">
            Sign Up
          </h2>
          <p className=" flex justify-start text-gray-600 dark:text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
            Join Lost & Listed today
          </p>

          <form
            onSubmit={handleSignup}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            <div>
              <Label className="dark:text-gray-300 text-sm">Full Name</Label>
              <Input
                placeholder="John Doe"
                value={signupData.fullName}
                onChange={(e) =>
                  setSignupData({ ...signupData, fullName: e.target.value })
                }
                className="text-sm"
              />
            </div>

            <div>
              <Label className="dark:text-gray-300 text-sm">Username</Label>
              <Input
                placeholder="john123"
                value={signupData.username}
                onChange={(e) =>
                  setSignupData({ ...signupData, username: e.target.value })
                }
                className="text-sm"
              />
            </div>

            <div>
              <Label className="dark:text-gray-300 text-sm">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                className="text-sm"
              />
            </div>

            <div>
              <Label className="dark:text-gray-300 text-sm">Phone</Label>
              <Input
                placeholder="+91 XXXXX XXXXX"
                value={signupData.phone}
                onChange={(e) =>
                  setSignupData({ ...signupData, phone: e.target.value })
                }
                className="text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="dark:text-gray-300 text-sm">Location</Label>
              <Input
                placeholder="Hostel / City"
                value={signupData.location}
                onChange={(e) =>
                  setSignupData({ ...signupData, location: e.target.value })
                }
                className="text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="dark:text-gray-300 text-sm">
                Profile Picture
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                className="text-sm"
              />
            </div>

            <div>
              <Label className="dark:text-gray-300 text-sm">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                className="text-sm"
              />
            </div>

            <div>
              <Label className="dark:text-gray-300 text-sm">
                Confirm Password
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={signupData.confirmPassword}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    confirmPassword: e.target.value,
                  })
                }
                className="text-sm"
              />
            </div>

            <div className="sm:col-span-2 mt-2">
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    Creating...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-center text-gray-600 dark:text-gray-400 mt-2 text-xs md:text-sm">
                Already have an account?{" "}
                <span
                  className="text-indigo-600 cursor-pointer dark:text-indigo-400"
                  onClick={() => navigate("/login")}
                >
                  Login here
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
