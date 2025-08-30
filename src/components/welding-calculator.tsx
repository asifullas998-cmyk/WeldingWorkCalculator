
"use client"

import { useRef, useState } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResultsTable } from "./results-table"
import { useToast } from "@/hooks/use-toast"
import { Download, Ruler, Share2, Sparkles, SlidersHorizontal, Clock } from "lucide-react"

type SpacingPlan = {
  rod: number
  start: number
  end: number
}

type SpacingCalculationResult = {
  coverage: number
  plan: SpacingPlan[]
}

type EstimationResult = {
  rods: number;
  time: number;
}

export function WeldingCalculator() {
  // State for Spacing Calculator
  const [pipeLength, setPipeLength] = useState("")
  const [totalRods, setTotalRods] = useState("")
  const [unit, setUnit] = useState("mm")
  const [spacingResult, setSpacingResult] = useState<SpacingCalculationResult | null>(null)
  
  // State for Material Estimator
  const [jointLength, setJointLength] = useState('');
  const [materialThickness, setMaterialThickness] = useState('');
  const [jointType, setJointType] = useState('butt');
  const [estimationResult, setEstimationResult] = useState<EstimationResult | null>(null);


  // Common state
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast()
  const resultsRef = useRef<HTMLDivElement>(null);

  const unitConversions: { [key: string]: number } = {
    mm: 1,
    cm: 10,
    m: 1000,
    in: 25.4,
    ft: 304.8,
  }

  const handleSpacingCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    setSpacingResult(null);

    const length = parseFloat(pipeLength)
    const rods = parseInt(totalRods, 10)

    if (isNaN(length) || length <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid, positive pipe length.",
      })
      return
    }

    if (isNaN(rods) || rods <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid, positive number of rods.",
      })
      return
    }
    
    if (!Number.isInteger(rods)) {
        toast({
            variant: "destructive",
            title: "Invalid Input",
            description: "Number of rods must be a whole number.",
          })
          return
    }

    const lengthInMm = length * unitConversions[unit]
    const coverageMm = lengthInMm / rods

    const plan: SpacingPlan[] = []

    for (let i = 1; i <= rods; i++) {
      const startMm = (i - 1) * coverageMm
      const endMm = i * coverageMm

      plan.push({
        rod: i,
        start: startMm / unitConversions[unit],
        end: endMm / unitConversions[unit],
      })
    }

    setSpacingResult({
      coverage: coverageMm / unitConversions[unit],
      plan,
    })
  }

  const handleEstimationCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setEstimationResult(null);
  
    const length = parseFloat(jointLength);
    const thickness = parseFloat(materialThickness);
  
    if (isNaN(length) || length <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter a valid, positive joint length.',
      });
      return;
    }
  
    if (isNaN(thickness) || thickness <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter a valid, positive material thickness.',
      });
      return;
    }

    // Constants for estimation (these are simplified, real-world values vary)
    const rodLengthMm = 350; // Standard welding rod length
    const depositionRateFactor: { [key: string]: number } = { // volume per mm of weld
      butt: 1.2,
      fillet: 0.5,
      lap: 0.6,
    };
    const weldingSpeedMmPerMin = 150; // Average speed for estimation

    const weldVolume = length * thickness * (depositionRateFactor[jointType] || 1);
    
    // Assume a 3.2mm rod has a volume of roughly 2800 mm^3
    const rodVolume = 2800;
    const rodsNeeded = Math.ceil(weldVolume / rodVolume);

    const timeMinutes = (length / weldingSpeedMmPerMin);

    setEstimationResult({
      rods: rodsNeeded,
      time: timeMinutes,
    });
  };
  
  const handleSavePdf = async () => {
    if (!resultsRef.current) return;
    setIsSaving(true);
  
    try {
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        backgroundColor: null, 
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("welding-plan.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "PDF Generation Failed",
        description: "Could not save the plan as a PDF. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleShare = async () => {
    if (!resultsRef.current) return;

    if (!navigator.share) {
      toast({
        variant: "destructive",
        title: "Sharing Not Supported",
        description: "Your browser does not support the Web Share API.",
      });
      return;
    }

    setIsSharing(true);
    try {
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        backgroundColor: null,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
            toast({
                variant: "destructive",
                title: "Sharing Failed",
                description: "Could not create image for sharing.",
            });
            setIsSharing(false);
            return;
        }

        const file = new File([blob], "welding-plan.png", { type: "image/png" });

        try {
          await navigator.share({
            title: "Welding Plan",
            text: "Here is the welding plan I generated with WeldEase Planner.",
            files: [file],
          });
        } catch (error) {
            if (error instanceof DOMException && (error.name === 'AbortError' || error.name === 'NotAllowedError')) {
                // User cancelled the share sheet or permission was denied
                // Do not show an error toast in this case
            } else if (error instanceof Error) {
                console.error("Error sharing:", error);
                toast({
                  variant: "destructive",
                  title: "Sharing Failed",
                  description: "There was an error trying to share the plan.",
                });
            }
        } finally {
            setIsSharing(false);
        }
      }, "image/png");

    } catch (error) {
      console.error("Error creating share image:", error);
      toast({
        variant: "destructive",
        title: "Sharing Failed",
        description: "Could not prepare the plan for sharing. Please try again.",
      });
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m14 12-2-2-2 2"/><path d="m12 14 2 2 2-2"/></svg>
            WeldEase Planner
          </CardTitle>
          <CardDescription className="text-lg">
            A toolkit for welders: calculate rod spacing and estimate materials.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="spacing-calculator">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="spacing-calculator">Spacing Calculator</TabsTrigger>
                <TabsTrigger value="material-estimator">Material Estimator</TabsTrigger>
              </TabsList>
              
              <TabsContent value="spacing-calculator" className="pt-6">
                <form onSubmit={handleSpacingCalculate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="pipe-length" className="text-base font-medium">Pipe Length</Label>
                      <Input
                        id="pipe-length"
                        type="number"
                        placeholder="e.g., 6000"
                        value={pipeLength}
                        onChange={(e) => setPipeLength(e.target.value)}
                        className="text-base"
                        step="any"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit" className="text-base font-medium">Unit</Label>
                      <Select value={unit} onValueChange={setUnit}>
                        <SelectTrigger id="unit" className="w-full text-base">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mm">Millimeters (mm)</SelectItem>
                          <SelectItem value="cm">Centimeters (cm)</SelectItem>
                          <SelectItem value="m">Meters (m)</SelectItem>
                          <SelectItem value="in">Inches (in)</SelectItem>
                          <SelectItem value="ft">Adi (ft)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="total-rods" className="text-base font-medium">Total Welding Rods</Label>
                      <Input
                        id="total-rods"
                        type="number"
                        placeholder="e.g., 12"
                        value={totalRods}
                        onChange={(e) => setTotalRods(e.target.value)}
                        className="text-base"
                        step="1"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full md:w-auto text-base font-semibold" size="lg">
                    <Sparkles className="mr-2 h-5 w-5" /> Calculate Spacing
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="material-estimator" className="pt-6">
                <form onSubmit={handleEstimationCalculate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="joint-length" className="text-base font-medium">Joint Length (mm)</Label>
                      <Input
                        id="joint-length"
                        type="number"
                        placeholder="e.g., 1000"
                        value={jointLength}
                        onChange={(e) => setJointLength(e.target.value)}
                        className="text-base"
                        step="any"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="material-thickness" className="text-base font-medium">Material Thickness (mm)</Label>
                      <Input
                        id="material-thickness"
                        type="number"
                        placeholder="e.g., 10"
                        value={materialThickness}
                        onChange={(e) => setMaterialThickness(e.target.value)}
                        className="text-base"
                        step="any"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="joint-type" className="text-base font-medium">Joint Type</Label>
                      <Select value={jointType} onValueChange={setJointType}>
                        <SelectTrigger id="joint-type" className="w-full text-base">
                          <SelectValue placeholder="Select joint type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="butt">Butt Joint</SelectItem>
                          <SelectItem value="fillet">Fillet Joint</SelectItem>
                          <SelectItem value="lap">Lap Joint</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full md:w-auto text-base font-semibold" size="lg">
                    <SlidersHorizontal className="mr-2 h-5 w-5" /> Calculate Estimate
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
        </CardContent>
      </Card>

      <div ref={resultsRef} className="space-y-8 p-4 bg-background">
        {(spacingResult || estimationResult) && (
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <CardTitle>Calculation Results</CardTitle>
                <div className="flex gap-2">
                    <Button onClick={handleShare} disabled={isSharing} variant="outline">
                        <Share2 className="mr-2 h-5 w-5" />
                        {isSharing ? "Sharing..." : "Share Plan"}
                    </Button>
                    <Button onClick={handleSavePdf} disabled={isSaving} variant="outline">
                        <Download className="mr-2 h-5 w-5" />
                        {isSaving ? "Saving..." : "Save as PDF"}
                    </Button>
                </div>
            </div>
        )}

        {spacingResult && (
          <div className="space-y-8">
            <Card className="w-full bg-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Ruler className="h-6 w-6" />
                  Spacing Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  Each rod covers an average of <span className="text-accent font-extrabold">{spacingResult.coverage % 1 === 0 ? spacingResult.coverage : spacingResult.coverage.toFixed(2)} {unit}</span>.
                </p>
              </CardContent>
            </Card>
            <ResultsTable plan={spacingResult.plan} unit={unit} />
          </div>
        )}

        {estimationResult && (
          <div className="space-y-8">
            <Card className="w-full bg-primary/10 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <SlidersHorizontal className="h-6 w-6" />
                        Material Estimation
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-2xl font-bold">
                        Estimated Rods Needed: <span className="text-accent font-extrabold">{estimationResult.rods}</span>
                    </p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                       <Clock className="h-6 w-6" /> Estimated Welding Time: <span className="text-accent font-extrabold">{estimationResult.time.toFixed(1)} minutes</span>
                    </p>
                </CardContent>
            </Card>
          </div>
        )}
      </div>

      <footer className="text-center text-sm text-muted-foreground py-4">
        <p>Developed by Asifulla S</p>
      </footer>
    </div>
  )
}

    