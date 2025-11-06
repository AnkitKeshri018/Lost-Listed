import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AutoSlider from "@/components/AutoSlider";
import usefetchRecentActiivties from "@/hooks/Activty/usefetchRecentActiivties.tsx";




const Home = () => {
  usefetchRecentActiivties();
  const activities = useSelector((store:any)=>store.activity.activities);

 const lostItems = useSelector((store:any)=>store.lostitem.lostItems);
 const foundItems = useSelector((store: any) => store.founditem.foundItems);
 const products = useSelector((store: any) => store.product.products);


 








  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[90vh] w-full flex items-center justify-center text-white bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10 text-center px-4"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight"
          >
            Find, Buy & Recover
            <br />
            <span className="text-yellow-300">Campus Essentials</span>
          </motion.h1>

          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-xl mx-auto">
            Lost something? Want affordable student deals? This campus community
            has you.
          </p>

          <div className="mt-8 flex gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/lost">Report Lost</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/found">Report Found</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              <Link to="/marketplace" className="flex items-center gap-2">
                Marketplace <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </motion.div>
        <motion.div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </section>

      {/* ✅ Live Activity Ticker */}
      <section className="w-full py-3 bg-purple-800/90 text-white border-y border-purple-600 overflow-hidden">
        <div className="flex gap-10 whitespace-nowrap animate-marquee px-4">
          {activities.map((log: any) => (
            <span key={log._id} className="text-sm flex items-center gap-2">
              🔔 {log.message} —{" "}
              <span className="text-yellow-300">
                {new Date(log.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata", // IST
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-extrabold tracking-tight text-purple-700 dark:text-purple-300">
            Your Campus Exchange Hub
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A trusted platform for students to{" "}
            <span className="font-semibold">recover lost belongings</span>,
            <span className="font-semibold"> exchange essentials</span>, and
            <span className="font-semibold"> help each other</span>. Foster a
            community where every item finds its way back 🤝
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-14">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 - Lost/Found */}
            <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white p-8 rounded-2xl shadow-xl hover:scale-105 transition">
              <div className="text-5xl mb-4">📤</div>
              <h3 className="font-bold text-2xl mb-2">Post lost/found item</h3>
              <p className="text-white/90">
                Upload item details & notify campus instantly
              </p>
            </div>

            {/* Step 2 - Lost/Found */}
            <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white p-8 rounded-2xl shadow-xl hover:scale-105 transition">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-bold text-2xl mb-2">Others help identify</h3>
              <p className="text-white/90">
                Students spot, share clues & identify owners
              </p>
            </div>

            {/* Step 3 - Lost/Found */}
            <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white p-8 rounded-2xl shadow-xl hover:scale-105 transition">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="font-bold text-2xl mb-2">Item returned safely</h3>
              <p className="text-white/90">
                Connect & hand it back — build trust on campus
              </p>
            </div>

            {/* Divider / Tag */}
            <div className="col-span-full mt-6 mb-2">
              <p className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-14">
                Market Place For Students
              </p>
            </div>

            {/* Step 4 - Sell */}
            <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white p-8 rounded-2xl shadow-xl hover:scale-105 transition">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="font-bold text-2xl mb-2">List your item</h3>
              <p className="text-white/90">
                Post books, accessories, cycles & more
              </p>
            </div>

            {/* Step 5 - Browse */}
            <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white p-8 rounded-2xl shadow-xl hover:scale-105 transition">
              <div className="text-5xl mb-4">👀</div>
              <h3 className="font-bold text-2xl mb-2">
                Students browse & contact
              </h3>
              <p className="text-white/90">
                Find affordable student-listed items
              </p>
            </div>

            {/* Step 6 - Deal */}
            <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white p-8 rounded-2xl shadow-xl hover:scale-105 transition">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="font-bold text-2xl mb-2">
                Meet & exchange safely
              </h3>
              <p className="text-white/90">
                Deal inside campus — trust & convenience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-16">
        <div className="flex justify-between px-6 mb-6 items-center">
          <h2 className="text-center flex-1 text-3xl font-bold flex items-center justify-center gap-2">
            <Sparkles /> Trending Deals
          </h2>
          <Link
            to="/marketplace"
            className="text-indigo-600 hover:underline whitespace-nowrap"
          >
            View All →
          </Link>
        </div>
        <AutoSlider
          type="trend"
          items={products} // pass your products array
          getImageUrl={(item) =>
            item.images?.[0]?.url || "/default-product.png"
          } // safely extract first image
        />
      </section>

      {/* Lost */}
      <section className="py-16">
        <div className="flex justify-between px-6 mb-6 items-center">
          <h2 className="text-center flex-1 text-3xl font-bold">
            🕵️‍♂️ Recent Lost Items
          </h2>
          <Link
            to="/lost"
            className="text-indigo-600 hover:underline whitespace-nowrap"
          >
            View All →
          </Link>
        </div>
        <AutoSlider
          type="lost"
          items={lostItems}
          getImageUrl={(item) => item?.image?.url}
        />
      </section>

      {/* Found */}
      <section className="py-16">
        <div className="flex justify-between px-6 mb-6 items-center">
          <h2 className="text-center flex-1 text-3xl font-bold">
            ✅ Recently Found Items
          </h2>
          <Link
            to="/found"
            className="text-indigo-600 hover:underline whitespace-nowrap"
          >
            View All →
          </Link>
        </div>
        <AutoSlider
          type="found"
          items={foundItems}
          getImageUrl={(item) => item?.image?.url}
        />
      </section>

      {/* Campus Stats */}
      <section className="py-16 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10">
            Trusted by Your Campus
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Item */}
            <div className="p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/20">
              <span className="text-4xl">🎒</span>
              <h3 className="text-4xl font-bold mt-3 text-yellow-300">132</h3>
              <p className="mt-2 text-sm text-white/90">Lost Items Reported</p>
            </div>

            <div className="p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/20">
              <span className="text-4xl">✅</span>
              <h3 className="text-4xl font-bold mt-3 text-yellow-300">87</h3>
              <p className="mt-2 text-sm text-white/90">Items Returned</p>
            </div>

            <div className="p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/20">
              <span className="text-4xl">👥</span>
              <h3 className="text-4xl font-bold mt-3 text-yellow-300">800+</h3>
              <p className="mt-2 text-sm text-white/90">Active Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Returners */}
      <section className=" mt-20 py-16 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 flex items-center justify-center gap-2">
            🏅 Top Returners of The Month
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card */}
            {[
              {
                name: "Aman Verma",
                items: 12,
                badge: "🥇",
                color: "text-yellow-300",
              },
              {
                name: "Riya Sharma",
                items: 9,
                badge: "🥈",
                color: "text-gray-200",
              },
              {
                name: "Kunal Singh",
                items: 7,
                badge: "🥉",
                color: "text-orange-300",
              },
            ].map((p, idx) => (
              <div
                key={idx}
                className="p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-105 transition"
              >
                <div className={`text-5xl ${p.color}`}>{p.badge}</div>
                <h3 className="mt-3 text-2xl font-bold">{p.name}</h3>
                <p className="mt-2 text-white/90">
                  {p.items} items returned ✅
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⭐ Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-3xl font-bold mb-8 text-gray-800 dark:text-white">
            What Our Students Say
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Rohan Gupta",
                text: "I lost my AirPods and got them back the same day thanks to this platform!",
                role: "Student at College",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                name: "Priya Sharma",
                text: "Found a missing wallet & returned it smoothly. Such a helpful platform!",
                role: "Student at College",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                name: "Amit Verma",
                text: "The marketplace is amazing — sold my old cycle in 2 days!",
                role: "Student at College",
                image: "https://randomuser.me/api/portraits/men/67.jpg",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border hover:shadow-2xl transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {t.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {t.role}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-200 italic">
                  “{t.text}”
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        © 2025 Lost & Listed — Made for Students
      </footer>
    </div>
  );
};

export default Home;
