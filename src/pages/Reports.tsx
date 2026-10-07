import React, { useState } from "react"
import { format } from "date-fns"
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon, FileText, Loader2, Download, Printer } from "lucide-react"

export function Reports() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [hasReport, setHasReport] = useState<boolean>(false)
    const [generatedDate, setGeneratedDate] = useState<Date | undefined>(undefined)

    const handleGenerateReport = (e: React.FormEvent) => {
        e.preventDefault()
        if (!date) return

        setIsLoading(true)
        setHasReport(false)

        // Simulate report generation delay
        setTimeout(() => {
            setIsLoading(false)
            setHasReport(true)
            setGeneratedDate(date)
        }, 800)
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header with Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daily Reports</h1>
                    <p className="text-muted-foreground text-sm">
                        Select a date to calculate and generate end-of-day sales and inventory metrics.
                    </p>
                </div>

                {/* Controls Bar: Date Picker + Generate Action */}
                <form onSubmit={handleGenerateReport} className="flex items-center gap-3 w-full sm:w-auto">
                    <Popover>
                        <PopoverTrigger>
                            <Button
                                variant="outline"
                                type="button"
                                className={`w-[220px] justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                autoFocus
                            />
                        </PopoverContent>
                    </Popover>

                    <Button type="submit" disabled={!date || isLoading} className="gap-2">
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isLoading ? "Generating..." : "Generate Report"}
                    </Button>
                </form>
            </div>

            {/* Main Content Area */}
            {isLoading ? (
                /* Loading State */
                <LoadingSpinner text="Calculating daily sales & depletion metrics..." />
            ) : hasReport ? (
                /* Report Active State */
                <div className="space-y-4">
                    {/* Toolbar for active report */}
                    <div className="flex items-center justify-between bg-muted/40 p-4 rounded-lg border">
                        <div>
                            <p className="text-sm font-semibold">
                                Showing Report for: <span className="text-primary">{generatedDate ? format(generatedDate, "PPPP") : ""}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                <Printer className="h-3.5 w-3.5" /> Print
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                <Download className="h-3.5 w-3.5" /> Export PDF
                            </Button>
                        </div>
                    </div>

                    {/* Placeholder div for future report components */}
                    <div className="w-full min-h-[500px] border-2 border-dashed rounded-xl bg-card flex items-center justify-center p-8">
                        <p className="text-sm text-muted-foreground font-mono">
                            [ Detailed Report Analytics & Dashboards Go Here ]
                        </p>
                    </div>
                </div>
            ) : (
                /* Initial Empty State */
                <Card className="min-h-[400px] flex items-center justify-center border-dashed">
                    <CardHeader className="text-center">
                        <div className="mx-auto p-3 bg-muted rounded-full w-fit mb-2">
                            <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-lg font-medium">No Report Generated</CardTitle>
                        <CardDescription className="max-w-sm text-sm">
                            Select a date from the date picker above and click "Generate Report" to build today's stock and sales metrics.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}
        </div>
    )
}

export default Reports