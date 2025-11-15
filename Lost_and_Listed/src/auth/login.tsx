import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import designimage from "../../public/customimage.png";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );

  const handleLogin = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`/api/v1/user/login`, loginData);

      if (res.data.success) {
        toast.success("Login successful!");
        dispatch(setUser(res.data.data.user));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-white dark:bg-black">
      {/* LEFT IMAGE (only on desktop) */}
      <div className="w-full md:w-[45%] h-1/3 md:h-full hidden md:block">
        <img
          src={designimage}
          alt="Signup Poster"
          className="w-full h-full object-contain"
        />
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full md:w-[55%] h-full flex items-center justify-center px-6 md:px-14">
        {/* MOBILE CARD — visible only on mobile */}
        <div className="md:hidden w-full max-w-md bg-white/40 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border dark:border-gray-700 mx-auto mt-10">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mb-3 text-gray-600 hover:text-indigo-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <h2 className="text-3xl font-bold text-indigo-700 dark:text-white mb-1">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Login to continue
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <Label className="dark:text-gray-300 text-sm">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="dark:bg-gray-800 dark:border-gray-700 text-sm"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label className="dark:text-gray-300 text-sm">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="dark:bg-gray-800 dark:border-gray-700 text-sm"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-gray-600 dark:text-gray-400 mt-4 text-xs">
              Don’t have an account?{" "}
              <span
                className="text-indigo-600 cursor-pointer dark:text-indigo-400"
                onClick={() => navigate("/signup")}
              >
                Sign up here
              </span>
            </p>
          </form>
        </div>

        {/* DESKTOP FORM — mobile:hidden */}
        <div className="hidden md:block w-full max-w-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mb-5 text-gray-600 hover:text-indigo-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <h2 className="text-3xl font-bold text-indigo-700 dark:text-white mb-1">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Login to continue
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <Label className="dark:text-gray-300">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="dark:bg-gray-800 dark:border-gray-700"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label className="dark:text-gray-300">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="dark:bg-gray-800 dark:border-gray-700"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-indigo-600"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner />
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>

            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
              Don’t have an account?{" "}
              <span
                className="text-indigo-600 cursor-pointer dark:text-indigo-400"
                onClick={() => navigate("/signup")}
              >
                Sign up here
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
