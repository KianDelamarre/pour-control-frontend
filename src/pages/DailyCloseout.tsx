import React, { useState, useEffect } from "react"
import axios from "axios"
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorModal } from "../components/ErrorModal";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, CheckCircle2 } from "lucide-react"

const API_URL = "http://localhost:8080";

// Aligned with the interface defined in Cocktails.tsx
export interface IngredientStock {
    id: number;
    name: string;
    mlInStock: number;
    mlTarget: number;
}

export interface Cocktail {
    id: number;
    name: string;
}

export function DailyCloseout() {
    const [newStockLevels, setNewStockLevels] = useState<Record<number, string>>({});
    const [salesCounts, setSalesCounts] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [stockItems, setStockItems] = useState<IngredientStock[]>([]);

    const handleStockChange = (id: number, value: string) => {
        setNewStockLevels((prev) => ({ ...prev, [id]: value }));
    };

    const handleSalesChange = (id: number, value: string) => {
        setSalesCounts((prev) => ({ ...prev, [id]: value }));
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const [stockRes, cocktailsRes] = await Promise.all([
                    axios.get<IngredientStock[]>(`${API_URL}/api/stock`),
                    axios.get<Cocktail[]>(`${API_URL}/api/cocktails`)
                ]);

                setStockItems(stockRes.data);
                setCocktails(cocktailsRes.data);

                // Pre-fill inputs with current stock values
                const initialStockState: Record<number, string> = {};
                stockRes.data.forEach((item) => {
                    initialStockState[item.id] = String(item.mlInStock);
                });
                setNewStockLevels(initialStockState);

            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setErrorMessage(err.response?.data?.message || err.message);
                } else {
                    setErrorMessage(err instanceof Error ? err.message : "An unknown error occurred");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);


    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            cocktailCloseout: cocktails.reduce((acc, cocktail) => {
                const value = salesCounts[cocktail.id];
                // If value is a valid non-empty string, parse it; otherwise default to 0
                if (value !== undefined && value !== null && value.trim() !== "") {
                    acc[cocktail.id] = Number(value);
                } else {
                    acc[cocktail.id] = 0;
                }
                return acc;
            }, {} as Record<string | number, number>),

            stockCloseout: stockItems.reduce((acc, ing) => {
                const value = newStockLevels[ing.id];
                if (value !== undefined && value !== null && value !== "") {
                    acc[ing.id] = Number(value);
                }
                return acc;
            }, {} as Record<string | number, number>),
        };

        try {
            setIsSubmitting(true);
            setErrorMessage(null);

            // Send closeout data to backend API
            await axios.post(`${API_URL}/api/closeout`, payload);

            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 4000);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setErrorMessage(err.response?.data?.message || err.message);
            } else {
                setErrorMessage(err instanceof Error ? err.message : "Failed to save closeout data");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading inventory..." />;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <header className="flex justify-between items-center pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daily Closeout</h1>
                    <p className="text-muted-foreground text-sm">
                        Record end-of-day ingredient stock levels and daily cocktail sales.
                    </p>
                </div>
            </header>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left Column: Ingredient Stock Cards */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold tracking-tight">Ingredient Stock</h2>
                            <Badge variant="secondary" className="rounded-full">
                                {stockItems.length} Items
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {stockItems.map((ingredient) => (
                                <Card key={ingredient.id}>
                                    <CardHeader className="pb-3 border-b">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base font-semibold leading-tight">
                                                {ingredient.name}
                                            </CardTitle>
                                            <span className="text-xs font-mono text-muted-foreground">
                                                ID: #{ingredient.id}
                                            </span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="bg-muted/50 rounded-md p-2.5 border">
                                                <span className="text-xs text-muted-foreground block uppercase tracking-wider font-medium">
                                                    START OF DAY STOCK
                                                </span>
                                                <span className="text-sm font-semibold">
                                                    {ingredient.mlInStock} ml
                                                </span>
                                            </div>
                                            <div className="bg-muted/50 rounded-md p-2.5 border">
                                                <span className="text-xs text-muted-foreground block uppercase tracking-wider font-medium">
                                                    TARGET / CAPACITY
                                                </span>
                                                <span className="text-sm font-semibold">
                                                    {ingredient.mlTarget} ml
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor={`stock-${ingredient.id}`} className="text-xs font-medium">
                                                New Stock Level (ml)
                                            </Label>
                                            <Input
                                                id={`stock-${ingredient.id}`}
                                                type="number"
                                                min="0"
                                                step="1"
                                                placeholder={`${ingredient.mlInStock}`}
                                                value={newStockLevels[ingredient.id] ?? ""}
                                                onChange={(e) => handleStockChange(ingredient.id, e.target.value)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Right Column: Cocktail Sales Cards */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold tracking-tight">Cocktail Sales</h2>
                            <Badge variant="secondary" className="rounded-full">
                                {cocktails.length} Items
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {cocktails.map((cocktail) => (
                                <Card key={cocktail.id}>
                                    <CardHeader className="pb-3 border-b">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base font-semibold leading-tight">
                                                {cocktail.name}
                                            </CardTitle>
                                            <span className="text-xs font-mono text-muted-foreground">
                                                ID: #{cocktail.id}
                                            </span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor={`sales-${cocktail.id}`} className="text-xs font-medium">
                                                Number Sold Today
                                            </Label>
                                            <Input
                                                id={`sales-${cocktail.id}`}
                                                type="number"
                                                min="0"
                                                step="1"
                                                placeholder="0"
                                                value={salesCounts[cocktail.id] ?? ""}
                                                onChange={(e) => handleSalesChange(cocktail.id, e.target.value)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sticky Footer Action Bar */}
                <footer className="sticky bottom-4 bg-background/95 backdrop-blur border rounded-xl p-4 flex items-center justify-between shadow-lg">
                    <div className="text-sm text-muted-foreground">
                        {isSubmitted ? (
                            <span className="text-emerald-600 font-medium flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4" /> Closeout data successfully recorded!
                            </span>
                        ) : (
                            "Ensure all end-of-day counts are recorded before saving."
                        )}
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                        <Save className="h-4 w-4" /> {isSubmitting ? "Saving..." : "Save Closeout"}
                    </Button>
                </footer>
            </form>

            <ErrorModal
                errorMessage={errorMessage}
                onClose={() => setErrorMessage(null)}
            />
        </div>
    )
}