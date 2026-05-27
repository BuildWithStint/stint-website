'use client'

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
}

interface DialogFooterProps {
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog Content */}
      <div className="relative z-50 w-full max-w-md mx-4">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className = '' }: DialogContentProps) {
  return (
    <div className={`bg-card border border-border rounded-lg shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return (
    <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
      {children}
    </div>
  );
}

export function DialogTitle({ children }: DialogTitleProps) {
  return (
    <h3 className="text-lg font-semibold leading-none tracking-tight text-foreground">
      {children}
    </h3>
  );
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  return (
    <p className="text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function DialogFooter({ children }: DialogFooterProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6">
      {children}
    </div>
  );
}

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default'
}: AlertDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              variant === 'destructive'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-accent text-background hover:bg-accent/90'
            }`}
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}