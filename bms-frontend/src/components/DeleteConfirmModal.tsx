// src/components/DeleteConfirmModal.tsx
import { TrashIcon } from "@heroicons/react/24/outline";

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
            <TrashIcon className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-[#1E3A4C]">Delete {itemName}?</h3>
          <p className="text-sm text-gray-500 mt-2">
            Are you sure you want to remove this? This action cannot be undone and will permanently delete the data.
          </p>
        </div>
        <div className="flex border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-4 text-sm font-bold text-white bg-[#1E3A4C] hover:bg-[#1E3A4C] transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}