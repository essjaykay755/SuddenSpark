"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-12 -right-12 bg-[#FCBA28] text-[#0F0D0E] rounded-full p-2 hover:bg-[#fcc85c] transition-colors duration-200"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <div className="bg-[#0F0D0E] rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
