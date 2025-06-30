import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
  } from "@/components/ui/alert-dialog"
  
  /**
   * Reusable alert popup using shadcn/ui AlertDialog
   */
  type PopupAlertProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    actionLabel?: string
    onClose?: () => void
  }
  
  export function PopupAlert({
    open,
    onOpenChange,
    title,
    description,
    actionLabel = "OK",
    onClose,
  }: PopupAlertProps) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>
          <span className="hidden" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                onOpenChange(false)
                if (onClose) onClose()
              }}
            >
              {actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }