"use client";

import { MoveLeft } from "lucide-react";

export default function UserNotFound() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1>User not found</h1>
        <button
          className="mx-auto mt-4 flex items-center justify-center gap-2"
          onClick={() => {
            window.history.back();
          }}
        >
          <MoveLeft
            size={24}
            className="group-hover:h-9 group-hover:w-9 group-hover:font-bold"
          />
          <p>Go back</p>
        </button>
      </div>
    </div>
  );
}
