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

// Generate SVG-based template images for braid styles instead of using external files
const generateSvgBraidImage = (category: string, color: string = "#3B2314"): string => {
  // Base SVG template with different patterns based on category
  const svgTemplate = (content: string) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#f8f8f8" />
      ${content}
    </svg>
  `;
  
  switch(category) {
    case "box":
      return `data:image/svg+xml,${encodeURIComponent(svgTemplate(`
        <g stroke="${color}" fill="none" stroke-width="4">
          <path d="M40,40 v120 M60,40 v120 M80,40 v120 M100,40 v120 M120,40 v120 M140,40 v120 M160,40 v120" />
          <path d="M40,40 h120 M40,60 h120 M40,80 h120 M40,100 h120 M40,120 h120 M40,140 h120 M40,160 h120" />
        </g>
      `))}`;
      
    case "goddess":
      return `data:image/svg+xml,${encodeURIComponent(svgTemplate(`
        <g stroke="${color}" fill="none" stroke-width="4">
          <path d="M30,40 C80,70 120,70 170,40" />
          <path d="M30,60 C80,90 120,90 170,60" />
          <path d="M30,80 C80,110 120,110 170,80" />
          <path d="M30,100 C80,130 120,130 170,100" />
          <path d="M30,120 C80,150 120,150 170,120" />
          <path d="M30,140 C80,170 120,170 170,140" />
          <path d="M30,160 C80,190 120,190 170,160" />
        </g>
      `))}`;
      
    case "knotless":
      return `data:image/svg+xml,${encodeURIComponent(svgTemplate(`
        <g stroke="${color}" fill="none" stroke-width="3">
          <path d="M40,40 v120 M70,40 v120 M100,40 v120 M130,40 v120 M160,40 v120" />
          <circle cx="40" cy="50" r="5" fill="${color}" />
          <circle cx="70" cy="60" r="5" fill="${color}" />
          <circle cx="100" cy="50" r="5" fill="${color}" />
          <circle cx="130" cy="60" r="5" fill="${color}" />
          <circle cx="160" cy="50" r="5" fill="${color}" />
        </g>
      `))}`;
      
    case "tribal":
      return `data:image/svg+xml,${encodeURIComponent(svgTemplate(`
        <g stroke="${color}" fill="none" stroke-width="5">
          <path d="M30,40 C60,50 80,60 100,40 C120,20 140,30 170,40" />
          <path d="M30,70 C60,80 80,90 100,70 C120,50 140,60 170,70" />
          <path d="M30,100 C60,110 80,120 100,100 C120,80 140,90 170,100" />
          <path d="M30,130 C60,140 80,150 100,130 C120,110 140,120 170,130" />
          <path d="M30,160 C60,170 80,180 100,160 C120,140 140,150 170,160" />
          <circle cx="100" cy="40" r="4" fill="${color}" />
          <circle cx="100" cy="70" r="4" fill="${color}" />
          <circle cx="100" cy="100" r="4" fill="${color}" />
          <circle cx="100" cy="130" r="4" fill="${color}" />
          <circle cx="100" cy="160" r="4" fill="${color}" />
        </g>
      `))}`;
      
    default: // other
      return `data:image/svg+xml,${encodeURIComponent(svgTemplate(`
        <g stroke="${color}" fill="none" stroke-width="3">
          <path d="M50,40 C70,60 90,80 100,160" />
          <path d="M70,40 C85,60 100,80 110,160" />
          <path d="M90,40 C100,60 110,80 120,160" />
          <path d="M110,40 C115,60 120,80 130,160" />
          <path d="M130,40 C130,60 130,80 140,160" />
          <path d="M150,40 C145,60 140,80 150,160" />
        </g>
      `))}`;
  }
};

const BRAID_STYLES: BraidStyle[] = [
  {
    id: "box-1",
    name: "Classic Box Braids",
    description: "Traditional square-shaped parts with clean lines and uniform size.",
    imageUrl: generateSvgBraidImage("box"),
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
    imageUrl: generateSvgBraidImage("box", "#4A2B19"),
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
    imageUrl: generateSvgBraidImage("goddess"),
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
    imageUrl: generateSvgBraidImage("knotless"),
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
    imageUrl: generateSvgBraidImage("knotless", "#5A3A25"),
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
    imageUrl: generateSvgBraidImage("tribal"),
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
    imageUrl: generateSvgBraidImage("tribal", "#2D1B11"),
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
    imageUrl: generateSvgBraidImage("other"),
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
    imageUrl: generateSvgBraidImage("other", "#4A2B19"),
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
                    <div>
                      <div className="w-full h-32 overflow-hidden bg-gray-50 dark:bg-gray-900 flex justify-center items-center border-b">
                        <img 
                          src={style.imageUrl} 
                          alt={style.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
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