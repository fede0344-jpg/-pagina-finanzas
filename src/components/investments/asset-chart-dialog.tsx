"use client";

import { useState } from "react";
import { Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TradingViewChart } from "./tradingview-chart";
import { getTradingViewSymbol } from "@/lib/market-data/tradingview";
import type { Asset } from "@/lib/types/domain";

export function AssetChartDialog({ asset }: { asset: Asset }) {
  const [open, setOpen] = useState(false);
  const symbol = getTradingViewSymbol(asset);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm">
            <Maximize2 className="size-4" />
            <span className="sr-only">
              Ver gráfico completo de {asset.name}
            </span>
          </Button>
        }
      />
      <DialogContent className="flex h-[85vh] max-w-4xl flex-col sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{asset.name}</DialogTitle>
          <DialogDescription>
            Gráfico interactivo de TradingView: elegí el rango (día, semana,
            mes o todo), el tipo de gráfico y agregá indicadores. Si el
            símbolo no coincide con el activo, usá la lupa del gráfico para
            buscarlo.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1">
          {open ? <TradingViewChart symbol={symbol} /> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
