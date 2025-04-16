import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, ChevronRight, ArrowRight } from "lucide-react";

export interface BraidStyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: "box" | "goddess" | "knotless" | "tribal" | "other";
  difficulty: "easy" | "medium" | "hard";
  maintenanceLevel: "low" | "medium" | "high";
  installTime: string;
  duration: string;
}

const BRAID_STYLES: BraidStyle[] = [
  {
    id: "box-1",
    name: "Classic Box Braids",
    description: "Traditional square-shaped parts with clean lines and uniform size.",
    imageUrl: "/assets/braids/box-braids-1.jpg",
    category: "box",
    difficulty: "medium",
    maintenanceLevel: "low",
    installTime: "4-6 hours",
    duration: "6-8 weeks"
  },
  {
    id: "box-2",
    name: "Jumbo Box Braids",
    description: "Larger box braids that take less time to install but are heavier.",
    imageUrl: "/assets/braids/box-braids-2.jpg",
    category: "box",
    difficulty: "easy",
    maintenanceLevel: "low",
    installTime: "2-4 hours",
    duration: "4-6 weeks"
  },
  {
    id: "goddess-1",
    name: "Goddess Braids",
    description: "Raised braids close to the scalp, often in intricate patterns.",
    imageUrl: "/assets/braids/goddess-braids-1.jpg",
    category: "goddess",
    difficulty: "hard",
    maintenanceLevel: "medium",
    installTime: "3-5 hours",
    duration: "2-4 weeks"
  },
  {
    id: "knotless-1",
    name: "Knotless Box Braids",
    description: "Box braids with a more natural look and less tension at the roots.",
    imageUrl: "/assets/braids/knotless-braids-1.jpg",
    category: "knotless",
    difficulty: "medium",
    maintenanceLevel: "low",
    installTime: "4-7 hours",
    duration: "6-8 weeks"
  },
  {
    id: "knotless-2",
    name: "Knotless Braids with Beads",
    description: "Knotless braids adorned with decorative beads for a distinctive look.",
    imageUrl: "/assets/braids/knotless-braids-2.jpg",
    category: "knotless",
    difficulty: "medium",
    maintenanceLevel: "medium",
    installTime: "5-8 hours",
    duration: "6-8 weeks"
  },
  {
    id: "tribal-1",
    name: "Tribal Braids",
    description: "Bold, thick braids often with decorative elements inspired by African styles.",
    imageUrl: "/assets/braids/tribal-braids-1.jpg",
    category: "tribal",
    difficulty: "hard",
    maintenanceLevel: "medium",
    installTime: "5-8 hours",
    duration: "6-8 weeks"
  },
  {
    id: "tribal-2",
    name: "Fulani Braids",
    description: "Geometric pattern with a center part and braids flowing back.",
    imageUrl: "/assets/braids/tribal-braids-2.jpg",
    category: "tribal",
    difficulty: "hard",
    maintenanceLevel: "medium",
    installTime: "4-7 hours",
    duration: "4-6 weeks"
  },
  {
    id: "other-1",
    name: "Feed-in Braids",
    description: "Braids that start small and gradually get thicker by feeding in hair.",
    imageUrl: "/assets/braids/feed-in-braids.jpg",
    category: "other",
    difficulty: "medium",
    maintenanceLevel: "low",
    installTime: "3-6 hours",
    duration: "2-4 weeks"
  },
  {
    id: "other-2",
    name: "Passion Twists",
    description: "Rope-like twists that have a natural, bohemian appearance.",
    imageUrl: "/assets/braids/passion-twists.jpg",
    category: "other",
    difficulty: "easy",
    maintenanceLevel: "low",
    installTime: "3-5 hours",
    duration: "4-6 weeks"
  }
];

interface BraidTemplatesProps {
  onSelectStyle: (style: BraidStyle) => void;
  selectedStyleId: string | null;
}

export default function BraidTemplates({ onSelectStyle, selectedStyleId }: BraidTemplatesProps) {
  const [filter, setFilter] = useState<string>("all");
  
  const filteredStyles = filter === "all" 
    ? BRAID_STYLES 
    : BRAID_STYLES.filter(style => style.category === filter);
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "easy": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "medium": return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300";
      case "hard": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default: return "";
    }
  };
  
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <Tabs defaultValue="all" onValueChange={setFilter}>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Braid Styles</h3>
            <TabsList className="w-full h-auto flex flex-wrap">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="box" className="flex-1">Box</TabsTrigger>
              <TabsTrigger value="knotless" className="flex-1">Knotless</TabsTrigger>
              <TabsTrigger value="goddess" className="flex-1">Goddess</TabsTrigger>
              <TabsTrigger value="tribal" className="flex-1">Tribal</TabsTrigger>
              <TabsTrigger value="other" className="flex-1">Other</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={filter} className="m-0">
            <ScrollArea className="h-[450px] pr-4">
              <div className="space-y-3">
                {filteredStyles.map((style) => (
                  <div 
                    key={style.id}
                    className={`
                      border rounded-md overflow-hidden transition-all 
                      ${selectedStyleId === style.id 
                        ? 'ring-2 ring-purple-500 dark:ring-purple-400' 
                        : 'hover:border-purple-200 dark:hover:border-purple-800'}
                    `}
                  >
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{style.name}</h4>
                        <Badge className={getDifficultyColor(style.difficulty)}>
                          {style.difficulty.charAt(0).toUpperCase() + style.difficulty.slice(1)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {style.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                        <div>
                          <span className="font-medium">Duration:</span> {style.duration}
                        </div>
                        <div>
                          <span className="font-medium">Install time:</span> {style.installTime}
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full"
                        variant={selectedStyleId === style.id ? "default" : "outline"}
                        onClick={() => onSelectStyle(style)}
                      >
                        {selectedStyleId === style.id ? (
                          <>Selected</>
                        ) : (
                          <>Select Style <ArrowRight className="ml-2 h-4 w-4" /></>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 rounded-md p-3">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-purple-700 dark:text-purple-300">
              Select a style to visualize how it would look. The actual results may vary based on your hair texture and length. Book a consultation for personalized advice.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}