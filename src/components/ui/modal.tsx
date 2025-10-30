import { FC, ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode; // <-- add this
}

const Modal: FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
        <div>{children}</div>
        <button onClick={onClose} className="mt-4 btn-primary">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
