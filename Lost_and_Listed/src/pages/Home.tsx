import { Link } from "react-router-dom";
import { Package, ShoppingBag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32 text-center">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
            Lost Something? <br /> Need Something?
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Your campus marketplace for lost & found items and second-hand
            goods.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/lost">Browse Lost Items</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/found">Browse Found Items</Link>
            </Button>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link to="/marketplace">Visit Marketplace</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4 grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-all">
            <Link to="/lost">
              <CardContent className="p-8 text-center">
                <Package className="mx-auto h-10 w-10 text-destructive mb-4" />
                <h3 className="text-xl font-semibold mb-2">Lost Items</h3>
                <p className="text-muted-foreground">
                  Report lost items and browse found ones.
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <Link to="/found">
              <CardContent className="p-8 text-center">
                <Search className="mx-auto h-10 w-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Found Items</h3>
                <p className="text-muted-foreground">
                  Help others recover their belongings.
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <Link to="/marketplace">
              <CardContent className="p-8 text-center">
                <ShoppingBag className="mx-auto h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
                <p className="text-muted-foreground">
                  Buy and sell items within campus.
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Join your fellow students and start posting today.
          </p>
          <Button asChild size="lg">
            <Link to="/auth">Sign Up Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t text-center text-sm text-muted-foreground">
        © 2024 Lost & Listed. Built for students, by students.
      </footer>
    </div>
  );
};

export default Home;
