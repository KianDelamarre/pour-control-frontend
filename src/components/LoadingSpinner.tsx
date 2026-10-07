import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    text?: string;
    className?: string;
    iconClassName?: string;
}

export function LoadingSpinner({
    text = "Loading...",
    className,
    iconClassName,
}: LoadingSpinnerProps) {
    return (
        <div
            className={cn(
                "flex min-h-[400px] flex-col items-center justify-center gap-3 text-center",
                className
            )}
        >
            <Loader2 className={cn("h-8 w-8 animate-spin text-primary", iconClassName)} />
            {text && (
                <p className="text-sm font-medium text-muted-foreground">{text}</p>
            )}
        </div>
    );
}