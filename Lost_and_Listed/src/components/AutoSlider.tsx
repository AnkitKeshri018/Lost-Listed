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
    if (getImageUrl) return getImageUrl(item); // custom extractor
    if (item.image?.url) return item.image.url; // lost/found item
    if (item.images?.length) return item.images[0].url; // marketplace product
    return "/default-product.png"; // fallback
  };

  return (
    <div className="relative flex justify-center w-full items-center gap-4 px-4">
      {/* Left preview */}
      <div className="hidden md:flex gap-3 opacity-40 scale-90 blur-sm transition-all duration-500">
        {[prev, items[(prevIndex - 1 + items.length) % items.length]].map(
          (item, idx) => (
            <Card key={idx} className="w-40 overflow-hidden rounded-xl">
              <img src={getImg(item)} className="h-32 w-full object-cover" />
            </Card>
          )
        )}
      </div>

      {/* Main Card */}
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-80 cursor-pointer z-10"
        onClick={() => (window.location.href = redirect)}
      >
        <Card className="shadow-xl rounded-xl">
          <img
            src={getImg(current)}
            className="h-64 w-full object-cover rounded-t-xl"
          />
          <CardContent className="p-3 text-center">
            <h3 className="font-semibold text-lg">
              {current.title || current.name}
            </h3>
            {type === "lost" && (
              <p className="text-xs text-red-500">Reported Lost</p>
            )}
            {type === "found" && (
              <p className="text-xs text-green-600">Marked Found</p>
            )}
            {type === "trend" && current.price && (
              <p className="text-base font-semibold mt-1">₹{current.price}</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Right preview */}
      <div className="hidden md:flex gap-3 opacity-40 scale-90 blur-sm transition-all duration-500">
        {[next, items[(nextIndex + 1) % items.length]].map((item, idx) => (
          <Card key={idx} className="w-40 overflow-hidden rounded-xl">
            <img src={getImg(item)} className="h-32 w-full object-cover" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AutoSlider;
