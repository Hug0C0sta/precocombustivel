import { Fuel } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="
          rounded-xl
          bg-linear-to-br  from-secondary to-secondary/70
          p-2.5
          shadow-md shadow-emerald-600/20
          transition-transform duration-200
          hover:scale-105
        "
      >
        <Fuel className="size-5 text-white md:size-6" strokeWidth={2.2} />
      </div>

      <h1 className="font-space text-sm font-semibold tracking-tight md:text-base">
        Preço<span className="text-secondary">Combustível</span>
        <span className="text-neutral">.pt</span>
      </h1>
    </div>
  );
}
