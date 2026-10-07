import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorModalProps {
    errorMessage: string | null;
    onClose: () => void;
}

export function ErrorModal({ errorMessage, onClose }: ErrorModalProps) {
    return (
        <Dialog open={!!errorMessage} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <DialogTitle>Error Occurred</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2 text-sm text-foreground">
                        {errorMessage}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>
                        Dismiss
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}