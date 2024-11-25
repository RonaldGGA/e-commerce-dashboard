"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  children?: React.ReactNode;
  title: string;
  description: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  description,
  children,
  title,
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <div> {children}</div>
      </DialogContent>
    </Dialog>
  );
};
