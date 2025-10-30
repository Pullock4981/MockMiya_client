


"use client";

import { Button } from "../ui/button";

type Props = {
  onLeave: () => void;
};

export default function Controls({ onLeave }: Props) {
  return (
    <div className="mt-4">
      <Button
        onClick={onLeave}
        className=" bg-red-600 text-white hover:bg-red-700 py-2 px-4 rounded-lg"
      >
        Leave Interview
      </Button>
    </div>
  );
}
