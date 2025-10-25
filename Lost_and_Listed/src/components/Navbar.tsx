import { Link, useLocation } from 'react-router-dom';
import { Search, Package, ShoppingBag, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

const Navbar = () => {
  const location = useLocation();
  const { user, setUser } = useApp();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero">
              <Search className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Lost & Listed
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Button
              variant={isActive('/lost') ? 'secondary' : 'ghost'}
              asChild
            >
              <Link to="/lost" className="gap-2">
                <Package className="h-4 w-4" />
                Lost Items
              </Link>
            </Button>
            <Button
              variant={isActive('/found') ? 'secondary' : 'ghost'}
              asChild
            >
              <Link to="/found" className="gap-2">
                <Search className="h-4 w-4" />
                Found Items
              </Link>
            </Button>
            <Button
              variant={isActive('/marketplace') ? 'secondary' : 'ghost'}
              asChild
            >
              <Link to="/marketplace" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Marketplace
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
