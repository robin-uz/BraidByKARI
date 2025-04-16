import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useContext } from "react";
import { LoadingContext } from "@/contexts/LoadingContext";

export function LoadingScreen() {
  // Try to access the LoadingContext, but don't throw error if unavailable
  const context = useContext(LoadingContext);
  const isLoading = context?.isLoading ?? false;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg flex flex-col items-center"
          >
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
            <p className="text-sm text-neutral-600 dark:text-neutral-300">Loading...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}