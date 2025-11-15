import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
import designimage from "../../public/customimage.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("/api/v1/user/forgot-password", { email });
      if (res.data.success) {
        toast.success("Recovery link sent to your email!");
        setEmail(""); // clear input on success
      } else {
        toast.error(res.data.message || "Failed to send recovery link.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send recovery link.");
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
          alt="Forgot Poster"
          className="w-full h-full object-contain"
        />
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full md:w-[55%] h-full flex items-center justify-center px-6 md:px-14">
        {/* MOBILE CARD */}
        <div className="md:hidden w-full max-w-md bg-white/40 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border dark:border-gray-700 mx-auto mt-10">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/login")}
            className="mb-3 text-gray-600 hover:text-indigo-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-3xl font-bold text-indigo-700 dark:text-white mb-1">
            Forgot Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enter your email and get a password recovery link.
          </p>
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            {/* EMAIL WITH ICON */}
            <div className="relative mb-4">
              <Label className="dark:text-gray-300 text-sm">Email</Label>
              <span style={{ position: 'absolute', left: 12, top: '65%', transform: 'translateY(-50%)', color: '#aaa' }}>
                <Mail size={18} />
              </span>
              <Input
                type="email"
                placeholder="you@example.com"
                className="pl-10 dark:bg-gray-800 dark:border-gray-700 text-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Recovery Link"}
            </Button>

            <p className="text-center text-gray-600 dark:text-gray-400 mt-4 text-xs">
              <span
                className="text-indigo-600 cursor-pointer dark:text-indigo-400"
                onClick={() => navigate("/login")}
              >
                Back to login
              </span>
            </p>
          </form>
        </div>

        {/* DESKTOP FORM */}
        <div className="hidden md:block w-full max-w-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/login")}
            className="mb-5 text-gray-600 hover:text-indigo-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-3xl font-bold text-indigo-700 dark:text-white mb-1">
            Forgot Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enter your email and get a password recovery link.
          </p>
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            {/* EMAIL WITH ICON */}
            <div className="relative mb-4">
              <Label className="dark:text-gray-300 ">Enter your registered Email</Label>
              <span style={{ position: 'absolute', left: 12, top: '65%', transform: 'translateY(-50%)', color: '#aaa' }}>
                <Mail size={18} />
              </span>
              <Input
                type="email"
                placeholder="you@example.com"
                className="pl-10 dark:bg-gray-800 dark:border-gray-700 mt-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-indigo-600"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Recovery Link"}
            </Button>

            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
              <span
                className="text-indigo-600 cursor-pointer dark:text-indigo-400"
                onClick={() => navigate("/login")}
              >
                Back to login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
