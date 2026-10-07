import { useState, useEffect } from "react"
import axios from 'axios';
import { ErrorModal } from "../components/ErrorModal";
import { LoadingSpinner } from "../components/LoadingSpinner";
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
import { Pencil, Target, Loader2 } from "lucide-react"

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

    // Edit Stock State
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [newStock, setNewStock] = useState<number>(0);

    // Edit Target State
    const [editingTargetItem, setEditingTargetItem] = useState<InventoryItem | null>(null);
    const [newTarget, setNewTarget] = useState<number>(0);

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const response = await axios.get<InventoryItem[]>(`${API_URL}/api/stock`);
            setItems(response.data);
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

    useEffect(() => {
        fetchItems();
    }, []);

    // Handlers for Stock Editing
    const handleOpenEdit = (item: InventoryItem) => {
        setEditingItem(item);
        setNewStock(item.mlInStock);
    };

    const handleSave = async () => {
        if (!editingItem) return;

        try {
            setIsSaving(true);
            setErrorMessage(null);

            await axios.put(`${API_URL}/api/stock/updateQuantity/${editingItem.id}`, {
                "quantity": newStock,
            });

            setItems((prev) =>
                prev?.map((item) =>
                    item.id === editingItem.id ? { ...item, mlInStock: newStock } : item
                )
            );

            setEditingItem(null);
        } catch (error) {
            console.error("Save error:", error);
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || "Failed to save stock update.");
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Handlers for Target Editing
    const handleOpenEditTarget = (item: InventoryItem) => {
        setEditingTargetItem(item);
        setNewTarget(item.mlTarget);
    };

    const handleSaveTarget = async () => {
        if (!editingTargetItem) return;

        try {
            setIsSaving(true);
            setErrorMessage(null);

            await axios.put(`${API_URL}/api/stock/updateTargetQuantity/${editingTargetItem.id}`, {
                "quantity": newTarget,
            });

            setItems((prev) =>
                prev?.map((item) =>
                    item.id === editingTargetItem.id ? { ...item, mlTarget: newTarget } : item
                )
            );

            setEditingTargetItem(null);
        } catch (error) {
            console.error("Save target error:", error);
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || "Failed to save target stock update.");
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading inventory..." />;
    }


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
                {items?.map((item) => {
                    const target = item.mlTarget || 0;
                    const rawPercentage = target > 0 ? (item.mlInStock / target) * 100 : 0;
                    const actualPercentage = Math.round(rawPercentage) || 0;
                    const progressValue = Math.min(100, Math.max(0, actualPercentage));

                    const isOutOfStock = item.mlInStock <= 0;
                    const isLowStock = !isOutOfStock && actualPercentage < 30;

                    const getBadgeConfig = () => {
                        if (isOutOfStock) return { label: "Out of Stock", variant: "destructive" as const };
                        if (isLowStock) return { label: "Low Stock", variant: "outline" as const };
                        return { label: "In Stock", variant: "secondary" as const };
                    };

                    const badge = getBadgeConfig();

                    return (
                        <Card key={item.id} className="border shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                                <div>
                                    <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                                    <CardDescription>Item #{item.id}</CardDescription>
                                </div>
                                <Badge variant={badge.variant}>
                                    {badge.label}
                                </Badge>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                        <span>Capacity Fill</span>
                                        <span className="font-semibold text-foreground">{actualPercentage}%</span>
                                    </div>
                                    <Progress value={progressValue} className="h-2" />
                                </div>

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

                                {/* Action Buttons */}
                                <div className="space-y-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2 text-xs"
                                        onClick={() => handleOpenEditTarget(item)}
                                    >
                                        <Target className="h-3.5 w-3.5" /> Edit Target Level
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2 text-xs"
                                        onClick={() => handleOpenEdit(item)}
                                    >
                                        <Pencil className="h-3.5 w-3.5" /> Edit Stock Level
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Edit Stock Modal */}
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
                        <Button variant="outline" onClick={() => setEditingItem(null)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Target Modal */}
            <Dialog open={!!editingTargetItem} onOpenChange={(open) => !open && setEditingTargetItem(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update Target — {editingTargetItem?.name}</DialogTitle>
                        <DialogDescription>
                            Set the standard baseline target volume for this inventory item.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="target" className="text-right">
                                Target (ml)
                            </Label>
                            <div className="col-span-3 relative">
                                <Input
                                    id="target"
                                    type="number"
                                    value={newTarget}
                                    onChange={(e) => setNewTarget(Number(e.target.value))}
                                    className="pr-10"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                    ml
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingTargetItem(null)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveTarget} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Target"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Global Error Popup Dialog */}
            <ErrorModal
                errorMessage={errorMessage}
                onClose={() => setErrorMessage(null)}
            />
        </div>
    )
}