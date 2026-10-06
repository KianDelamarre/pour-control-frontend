import { useState } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Wine, Info, Plus } from "lucide-react"

interface Cocktail {
    id: number
    name: string
    description: string
    ingredients: string[]
    instructions: string[]
}

export function Cocktails() {
    const [cocktails, setCocktails] = useState<Cocktail[]>([
        {
            id: 1,
            name: "Espresso Martini",
            description: "A rich, smooth cocktail made with vodka, fresh espresso, and coffee liqueur.",
            ingredients: ["50ml Vodka", "30ml Coffee Liqueur", "30ml Fresh Espresso"],
            instructions: [
                "Add vodka, espresso, and coffee liqueur into a shaker filled with ice.",
                "Shake vigorously for 15–20 seconds to create a foam layer.",
                "Strain into a chilled martini glass.",
                "Garnish with three coffee beans.",
            ],
        },
        {
            id: 2,
            name: "Margarita",
            description: "A classic cocktail featuring tequila, fresh lime juice, and triple sec.",
            ingredients: ["50ml Tequila", "25ml Fresh Lime Juice", "20ml Triple Sec"],
            instructions: [
                "Rub a lime wedge around the rim of the glass and dip in salt.",
                "Combine tequila, lime juice, and triple sec in a shaker with ice.",
                "Shake well and strain into the salt-rimmed glass filled with fresh ice.",
                "Garnish with a lime wheel.",
            ],
        },
        {
            id: 3,
            name: "Negroni",
            description: "An Italian classic made of equal parts gin, vermouth rouge, and Campari.",
            ingredients: ["30ml Gin", "30ml Sweet Vermouth", "30ml Campari"],
            instructions: [
                "Add gin, sweet vermouth, and Campari to a mixing glass filled with ice.",
                "Stir until well chilled (about 20-30 seconds).",
                "Strain into a rocks glass over a large ice cube.",
                "Garnish with an orange peel.",
            ],
        },
        {
            id: 4,
            name: "Old Fashioned",
            description: "A timeless whiskey drink sweetened with sugar and flavored with bitters.",
            ingredients: ["60ml Bourbon/Rye Whiskey"],
            instructions: [
                "Muddle sugar cube and bitters with a splash of water in a glass.",
                "Add whiskey and a large ice cube.",
                "Stir gently until chilled.",
                "Express orange peel oil over the glass and drop in as garnish.",
            ],
        },
    ])

    // State for More Info Modal
    const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null)

    // State for Add Cocktail Modal & Form Inputs
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newCocktail, setNewCocktail] = useState({
        name: ""
    })

    // Form Submit Handler
    const handleAddCocktail = (e: React.FormEvent) => {
        e.preventDefault()

    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Top Header with Add Button */}
            <div className="flex justify-between items-center pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cocktails & Recipes</h1>
                    <p className="text-muted-foreground text-sm">
                        Select a cocktail to view preparation steps and recipe guidelines.
                    </p>
                </div>

                <Button onClick={() => setIsAddOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Cocktail
                </Button>
            </div>

            {/* Grid of Cocktail Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cocktails.map((cocktail) => (
                    <Card key={cocktail.id} className="flex flex-col justify-between">
                        <div>
                            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3">
                                <div className="p-2.5 bg-muted rounded-md flex items-center justify-center shrink-0">
                                    <Wine className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-base font-semibold leading-tight">
                                    {cocktail.name}
                                </CardTitle>
                            </CardHeader>

                            {/* Ingredients List on Card */}
                            <CardContent className="pb-3">
                                <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                                    Ingredients
                                </h4>
                                <ul className="text-xs text-foreground/80 space-y-1 list-disc list-inside">
                                    {cocktail.ingredients.map((item, idx) => (
                                        <li key={idx} className="truncate">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </div>

                        <CardContent className="pt-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full gap-2 text-xs"
                                onClick={() => setSelectedCocktail(cocktail)}
                            >
                                <Info className="h-3.5 w-3.5" /> More Info
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* More Info Modal */}
            <Dialog open={!!selectedCocktail} onOpenChange={(open) => !open && setSelectedCocktail(null)}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <Wine className="h-5 w-5 text-primary" />
                            <DialogTitle className="text-xl">{selectedCocktail?.name}</DialogTitle>
                        </div>
                        <DialogDescription className="pt-1 text-sm text-muted-foreground">
                            {selectedCocktail?.description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Ingredients Section */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Ingredients
                            </h4>
                            <ul className="grid grid-cols-2 gap-1.5 text-sm">
                                {selectedCocktail?.ingredients.map((ingredient, index) => (
                                    <li key={index} className="flex items-center gap-2 text-foreground/90 font-medium">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Preparation Steps Section */}
                        <div className="space-y-2 pt-2 border-t">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Preparation Steps
                            </h4>
                            <ol className="list-decimal list-inside space-y-2 text-sm">
                                {selectedCocktail?.instructions.map((step, index) => (
                                    <li key={index} className="leading-relaxed pl-1">
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add New Cocktail Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleAddCocktail}>
                        <DialogHeader>
                            <DialogTitle>Add New Cocktail</DialogTitle>
                            <DialogDescription>
                                Enter the details below to add a new drink to the recipe menu.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold">Cocktail Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Mojito"
                                    className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                                    value={newCocktail.name}
                                    onChange={(e) => setNewCocktail({ ...newCocktail, name: e.target.value })}
                                />
                            </div>




                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save Cocktail</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}