import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Search, Heart, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';

const Home = () => {
  const features = [
    {
      icon: Search,
      title: 'Find Lost Items',
      description: 'Browse through found items and reunite with your lost belongings quickly.',
    },
    {
      icon: Heart,
      title: 'Help Others',
      description: 'Report found items and help fellow students recover their lost possessions.',
    },
    {
      icon: ShoppingBag,
      title: 'Buy & Sell',
      description: 'Trade second-hand items within your campus community at great prices.',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'College-verified users ensure a trusted marketplace environment.',
    },
    {
      icon: Users,
      title: 'Campus Community',
      description: 'Connect with fellow students and build a supportive campus network.',
    },
    {
      icon: Package,
      title: 'Easy Management',
      description: 'Simple interface to post, track, and manage all your listings.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
              Lost Something? <br />
              Need Something?
            </h1>
            <p className="mb-8 text-lg text-white/90 md:text-xl">
              Your campus marketplace for lost & found items and second-hand goods.
              Connect with fellow students to find, help, and trade.
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
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      </section>

      {/* Quick Access Section */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="group transition-all hover:shadow-hover cursor-pointer">
              <Link to="/lost">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground transition-colors">
                      <Package className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">Lost Items</h3>
                      <p className="text-muted-foreground">
                        Report your lost items and browse found items to recover your belongings.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group transition-all hover:shadow-hover cursor-pointer">
              <Link to="/found">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-500 group-hover:bg-green-600 dark:group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <Search className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">Found Items</h3>
                      <p className="text-muted-foreground">
                        Help return found items to their owners and build a caring campus community.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group transition-all hover:shadow-hover cursor-pointer">
              <Link to="/marketplace">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
                      <p className="text-muted-foreground">
                        Buy and sell second-hand items. Save money and reduce waste by trading within your campus.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Lost & Listed?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built specifically for college students, by students. Everything you need in one simple platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="transition-all hover:shadow-card">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Join your fellow students in creating a helpful and sustainable campus community.
            </p>
            <Button asChild size="lg">
              <Link to="/auth">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Lost & Listed. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
