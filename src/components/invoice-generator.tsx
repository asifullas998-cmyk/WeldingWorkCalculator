
"use client";

import { useState, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required."),
  quantity: z.coerce.number().min(0.01, "Quantity must be greater than 0."),
  kgs: z.coerce.number().optional(),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative."),
});

const invoiceSchema = z.object({
  welderName: z.string().min(1, "Welder name is required."),
  clientName: z.string().min(1, "Client name is required."),
  jobDescription: z.string().min(1, "Job description is required."),
  lineItems: z.array(lineItemSchema).min(1, "Please add at least one item."),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export function InvoiceGenerator() {
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      welderName: "Asifulla S",
      clientName: "",
      jobDescription: "",
      lineItems: [{ description: "", quantity: 1, kgs: "" as any, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const watchLineItems = form.watch("lineItems");
  
  const calculateLineItemTotal = (item: any) => {
    const multiplier = (item.kgs > 0 ? item.kgs : item.quantity) || 0;
    const price = item.unitPrice || 0;
    return multiplier * price;
  };

  const subtotal = watchLineItems.reduce(
    (acc, item) => acc + calculateLineItemTotal(item),
    0
  );

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printContents = printContent.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      // Re-add the print button event listener
      window.location.reload();
    }
  };

  function onSubmit(data: InvoiceFormData) {
    toast({
        title: "Invoice Ready!",
        description: "You can now print your invoice using the 'Print Invoice' button.",
    });
    // The form data is now captured in the state. The user can proceed to print.
  }

  return (
    <div className="w-full max-w-5xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Invoice Generator</CardTitle>
          <CardDescription>Create a professional bill for your welding services.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="welderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name (Welder)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Asifulla S" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="md:col-span-2">
                    <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Gate fabrication and installation" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 </div>
              </div>

              <div>
                <Label className="text-lg font-semibold text-primary">Bill Items</Label>
                <div className="mt-2 space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="col-span-4">
                            <FormControl>
                              <Input placeholder="Item description" {...field} />
                            </FormControl>
                             <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormControl>
                              <Input type="number" placeholder="Qty" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name={`lineItems.${index}.kgs`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormControl>
                              <Input type="number" placeholder="Kgs (Optional)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name={`lineItems.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormControl>
                              <Input type="number" placeholder="Price/Unit" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="col-span-2 flex items-center gap-2">
                        <Label className="font-bold text-right w-full pt-2">
                            ₹{calculateLineItemTotal(watchLineItems[index] || {}).toFixed(2)}
                        </Label>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => append({ description: "", quantity: 1, kgs: '' as any, unitPrice: 0 })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold text-primary">
                        <span>Total:</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full md:w-auto">Generate Invoice</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {form.formState.isSubmitSuccessful && (
        <div className="space-y-4">
            <Button onClick={handlePrint} size="lg" className="w-full md:w-auto">
                <Printer className="mr-2 h-5 w-5" /> Print Invoice
            </Button>
            <div id="invoice-preview" ref={invoiceRef} className="p-8 border rounded-lg bg-white text-black shadow-lg hidden print:block">
                <style>{`@media print { body { -webkit-print-color-adjust: exact; } }`}</style>
                <div className="space-y-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
                            <p className="text-gray-500">From: {form.getValues("welderName")}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-semibold text-gray-700">Bill To:</h2>
                            <p>{form.getValues("clientName")}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-gray-600">Job:</h3>
                        <p>{form.getValues("jobDescription")}</p>
                    </div>

                    <Table className="text-black">
                        <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead className="text-black font-bold">Description</TableHead>
                            <TableHead className="text-black font-bold text-center">Quantity</TableHead>
                            <TableHead className="text-black font-bold text-center">Kgs</TableHead>
                            <TableHead className="text-black font-bold text-center">Unit Price</TableHead>
                            <TableHead className="text-black font-bold text-right">Amount</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {form.getValues("lineItems").map((item, index) => (
                            <TableRow key={index}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-center">{item.kgs || "-"}</TableCell>
                            <TableCell className="text-center">₹{item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right">₹{calculateLineItemTotal(item).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>

                    <div className="flex justify-end pt-4">
                        <div className="w-full max-w-xs space-y-2 text-gray-800">
                            <div className="flex justify-between items-center text-2xl font-bold">
                                <span>Total Amount:</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 text-center text-sm text-gray-500">
                        <p>Thank you for your business!</p>
                        <p>Prepared by: {form.getValues("welderName")}</p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
