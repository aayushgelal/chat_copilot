"use client";

import { useState } from "react";

export default function InputBox({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <div className="mt-4 flex">
      <input
        className="flex-1 border p-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="bg-black text-white px-4"
        onClick={() => {
          onSend(value);
          setValue("");
        }}
      >
        Send
      </button>
    </div>
  );
}