import type { FallbackProps } from "react-error-boundary";
import { LuCircleAlert } from "react-icons/lu";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ErrorModalView({ error, resetErrorBoundary }: FallbackProps) {
    if (!error) return null;

    const errorMessage = error instanceof Error ? error.message : String(error);

    return (
        <AlertDialog open={Boolean(error)}>
            <AlertDialogContent className="sm:max-w-[425px] border-destructive">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-transparent text-red-500 size-12">
                        <LuCircleAlert />
                    </AlertDialogMedia>
                    <AlertDialogTitle className="text-destructive">Error</AlertDialogTitle>
                    <AlertDialogDescription className="text-foreground pt-2">
                        {errorMessage}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={resetErrorBoundary}>Dismiss</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
