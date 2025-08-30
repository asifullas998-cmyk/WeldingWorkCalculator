
"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const joints = [
  {
    name: "Butt Joint",
    imageUrl: "https://picsum.photos/600/400",
    imageHint: "butt weld",
    description: "A joint between two members aligned approximately in the same plane.",
    details: {
      "Preparation": "Ensure edges are clean and properly beveled if required (for thicker materials).",
      "Gap (Root Opening)": "Typically 1-3mm to ensure full penetration. Adjust based on thickness and process.",
      "Angle": "For beveled joints, a 60-75 degree included angle is common.",
      "Rod Position": "Hold the electrode/torch at a 90-degree angle to the plate surface.",
    },
  },
  {
    name: "Fillet Joint",
    imageUrl: "https://picsum.photos/600/400",
    imageHint: "fillet weld",
    description: "A joint where two pieces of metal are connected at a right angle, with welding on the inside corner.",
    details: {
      "Preparation": "Clean surfaces are crucial. No special edge preparation is usually needed.",
      "Gap": "Ensure no gap between the pieces for a strong joint.",
      "Angle": "Hold the electrode/torch at a 45-degree angle between the two pieces.",
      "Rod Position": "Aim the arc directly into the corner of the joint.",
    },
  },
  {
    name: "Lap Joint",
    imageUrl: "https://picsum.photos/600/400",
    imageHint: "lap weld",
    description: "A joint between two overlapping members.",
    details: {
      "Preparation": "Surfaces must be clean. Ensure the plates are in close contact.",
      "Gap": "No gap should exist between the overlapping plates.",
      "Angle": "Angle the electrode/torch at about 60-70 degrees to the horizontal plate.",
      "Rod Position": "Focus the arc on the edge of the top plate to ensure good fusion without excessive melt-through.",
    },
  },
   {
    name: "Corner Joint",
    imageUrl: "https://picsum.photos/600/400",
    imageHint: "corner weld",
    description: "A joint between two members located at an angle to one another at a corner.",
    details: {
        "Preparation": "Clean the edges thoroughly. Beveling may be needed for thick sections.",
        "Gap": "Can be open or closed. An open corner requires filler metal to bridge the gap.",
        "Angle": "Hold the electrode/torch at a 45-degree angle to fuse both pieces equally.",
        "Rod Position": "Direct the arc into the corner. For open corners, use a weaving motion.",
    },
  },
  {
    name: "T-Joint (Tee Joint)",
    imageUrl: "https://picsum.photos/600/400",
    imageHint: "tee weld",
    description: "A joint between two members located at right angles to each other in the form of a 'T'.",
    details: {
        "Preparation": "Ensure the surfaces are clean. The vertical member's edge should be straight.",
        "Gap": "A slight gap might be acceptable, but tight fit-up is preferred.",
        "Angle": "Hold the electrode/torch at a 45-degree angle to the joint.",
        "Rod Position": "Direct the arc into the root of the joint. Use a slight circular motion to ensure fusion on both sides.",
    },
  },
];

export function JointsGuide() {
  return (
    <div className="w-full max-w-5xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">Welding Joints Guide</h1>
        <p className="text-lg text-muted-foreground mt-2">
          A quick reference for common welding joint types, angles, and positions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {joints.map((joint) => (
          <Card key={joint.name} className="flex flex-col">
            <CardHeader>
              <div className="w-full aspect-video relative rounded-md overflow-hidden bg-primary/10 mb-4">
                  <Image 
                      src={joint.imageUrl}
                      alt={`${joint.name} diagram`}
                      fill
                      className="object-cover"
                      data-ai-hint={joint.imageHint}
                  />
              </div>
              <CardTitle className="text-xl font-semibold">{joint.name}</CardTitle>
              <CardDescription>{joint.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 text-sm">
                  {Object.entries(joint.details).map(([key, value]) => (
                      <li key={key}>
                          <strong className="text-primary">{key}:</strong> {value}
                      </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
