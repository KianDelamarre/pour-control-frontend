import { useState, useEffect } from "react"
import axios from 'axios';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"


const API_URL = "http://localhost:8080";


interface InventoryItem {
    id: number
    name: string
    mlInStock: number
    mlTarget: number
}

export function Inventory() {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [items, setItems] = useState<InventoryItem[]>([]);

    // const [items, setItems] = useState<InventoryItem[]>([
    //     { id: 1, name: "Vodka", stock: 7000, target: 10000 },
    //     { id: 2, name: "Whiskey", stock: 4500, target: 10000 },
    //     { id: 3, name: "Tequila", stock: 2000, target: 10000 },
    //     { id: 4, name: "Pink Gin", stock: 7000, target: 10000 },
    //     { id: 5, name: "Gin", stock: 8500, target: 10000 },
    //     { id: 6, name: "Prosecco", stock: 1500, target: 10000 },
    // ])

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            // Axios automatically parses JSON and throws on non-2xx status codes
            const response = await axios.get<InventoryItem[]>(`${API_URL}/api/stock`);

            setItems(response.data); // Access the response data directly
        } catch (err) {
            // Handling Axios error objects vs generic errors
            if (axios.isAxiosError(err)) {
                setErrorMessage(err.response?.data?.message || err.message);
            } else {
                setErrorMessage(err instanceof Error ? err.message : "An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);




    // Track item being edited in modal
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
    const [newStock, setNewStock] = useState<number>(0)

    const handleOpenEdit = (item: InventoryItem) => {
        setEditingItem(item)
        setNewStock(item.mlInStock)
    }

    const handleSave = async () => {
        if (!editingItem) return;

        try {
            setIsSaving(true);
            setErrorMessage(null);

            // 1. Send PATCH request using axios
            // axios automatically converts objects to JSON and throws if status isn't 2xx
            await axios.put(`${API_URL}/api/stock/updateQuantity/${editingItem.id}`, {
                "quantity": newStock,
            });

            // 2. On success, update React state locally
            setItems((prev) =>
                prev.map((item) =>
                    item.id === editingItem.id ? { ...item, mlInStock: newStock } : item
                )
            );

            // 3. Reset state & close modal
            setEditingItem(null);

        } catch (error) {
            console.error("Save error:", error);

            // Handle standard Axios error object safely
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || "Failed to save stock update.");
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div>Loading inventory...</div>;
    if (errorMessage) return <div>Error: {errorMessage}</div>;
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
                    <p className="text-muted-foreground text-sm">
                        Overview of current bottle levels. Use Daily Closeout for end-of-day logging.
                    </p>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => {
                    const percentage = Math.min(100, Math.round((item.mlInStock / item.mlTarget) * 100))
                    const isLowStock = percentage < 30

                    return (
                        <Card key={item.id} className="border shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                                <div>
                                    <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                                    <CardDescription>Item #{item.id}</CardDescription>
                                </div>
                                <Badge variant={isLowStock ? "destructive" : "secondary"}>
                                    {isLowStock ? "Low Stock" : "In Stock"}
                                </Badge>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Visual Capacity Bar */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                        <span>Capacity Fill</span>
                                        <span className="font-semibold text-foreground">{percentage}%</span>
                                    </div>
                                    <Progress value={percentage} className="h-2" />
                                </div>

                                {/* Clean Metrics Display */}
                                <div className="space-y-2 pt-2 text-sm border-t">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Current Stock:</span>
                                        <span className="font-semibold">{item.mlInStock.toLocaleString()} ml</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Target Stock:</span>
                                        <span className="font-semibold">{item.mlTarget.toLocaleString()} ml</span>
                                    </div>
                                </div>

                                {/* Edit / Restock Action */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-2 gap-2 text-xs"
                                    onClick={() => handleOpenEdit(item)}
                                >
                                    <Pencil className="h-3.5 w-3.5" /> Edit Stock Level
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Edit / Restock Modal */}
            <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update Stock — {editingItem?.name}</DialogTitle>
                        <DialogDescription>
                            Adjust current volume after receiving stock deliveries or manual audits.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock" className="text-right">
                                Stock (ml)
                            </Label>
                            <div className="col-span-3 relative">
                                <Input
                                    id="stock"
                                    type="number"
                                    value={newStock}
                                    onChange={(e) => setNewStock(Number(e.target.value))}
                                    className="pr-10"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                    ml
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingItem(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}