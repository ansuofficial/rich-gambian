"use client";

import Image from "next/image";
import { formatMoney } from "@/utils/utils";
import { ProductsTypes } from "@/app/types/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProductIcon } from "@/app/lib/product-icons";

interface ProductCardProps {
  product: ProductsTypes;
  quantity: number;
  canBuy: boolean;
  balance: number;
  onBuy: (product: ProductsTypes) => void;
  onSell: (product: ProductsTypes) => void;
}

export function ProductCard({
  product,
  quantity,
  canBuy,
  balance,
  onBuy,
  onSell,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden border-border/80 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>
      <CardContent className="space-y-3 pt-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight">{product.name}</h3>
            <ProductIcon
              name={product.icon}
              className="size-5 shrink-0 text-muted-foreground"
            />
          </div>
          <Badge variant="secondary" className="font-normal">
            {product.category}
          </Badge>
        </div>
        <p className="font-mono text-2xl font-bold text-foreground">
          {formatMoney(product.price)}
        </p>
      </CardContent>
      <CardFooter className="gap-2 pb-4">
        {quantity > 0 ? (
          <>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => onSell(product)}
            >
              Sell
            </Button>
            <div className="flex min-w-12 items-center justify-center rounded-md border border-border bg-muted px-3 py-2 font-mono font-semibold tabular-nums">
              {quantity}
            </div>
            {canBuy ? (
              <Button
                className="flex-1 bg-gambia-green text-white hover:bg-gambia-green/90"
                onClick={() => onBuy(product)}
              >
                Buy
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <span className="inline-flex flex-1">
                      <Button className="w-full" disabled>
                        Buy
                      </Button>
                    </span>
                  }
                />
                <TooltipContent>
                  Need {formatMoney(product.price - balance)} more
                </TooltipContent>
              </Tooltip>
            )}
          </>
        ) : canBuy ? (
          <Button
            className="w-full bg-gambia-green text-white hover:bg-gambia-green/90"
            onClick={() => onBuy(product)}
          >
            Buy Now
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="inline-flex w-full">
                  <Button className="w-full" disabled>
                    Not Enough Balance
                  </Button>
                </span>
              }
            />
            <TooltipContent>
              Need {formatMoney(product.price - balance)} more
            </TooltipContent>
          </Tooltip>
        )}
      </CardFooter>
    </Card>
  );
}