import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TableIcon } from "lucide-react"

type SpacingPlan = {
    rod: number
    start: number
    end: number
}

interface ResultsTableProps {
    plan: SpacingPlan[]
    unit: string
}

export function ResultsTable({ plan, unit }: ResultsTableProps) {
    const formatNumber = (num: number) => {
        return num % 1 === 0 ? num : num.toFixed(2);
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TableIcon className="h-6 w-6 text-primary" />
                    Spacing Plan
                </CardTitle>
                <CardDescription>
                    The calculated start and end points for each welding rod.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] font-bold text-foreground">Rod #</TableHead>
                                <TableHead className="font-bold text-foreground">Start Point</TableHead>
                                <TableHead className="font-bold text-foreground">End Point</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {plan.map((item, index) => (
                                <TableRow key={item.rod} className={index % 2 === 0 ? 'bg-background' : 'bg-card'}>
                                    <TableCell className="font-medium">{item.rod}</TableCell>
                                    <TableCell>{formatNumber(item.start)} {unit}</TableCell>
                                    <TableCell>{formatNumber(item.end)} {unit}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
