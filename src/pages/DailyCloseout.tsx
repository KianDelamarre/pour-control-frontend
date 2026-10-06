import React, { useState } from "react"
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

interface IngredientStock {
    id: number
    name: string
    currentStockMl: number
    capacityMl: number
}

interface Cocktail {
    id: number
    name: string
}

const INITIAL_INGREDIENTS: IngredientStock[] = [
    { id: 0, name: "Vodka", currentStockMl: 2400, capacityMl: 3000 },
    { id: 1, name: "Gin", currentStockMl: 1800, capacityMl: 2500 },
    { id: 2, name: "Bourbon Whiskey", currentStockMl: 1200, capacityMl: 2000 },
    { id: 3, name: "Sweet Vermouth", currentStockMl: 750, capacityMl: 1000 },
    { id: 4, name: "Campari", currentStockMl: 900, capacityMl: 1000 },
    { id: 5, name: "Tequila Blanco", currentStockMl: 1500, capacityMl: 2200 },
    { id: 6, name: "Triple Sec", currentStockMl: 600, capacityMl: 1000 },
    { id: 7, name: "Coffee Liqueur", currentStockMl: 850, capacityMl: 1200 },
]

const INITIAL_COCKTAILS: Cocktail[] = [
    { id: 0, name: "Espresso Martini" },
    { id: 1, name: "Margarita" },
    { id: 2, name: "Negroni" },
    { id: 3, name: "Old Fashioned" },
    { id: 4, name: "Dry Martini" },
    { id: 5, name: "Boulevardier" },
]

export const DailyCloseout: React.FC = () => {
    const [newStockLevels, setNewStockLevels] = useState<Record<number, string>>({})
    const [salesCounts, setSalesCounts] = useState<Record<number, string>>({})
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    const handleStockChange = (id: number, value: string) => {
        setNewStockLevels((prev) => ({ ...prev, [id]: value }))
    }

    const handleSalesChange = (id: number, value: string) => {
        setSalesCounts((prev) => ({ ...prev, [id]: value }))
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()

        const payload = {
            timestamp: new Date().toISOString(),
            stockUpdates: INITIAL_INGREDIENTS.map((ing) => ({
                ingredientId: ing.id,
                name: ing.name,
                previousStockMl: ing.currentStockMl,
                newStockMl: newStockLevels[ing.id] !== undefined && newStockLevels[ing.id] !== ""
                    ? Number(newStockLevels[ing.id])
                    : ing.currentStockMl,
            })),
            cocktailSales: INITIAL_COCKTAILS.map((cocktail) => ({
                cocktailId: cocktail.id,
                name: cocktail.name,
                numberSoldToday: salesCounts[cocktail.id] !== undefined && salesCounts[cocktail.id] !== ""
                    ? Number(salesCounts[cocktail.id])
                    : 0,
            })),
        }

        console.log("Daily Closeout Submitted Payload:", payload)
        setIsSubmitted(true)
        setTimeout(() => setIsSubmitted(false), 4000)
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Top Header */}
            <header className="flex justify-between items-center pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daily Closeout</h1>
                    <p className="text-muted-foreground text-sm">
                        Record end-of-day ingredient stock levels and daily cocktail sales.
                    </p>
                </div>
            </header>

            {/* Form Container */}
            <form onSubmit={handleSave} className="space-y-8">
                {/* Two-Column Desktop Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left Column: Ingredient Stock Cards */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold tracking-tight">Ingredient Stock</h2>
                            <Badge variant="secondary" className="rounded-full">
                                {INITIAL_INGREDIENTS.length} Items
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {INITIAL_INGREDIENTS.map((ingredient) => (
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
                                                    {ingredient.currentStockMl} ml
                                                </span>
                                            </div>
                                            <div className="bg-muted/50 rounded-md p-2.5 border">
                                                <span className="text-xs text-muted-foreground block uppercase tracking-wider font-medium">
                                                    CAPACITY
                                                </span>
                                                <span className="text-sm font-semibold">
                                                    {ingredient.capacityMl} ml
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
                                                placeholder={`${ingredient.currentStockMl}`}
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
                                {INITIAL_COCKTAILS.length} Items
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {INITIAL_COCKTAILS.map((cocktail) => (
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
                    <Button type="submit" className="gap-2">
                        <Save className="h-4 w-4" /> Save Closeout
                    </Button>
                </footer>
            </form>
        </div>
    )
}

export default DailyCloseout