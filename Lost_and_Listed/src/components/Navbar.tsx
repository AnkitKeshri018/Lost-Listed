import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Package, ShoppingBag, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "sonner";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store: any) => store.auth);

  const isActive = (path: any) => location.pathname === path;

  const handleLogout = async () => {
    console.log("handle logout clicked");
    try {
      await axios.post(`/api/v1/user/logout`, {}, { withCredentials: true });
      dispatch(setUser(null));
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero">
              <Search className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Lost & Listed
            </span>
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-1">
            <Button variant={isActive("/lost") ? "secondary" : "ghost"} asChild>
              <Link to="/lost" className="gap-2">
                <Package className="h-4 w-4" />
                Lost Items
              </Link>
            </Button>
            <Button
              variant={isActive("/found") ? "secondary" : "ghost"}
              asChild
            >
              <Link to="/found" className="gap-2">
                <Search className="h-4 w-4" />
                Found Items
              </Link>
            </Button>
            <Button
              variant={isActive("/marketplace") ? "secondary" : "ghost"}
              asChild
            >
              <Link to="/marketplace" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Marketplace
              </Link>
            </Button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              // ✅ Logged-in user dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition">
                    <img
                      src={user.avatar?.url || "/default-avatar.png"}
                      alt="avatar"
                      className="w-6 h-6 rounded-full border"
                    />
                    <span className="text-sm font-medium">
                      {user.fullName || "User"}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40 mt-2">
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer"
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // 👇 When user is not logged in
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
