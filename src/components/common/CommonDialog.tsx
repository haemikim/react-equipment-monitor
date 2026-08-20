import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CommonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: ReactNode;
  description?: ReactNode;

  headerContent?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;

  className?: string;
  bodyClassName?: string;

  preventOutsideClose?: boolean;
}

export function CommonDialog({
  open,
  onOpenChange,
  title,
  description,
  headerContent,
  children,
  footer,
  className = "",
  bodyClassName = "",
  preventOutsideClose = false,
}: CommonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`
          flex max-h-[90vh] w-[95vw] sm:max-w-7xl flex-col overflow-hidden p-0
          ${className}
        `}
        onPointerDownOutside={(event) => {
          if (preventOutsideClose) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader className="shrink-0 border-b px-6 py-4 text-left">
          <DialogTitle>{title}</DialogTitle>

          {description && <DialogDescription>{description}</DialogDescription>}

          {headerContent && <div className="pt-3">{headerContent}</div>}
        </DialogHeader>

        <div
          className={`
            min-h-0 flex-1 overflow-y-auto px-6 py-5
            ${bodyClassName}
          `}
        >
          {children}
        </div>

        {footer && (
          <DialogFooter className="shrink-0 border-t px-6 py-4">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
