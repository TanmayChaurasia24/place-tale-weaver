
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Moon, Sun, Search, MapPin } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import CityHistory from "@/components/CityHistory";

export default function Index() {
  const [place, setPlace] = useState("");
  const [history, setHistory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [searchStarted, setSearchStarted] = useState(false);

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
    setSearchStarted(true);
    
    try {
      const dbResponse = await fetch(`http://localhost:3030/api/content/${place}`);
      if (dbResponse.ok) {
        const dbData = await dbResponse.json();
        if (dbData.success) {
          setHistory(dbData.message);
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch("http://localhost:3030/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ place }),
      });

      if (!response.ok) throw new Error("Failed to generate history");

      const data = await response.json();
      console.log("data is: ", data);

      if (data.success) {
        setHistory(data.content);
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
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Theme toggle button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-full"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8 md:py-16">
        <AnimatePresence mode="wait">
          {!searchStarted || !history ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-10 md:mb-16"
              >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
                  Place History Explorer
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Discover the rich history, geography, and cultural background of any place in the world
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {["Historical Insights", "Geographical Details", "Cultural Context"].map((feature, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    key={index}
                    className="bg-card/70 backdrop-blur-sm rounded-xl p-6 shadow-md border border-border"
                  >
                    <div className="flex items-center justify-center mb-4 h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto">
                      {index === 0 ? (
                        <History className="h-6 w-6" />
                      ) : index === 1 ? (
                        <Globe className="h-6 w-6" />
                      ) : (
                        <Info className="h-6 w-6" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{feature}</h3>
                    <p className="text-muted-foreground">
                      {index === 0
                        ? "Explore the timeline and key historical events that shaped the place."
                        : index === 1
                        ? "Discover geographical features, climate patterns, and natural landmarks."
                        : "Learn about traditions, languages, and cultural significance."}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative mx-auto max-w-2xl ${searchStarted && history ? "mb-6" : "mb-0"}`}
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Enter a place name..."
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="h-14 pl-12 pr-6 text-lg bg-card border-border shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 h-14 text-lg font-medium transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Exploring...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore History
                </>
              )}
            </Button>
          </form>
        </motion.div>

        <AnimatePresence>
          {history && <CityHistory history={history} place={place} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
