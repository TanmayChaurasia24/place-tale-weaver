
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, History, Info, Globe, MapPin } from "lucide-react";

interface CityHistoryProps {
  history: string;
  place: string;
}

export default function CityHistory({ history, place }: CityHistoryProps) {
  const [activeTab, setActiveTab] = useState("history");

  // Function to parse and render markdown-like sections
  const renderSections = () => {
    // Basic markdown-like parsing
    const sections = history.split(/^(#+)\s+(.+)$/gm);
    const content = [];
    
    // Simple rendering for now - in a real app, you would use a proper markdown parser
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section && section.trim() !== "") {
        content.push(
          <div key={i} className="mb-6">
            <p className="text-foreground text-base md:text-lg leading-relaxed">{section}</p>
          </div>
        );
      }
    }
    
    return content;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full mt-8"
    >
      <Card className="border-border bg-card/50 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            {place}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            Explore the rich history and geography of this location
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="history" className="w-full" onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger value="geography" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Geography</span>
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="pt-0 pb-6 px-6">
            <TabsContent value="history" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <History className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Historical Timeline</h3>
                </div>
                <div>{renderSections()}</div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="geography" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Compass className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Geographical Features</h3>
                </div>
                <div>{renderSections()}</div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="overview" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Quick Overview</h3>
                </div>
                <div>{renderSections()}</div>
              </motion.div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </motion.div>
  );
}
