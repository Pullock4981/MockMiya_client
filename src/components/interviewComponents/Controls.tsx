


"use client";

type Props = {
  onLeave: () => void;
};

export default function Controls({ onLeave }: Props) {
  return (
    <div className="mt-4">
      <button
        onClick={onLeave}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Leave Interview
      </button>
    </div>
  );
}
