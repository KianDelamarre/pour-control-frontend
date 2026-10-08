import React, { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorModal } from "../components/ErrorModal";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, FileText, Loader2, Download, Printer, RefreshCw } from "lucide-react";

const API_URL = "http://localhost:8080";

interface ReportResponse {
    report: string;
}

interface ReorderResponse {
    reorder: string;
}

export function Reports() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasReport, setHasReport] = useState<boolean>(false);
    const [generatedDate, setGeneratedDate] = useState<Date | undefined>(undefined);

    const [reportString, setReportString] = useState<string | null>(null);
    const [reorderString, setReorderString] = useState<string | null>(null);

    const handleGenerateReport = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!date) return;

        try {
            setIsLoading(true);
            setErrorMessage(null);

            const formattedDate = format(date, "yyyyMMdd");

            // Fetch both report and reorder endpoints concurrently
            const [reportRes, reorderRes] = await Promise.all([
                axios.get<ReportResponse>(`${API_URL}/api/report/${formattedDate}`),
                axios.get<ReorderResponse>(`${API_URL}/api/reorder/${formattedDate}`),
            ]);

            setReportString(reportRes.data.report);
            setReorderString(reorderRes.data.reorder);
            setGeneratedDate(date);
            setHasReport(true);
        } catch (err) {
            setHasReport(false);
            if (axios.isAxiosError(err)) {
                setErrorMessage(err.response?.data?.message || err.message);
            } else {
                setErrorMessage(err instanceof Error ? err.message : "An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header with Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daily Reports</h1>
                    <p className="text-muted-foreground text-sm">
                        Select a date to calculate and generate end-of-day sales, inventory, and reorder metrics.
                    </p>
                </div>

                {/* Controls Bar: Date Picker + Generate Action */}
                <form onSubmit={handleGenerateReport} className="flex items-center gap-3 w-full sm:w-auto">
                    <Popover>
                        <PopoverTrigger
                            type="button"
                            className={`inline-flex items-center justify-start rounded-md text-sm font-normal ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[220px] ${!date ? "text-muted-foreground" : ""}`}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
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
                <LoadingSpinner text="Calculating daily sales, depletion, and reorder metrics..." />
            ) : hasReport ? (
                /* Report Active State */
                <div className="space-y-4">
                    {/* Toolbar for active report */}
                    <div className="flex items-center justify-between bg-muted/40 p-4 rounded-lg border">
                        <div>
                            <p className="text-sm font-semibold">
                                Showing Data for: <span className="text-primary">{generatedDate ? format(generatedDate, "PPPP") : ""}</span>
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

                    {/* Side-by-Side Containers: 2 Columns on Large Screens */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Daily Sales/Inventory Report */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                <FileText className="h-4 w-4" /> Daily Report
                            </h2>
                            <div className="w-full min-h-[500px] border rounded-xl bg-card p-6">
                                <pre className="text-sm text-foreground font-mono whitespace-pre-wrap leading-relaxed">
                                    {reportString}
                                </pre>
                            </div>
                        </div>

                        {/* Reorder Summary */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                                <RefreshCw className="h-4 w-4" /> Reorder Summary
                            </h2>
                            <div className="w-full min-h-[500px] border rounded-xl bg-card p-6">
                                <pre className="text-sm text-foreground font-mono whitespace-pre-wrap leading-relaxed">
                                    {reorderString}
                                </pre>
                            </div>
                        </div>
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
                            Select a date from the date picker above and click "Generate Report" to build today's stock, sales, and reorder metrics.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}

            {/* Global Error Popup Dialog */}
            <ErrorModal
                errorMessage={errorMessage}
                onClose={() => setErrorMessage(null)}
            />
        </div>
    );
}

export default Reports;