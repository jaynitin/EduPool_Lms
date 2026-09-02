// src/components/EnrollModal.jsx
import { X, ShoppingCart } from 'lucide-react';

export default function EnrollModal({ open, course, submitting, onClose, onConfirm }) {
  if (!open || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary/50 hover:text-primary"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-full bg-tertiary/15 flex items-center justify-center mb-4">
          <ShoppingCart size={20} className="text-tertiary" />
        </div>

        <h2 className="font-display text-lg text-primary mb-1">Confirm Enrollment</h2>
        <p className="text-sm text-secondary/60 mb-4">
          You're about to enroll in:
        </p>

        <div className="bg-secondary/5 rounded-lg p-3 mb-5">
          <p className="text-sm font-semibold text-primary">{course.title}</p>
          <p className="text-xs text-secondary/60 mt-1">{course.category ?? 'General'}</p>
          <p className="text-sm font-semibold text-tertiary mt-2">
            {course.price != null ? `₹${course.price}` : 'Free'}
          </p>
        </div>

        {/* TODO: payment gateway integration goes here — this is where a
            Razorpay/Stripe checkout would open before calling onConfirm */}

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-secondary/20 text-primary text-sm font-medium py-2.5 rounded-lg hover:bg-secondary/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 bg-primary text-white text-sm font-medium py-2.5 rounded-lg hover:bg-secondary transition disabled:opacity-60"
          >
            {submitting ? 'Processing...' : 'Confirm & Enroll'}
          </button>
        </div>
      </div>
    </div>
  );
}