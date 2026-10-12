import { Fuel, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-12 w-full border-t border-neutral/15 bg-bg px-4 py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <Fuel size={17} />
          </div>

          <span className="font-space text-sm font-semibold text-primary">
            Preço<span className="text-secondary">Combustível</span>
            <span className="text-neutral">.pt</span>
          </span>
        </div>

        <div className="text-xs leading-relaxed text-neutral sm:text-right">
          <p>
            Projeto sem fins comerciais, desenvolvido exclusivamente para o
            portfólio de{" "}
            <span className="font-semibold text-primary">Hugo Costa</span>.
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 sm:justify-end">
            Feito com <Heart size={12} className="fill-red-500 text-red-500" />{" "}
            em Portugal
            <span>·</span>© {new Date().getFullYear()} Hugo Costa
          </p>
        </div>
      </div>
    </footer>
  );
}
