import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import ClientLayout from "@/components/client/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { HexColorPicker } from "react-colorful";
import { Download, Upload, Undo2, Trash2, Save, Sparkles, Brush, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BraidTemplates, { BraidStyle } from "@/components/hair/braid-templates";
import StylingTips from "@/components/hair/styling-tips";

const PRESET_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "Dark Brown", hex: "#3B2314" },
  { name: "Light Brown", hex: "#7B4A12" },
  { name: "Blonde", hex: "#E6BE8A" },
  { name: "Red", hex: "#8C3A2F" },
  { name: "Auburn", hex: "#922724" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Purple", hex: "#800080" },
  { name: "Blue", hex: "#1E90FF" },
  { name: "Pink", hex: "#FF69B4" },
];

export default function HairSimulator() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hairColor, setHairColor] = useState("#3B2314"); // Default hair color (dark brown)
  const [intensity, setIntensity] = useState([50]);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [selectedBraidStyle, setSelectedBraidStyle] = useState<BraidStyle | null>(null);
  const [simulationMode, setSimulationMode] = useState<"color" | "style">("color");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Initialize canvas when image is loaded
  useEffect(() => {
    if (selectedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        };
        img.src = selectedImage;
      }
    }
  }, [selectedImage]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImage(result);
      setUndoStack([]);
      setSelectedBraidStyle(null);
    };
    reader.readAsDataURL(file);
  };
  
  const handleBraidStyleSelect = (style: BraidStyle) => {
    setSelectedBraidStyle(style);
    
    toast({
      title: "Style Selected",
      description: `${style.name} has been selected. Click 'Apply Style' to visualize it.`,
    });
  };

  const handleColorChange = (newColor: string) => {
    setHairColor(newColor);
  };

  const handlePresetClick = (color: string) => {
    setHairColor(color);
  };

  const applyColorToHair = () => {
    // In a real implementation, this would use image processing to only color hair
    // For a simple demo, we'll use a filter on the whole image
    if (!selectedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save the current image to undo stack
    setUndoStack([...undoStack, canvas.toDataURL()]);

    // Draw the image
    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Apply color overlay with intensity
      const intensityValue = intensity[0] / 100;
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = intensityValue;
      ctx.fillStyle = hairColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      toast({
        title: "Color Applied",
        description: "Your selected hair color has been applied",
      });
    };
    
    img.src = selectedImage;
  };

  const handleUndo = () => {
    if (undoStack.length === 0 || !canvasRef.current) return;
    
    const lastImage = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, -1));

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    
    img.src = lastImage;
  };

  const handleReset = () => {
    if (!selectedImage || !canvasRef.current) return;
    
    setUndoStack([]);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    
    img.src = selectedImage;
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'hair-simulation.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
    
    toast({
      title: "Image Downloaded",
      description: "Your hair simulation has been downloaded",
    });
  };

  // Add function to apply a braid style
  const applyBraidStyle = () => {
    if (!selectedImage || !canvasRef.current || !selectedBraidStyle) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Save the current image to undo stack
    setUndoStack([...undoStack, canvas.toDataURL()]);
    
    // Create a placeholder for braid style overlay
    const styleOverlay = `data:image/svg+xml,${encodeURIComponent(`
      <svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <filter id="blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <g filter="url(#blur)">
          ${selectedBraidStyle.category === "box" ? `
            <path d="M100,100 Q250,50 400,100 Q350,300 250,350 Q150,300 100,100" fill="none" stroke="${hairColor}" stroke-width="8" />
            <path d="M120,110 Q250,70 380,110 Q340,290 250,330 Q160,290 120,110" fill="none" stroke="${hairColor}" stroke-width="8" />
            <path d="M140,120 Q250,90 360,120 Q330,280 250,310 Q170,280 140,120" fill="none" stroke="${hairColor}" stroke-width="8" />
          ` : selectedBraidStyle.category === "goddess" ? `
            <path d="M100,50 Q300,0 400,50 Q420,200 250,350 Q80,200 100,50" fill="none" stroke="${hairColor}" stroke-width="12" />
            <path d="M130,70 Q300,20 370,70 Q390,190 250,320 Q110,190 130,70" fill="none" stroke="${hairColor}" stroke-width="12" />
          ` : selectedBraidStyle.category === "knotless" ? `
            <path d="M100,100 Q250,50 400,100 Q350,300 250,350 Q150,300 100,100" fill="none" stroke="${hairColor}" stroke-width="6" />
            <path d="M110,110 Q250,60 390,110 Q345,290 250,340 Q155,290 110,110" fill="none" stroke="${hairColor}" stroke-width="6" />
            <path d="M120,120 Q250,70 380,120 Q340,280 250,330 Q160,280 120,120" fill="none" stroke="${hairColor}" stroke-width="6" />
            <path d="M130,130 Q250,80 370,130 Q335,270 250,320 Q165,270 130,130" fill="none" stroke="${hairColor}" stroke-width="6" />
          ` : `
            <path d="M100,80 Q250,30 400,80 Q380,250 250,350 Q120,250 100,80" fill="none" stroke="${hairColor}" stroke-width="10" />
            <path d="M130,90 Q250,40 370,90 Q355,240 250,330 Q145,240 130,90" fill="none" stroke="${hairColor}" stroke-width="10" />
          `}
        </g>
      </svg>
    `)}`;
    
    // Draw the base image and then the style
    const baseImg = new Image();
    baseImg.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;
      
      // Draw original image
      ctx.drawImage(baseImg, 0, 0);
      
      // Draw style overlay with some transparency to blend
      const overlayImg = new Image();
      overlayImg.onload = () => {
        ctx.save();
        
        // Apply overlay with transparency for a more subtle effect
        ctx.globalAlpha = 0.8; 
        
        // Scale and position the overlay to fit the head area
        const scale = 0.7;
        const overlayWidth = baseImg.width * scale;
        const overlayHeight = baseImg.height * scale;
        const x = (baseImg.width - overlayWidth) / 2;
        const y = (baseImg.height - overlayHeight) / 5; // Position at top third for head area
        
        ctx.drawImage(overlayImg, x, y, overlayWidth, overlayHeight);
        ctx.restore();
        
        toast({
          title: "Style Applied",
          description: `${selectedBraidStyle.name} style has been visualized. Book an appointment for the real thing!`,
          duration: 5000,
        });
      };
      
      overlayImg.src = styleOverlay;
    };
    
    baseImg.src = selectedImage;
  };
  
  return (
    <>
      <Helmet>
        <title>Hair Simulator | Braided Beauty</title>
      </Helmet>
      <ClientLayout>
        <div className="container py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold">Hair Simulator</h1>
              <p className="text-muted-foreground mt-1">Visualize different styles and colors before your appointment</p>
            </div>
            <div className="mt-4 md:mt-0">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
                ref={fileInputRef}
              />
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="flex items-center"
              >
                <Camera className="mr-2 h-4 w-4" />
                Upload Your Photo
              </Button>
            </div>
          </div>

          <Tabs 
            defaultValue="color" 
            value={simulationMode} 
            onValueChange={(value) => setSimulationMode(value as "color" | "style")}
            className="mb-6"
          >
            <TabsList className="w-full max-w-md mx-auto">
              <TabsTrigger value="color" className="flex-1">
                <Brush className="mr-2 h-4 w-4" />
                Color Simulator
              </TabsTrigger>
              <TabsTrigger value="style" className="flex-1">
                <Sparkles className="mr-2 h-4 w-4" />
                Braid Styles
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main canvas area */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="p-6 flex items-center justify-center min-h-[500px]">
                  {selectedImage ? (
                    <div className="relative w-full h-full flex flex-col items-center">
                      <canvas 
                        ref={canvasRef} 
                        className="max-w-full max-h-[500px] object-contain border shadow-sm rounded-md"
                      />
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="outline" onClick={handleUndo} disabled={undoStack.length === 0}>
                          <Undo2 className="mr-2 h-4 w-4" />
                          Undo
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Reset
                        </Button>
                        <Button variant="outline" onClick={downloadImage}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        {simulationMode === "color" ? (
                          <Button onClick={applyColorToHair}>
                            <Brush className="mr-2 h-4 w-4" />
                            Apply Color
                          </Button>
                        ) : (
                          <Button 
                            onClick={applyBraidStyle} 
                            disabled={!selectedBraidStyle}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Apply Style
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-12">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Image Selected</h3>
                        <p className="mt-2 text-muted-foreground">
                          Upload a photo to try different {simulationMode === "color" ? "colors" : "braid styles"}
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Select Image
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Right panel: Color picker or braid styles based on mode */}
            <div>
              {simulationMode === "color" ? (
                // Color Mode Panel
                <Card>
                  <CardHeader>
                    <CardTitle>Color Options</CardTitle>
                    <CardDescription>Choose a hair color to try</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="picker">
                      <TabsList className="w-full">
                        <TabsTrigger value="picker" className="flex-1">Color Picker</TabsTrigger>
                        <TabsTrigger value="presets" className="flex-1">Presets</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="picker" className="mt-4">
                        <div className="flex justify-center mb-4">
                          <HexColorPicker color={hairColor} onChange={handleColorChange} />
                        </div>
                        <div className="mt-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-900">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Selected Color:</span>
                            <div className="flex items-center">
                              <div 
                                className="w-6 h-6 rounded-md mr-2" 
                                style={{ backgroundColor: hairColor }}
                              />
                              <span className="text-sm">{hairColor}</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="presets" className="mt-4">
                        <div className="grid grid-cols-2 gap-2">
                          {PRESET_COLORS.map((color, index) => (
                            <div 
                              key={index}
                              onClick={() => handlePresetClick(color.hex)}
                              className={`
                                flex items-center p-2 border rounded-md cursor-pointer
                                ${hairColor === color.hex ? 'ring-2 ring-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                              `}
                            >
                              <div 
                                className="w-8 h-8 rounded-md mr-3"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="text-sm">{color.name}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Color Intensity</span>
                        <span className="text-sm text-muted-foreground">{intensity[0]}%</span>
                      </div>
                      <Slider
                        value={intensity}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={setIntensity}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <p className="text-sm text-muted-foreground mb-4">
                        For best results, use a front-facing photo with clear lighting and your hair visible.
                      </p>
                      
                      <Button 
                        onClick={applyColorToHair} 
                        className="w-full"
                        disabled={!selectedImage}
                      >
                        <Brush className="mr-2 h-4 w-4" />
                        Apply Color to Hair
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Style Mode Panel - Double card stack with BraidTemplates and StylingTips
                <>
                  <BraidTemplates 
                    onSelectStyle={handleBraidStyleSelect} 
                    selectedStyleId={selectedBraidStyle?.id || null} 
                  />
                  
                  <div className="mt-6">
                    <StylingTips selectedStyle={selectedBraidStyle} />
                  </div>
                  
                  {selectedBraidStyle && (
                    <div className="mt-6">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <h3 className="text-lg font-semibold text-center mb-2">Ready to try this style?</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                              Book an appointment to get your {selectedBraidStyle.name} done by our expert stylists.
                            </p>
                            <Link href={`/booking?service=${encodeURIComponent(selectedBraidStyle.name)}`}>
                              <Button className="w-full" size="lg">
                                Book this Style
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </ClientLayout>
    </>
  );
}