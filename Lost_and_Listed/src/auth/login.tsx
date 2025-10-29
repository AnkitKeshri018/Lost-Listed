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

import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";


const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `api/v1/user/login`,
        loginData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.success) {
        toast.success("Login successful!");
        navigate("/");
        dispatch(setUser(res.data.data.user));
      } else {
        toast.error(res.data.message || "Invalid credentials.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-6">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 bg-card/30 backdrop-blur-lg rounded-3xl shadow-lg p-8">
        {/* Left side branding */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 text-center px-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-card/90 mb-4 shadow-lg">
            <Search className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Lost & Listed</h1>
          <p className="text-white/80 max-w-sm text-sm">
            Welcome back! Sign in and continue exploring items around you.
          </p>
        </div>

        {/* Right side login form */}
        <Card className="w-full md:w-1/2 bg-white/95 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@college.edu"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-center text-black/70 text-sm mt-4">
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="underline cursor-pointer text-purple hover:text-blue-500"
                >
                  Sign up
                </span>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
