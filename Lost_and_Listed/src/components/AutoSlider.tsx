import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

// Type for both products and lost/found items
interface SliderItem {
  title?: string;
  name?: string;
  price?: string | number;
  image?: { url: string }; // lost/found
  images?: { url: string }[]; // marketplace products
}

interface AutoSliderProps {
  type: "lost" | "found" | "trend";
  items: SliderItem[];
  redirectPath?: string;
  getImageUrl?: (item: SliderItem) => string; // optional custom image extractor
}

const AutoSlider = ({
  type,
  items,
  redirectPath,
  getImageUrl,
}: AutoSliderProps) => {
  const [index, setIndex] = useState(0);

  if (!items || items.length === 0) return null;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [items.length]);

  const prevIndex = (index - 1 + items.length) % items.length;
  const nextIndex = (index + 1) % items.length;

  const current = items[index];
  const prev = items[prevIndex];
  const next = items[nextIndex];

  const redirect =
    redirectPath ||
    (type === "lost" ? "/lost" : type === "found" ? "/found" : "/marketplace");

  // Determine image safely
  const getImg = (item: SliderItem) => {
    if (!item) return "/default-product.png";
    if (getImageUrl) return getImageUrl(item);
    if (item.image?.url) return item.image.url;
    if (item.images?.length) return item.images[0].url;
    return "/default-product.png";
  };

  return (
    <div className="relative flex justify-center w-full items-center gap-4 px-4">
      {/* Left preview */}
      <div className="hidden md:flex gap-3 opacity-30 scale-90 blur-sm transition-all duration-500">
        {[prev, items[(prevIndex - 1 + items.length) % items.length]].map(
          (item, idx) => (
            <Card
              key={idx}
              className="w-40 overflow-hidden rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/10"
            >
              <img src={getImg(item)} className="h-32 w-full object-cover" />
            </Card>
          )
        )}
      </div>

      {/* Main Card */}
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -80 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-80 cursor-pointer z-10"
        onClick={() => (window.location.href = redirect)}
      >
        <Card className="relative overflow-hidden rounded-3xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-2">
          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={getImg(current)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
          </div>

          {/* Content */}
          <CardContent className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 className="text-xl font-semibold drop-shadow-md mb-1">
              {current.title || current.name}
            </h3>

            {type === "trend" && current.price && (
              <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full shadow-md backdrop-blur-sm">
                ₹{current.price}
              </span>
            )}

            {type === "lost" && (
              <span className="text-xs font-semibold text-white bg-red-500 px-3 py-1 rounded-md mt-2 inline-block shadow-sm">
                Reported Lost
              </span>
            )}

            {type === "found" && (
              <span className="text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-400 px-3 py-1 rounded-md mt-2 inline-block shadow-sm">
                Marked Found
              </span>
            )}
          </CardContent>

          {/* Hover glow border */}
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-indigo-500/20 via-pink-500/20 to-purple-500/20 rounded-3xl pointer-events-none"></div>
        </Card>
      </motion.div>

      {/* Right preview */}
      <div className="hidden md:flex gap-3 opacity-30 scale-90 blur-sm transition-all duration-500">
        {[next, items[(nextIndex + 1) % items.length]].map((item, idx) => (
          <Card
            key={idx}
            className="w-40 overflow-hidden rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/10"
          >
            <img src={getImg(item)} className="h-32 w-full object-cover" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AutoSlider;
