import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import HistoryDisplay from "@/components/history";

export default function Index() {
  const [place, setPlace] = useState("");
  const [history, setHistory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!place.trim()) {
      toast({
        title: "Please enter a place name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3030/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ place }),
      });

      if (!response.ok) throw new Error("Failed to generate history");

      const data = await response.json(); // ✅ Parse response as JSON
      console.log("data is: ",data.data.result.response); // Debugging

      if (data.data.result.response) {
        setHistory(data.data.result.response); // ✅ Extract history correctly
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error generating history",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Place History Explorer
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Discover the rich history of any place in the world
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter a place name..."
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="h-14 px-6 text-lg bg-white/80 backdrop-blur-sm border-zinc-200 shadow-sm transition-all focus:ring-2 focus:ring-zinc-300 dark:bg-zinc-800/80 dark:border-zinc-700"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-all dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Explore History"
            )}
          </Button>
        </form>

        <AnimatePresence>
          {history && <HistoryDisplay history={history} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
