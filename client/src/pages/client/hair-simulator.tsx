import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Helmet } from "react-helmet";
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

  return (
    <>
      <Helmet>
        <title>Hair Color Simulator | Braided Beauty</title>
      </Helmet>
      <ClientLayout>
        <div className="container py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold">Hair Color Simulator</h1>
              <p className="text-muted-foreground mt-1">Try different hair colors without the commitment</p>
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
                <Upload className="mr-2 h-4 w-4" />
                Upload Your Photo
              </Button>
            </div>
          </div>

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
                        <Button onClick={applyColorToHair}>
                          <Save className="mr-2 h-4 w-4" />
                          Apply Color
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-12">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Image Selected</h3>
                        <p className="mt-2 text-muted-foreground">
                          Upload a photo to try different hair colors
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
            
            {/* Color picker and controls */}
            <div>
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
                      <div className="mt-4 p-3 border rounded-md bg-gray-50">
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
                              ${hairColor === color.hex ? 'ring-2 ring-primary' : 'hover:bg-gray-50'}
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
                      Apply Color to Hair
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base">Tips for Best Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Use a clear, well-lit photo</li>
                    <li>• Face should be clearly visible</li>
                    <li>• Hair should be visible and untied</li>
                    <li>• Adjust intensity for realistic results</li>
                    <li>• Try multiple colors to find your perfect match</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ClientLayout>
    </>
  );
}