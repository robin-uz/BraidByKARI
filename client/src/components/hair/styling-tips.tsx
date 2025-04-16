import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Heart, 
  Feather, 
  Droplets, 
  CalendarDays, 
  Scissors,
  Sparkles
} from "lucide-react";
import { BraidStyle } from "./braid-templates";
import { Link } from "wouter";

interface StylingTipsProps {
  selectedStyle: BraidStyle | null;
}

interface TipItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const generateCareInstructions = (style: BraidStyle): TipItem[] => {
  const baseCare: TipItem[] = [
    {
      title: "Moisturize Regularly",
      description: "Keep your scalp and braids moisturized with a lightweight oil or moisturizing spray to prevent dryness and breakage.",
      icon: <Droplets className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Nighttime Protection",
      description: "Cover your braids with a satin or silk bonnet at night to prevent frizz and maintain the style longer.",
      icon: <Feather className="h-5 w-5 text-purple-500" />
    },
    {
      title: "Cleansing Schedule",
      description: "Wash your braids every 2-3 weeks with diluted shampoo, focusing on the scalp, and allow to air dry completely.",
      icon: <CalendarDays className="h-5 w-5 text-green-500" />
    }
  ];
  
  // Add style-specific care tips
  if (style.category === "box" || style.category === "knotless") {
    baseCare.push({
      title: "Edges Treatment",
      description: "Be gentle with your edges and avoid tension. Apply edge control sparingly to maintain a neat look.",
      icon: <Heart className="h-5 w-5 text-red-500" />
    });
  }
  
  if (style.maintenanceLevel === "high") {
    baseCare.push({
      title: "Weekly Maintenance",
      description: "Set aside time each week for touch-ups and maintaining the neatness of your style.",
      icon: <Scissors className="h-5 w-5 text-orange-500" />
    });
  }
  
  return baseCare;
};

const generateStylingIdeas = (style: BraidStyle): TipItem[] => {
  const baseStyles: TipItem[] = [
    {
      title: "Half-Up, Half-Down",
      description: "A versatile look that works for casual and formal occasions. Secure the top half with a scrunchie or decorative clip.",
      icon: <Sparkles className="h-5 w-5 text-amber-500" />
    },
    {
      title: "High Ponytail",
      description: "Gather your braids into a high ponytail for a sleek, pulled-together look. Add a wrap-around braid for extra style.",
      icon: <Sparkles className="h-5 w-5 text-amber-500" />
    }
  ];
  
  // Add style-specific styling ideas
  if (style.category === "box" || style.category === "knotless") {
    baseStyles.push({
      title: "Top Knot Bun",
      description: "Create a stylish top knot by gathering your braids at the crown of your head and securing with a hair tie.",
      icon: <Sparkles className="h-5 w-5 text-amber-500" />
    });
  }
  
  if (style.category === "goddess" || style.category === "tribal") {
    baseStyles.push({
      title: "Accessorize",
      description: "Add beads, cuffs, or thread to enhance your style and make it uniquely yours.",
      icon: <Sparkles className="h-5 w-5 text-amber-500" />
    });
  }
  
  return baseStyles;
};

export default function StylingTips({ selectedStyle }: StylingTipsProps) {
  if (!selectedStyle) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
          <div className="text-center">
            <Feather className="h-12 w-12 text-purple-300 dark:text-purple-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Style Selected</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Select a braid style to get personalized care and styling tips.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const careInstructions = generateCareInstructions(selectedStyle);
  const stylingIdeas = generateStylingIdeas(selectedStyle);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Tips for {selectedStyle.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Tabs defaultValue="care">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="care" className="flex-1">Care Instructions</TabsTrigger>
            <TabsTrigger value="styling" className="flex-1">Styling Ideas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="care" className="mt-0">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {careInstructions.map((tip, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex items-start">
                      <div className="mt-0.5 mr-3">{tip.icon}</div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4 mt-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    Proper care will extend the life of your {selectedStyle.name} and keep your natural hair healthy underneath.
                  </p>
                  <Link href="/booking">
                    <Button size="sm" className="w-full">
                      Book a Maintenance Appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="styling" className="mt-0">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {stylingIdeas.map((tip, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex items-start">
                      <div className="mt-0.5 mr-3">{tip.icon}</div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4 mt-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    {selectedStyle.name} can be versatile! Experiment with different styles to get the most out of your look.
                  </p>
                  <Link href="/gallery">
                    <Button variant="outline" size="sm" className="w-full">
                      Browse Style Gallery
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}