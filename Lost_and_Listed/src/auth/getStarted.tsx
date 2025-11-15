import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, LogIn } from "lucide-react";

const GetStartedSection = () => {
  return (
    <motion.section
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: "100% 50%" }}
      transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      className="mt-12 py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white bg-[length:200%_200%]"
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Title Animation */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-4"
        >
          Join Our Campus Community 🚀
        </motion.h2>

        {/* Paragraph Animation */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-white/90 max-w-2xl mx-auto mb-8"
        >
          Discover amazing student deals, report lost items, and connect with
          your campus community — all in one place.
        </motion.p>

        {/* Buttons with Hover Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg hover:shadow-yellow-300/50 transition-all duration-300"
            >
              <Link to="/signup" className="flex items-center gap-2">
                <UserPlus size={18} /> Get Started
              </Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-indigo-600 hover:bg-gray-100 shadow-lg hover:shadow-indigo-300/50 transition-all duration-300"
            >
              <Link to="/login" className="flex items-center gap-2">
                <LogIn size={18} /> Login
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default GetStartedSection;
