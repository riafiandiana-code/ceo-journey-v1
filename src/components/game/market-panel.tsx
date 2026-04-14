
"use client"

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Asset, PortfolioItem } from "@/types/game";
import { TrendingUp, Plus, Minus, ArrowUpRight, ArrowDownRight, LayoutDashboard, Wallet, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  YAxis, 
  XAxis,
  Tooltip as ChartTooltip
} from "recharts";

interface MarketPanelProps {
  market: Asset[];
  portfolio: PortfolioItem[];
  onTrade: (id: string, amount: number) => void;
}

export function MarketPanel({ market, portfolio, onTrade }: MarketPanelProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [typeFilter, setTypeFilter] = useState<string>("semua");

  const handleQtyChange = (id: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setQuantities(prev => ({ ...prev, [id]: num }));
  };

  const filteredMarket = typeFilter === "semua" 
    ? market 
    : market.filter(a => a.type === typeFilter);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold flex items-center gap-2 text-neutral-700">
            <TrendingUp className="text-primary w-5 h-5" /> Bursa Global
          </h3>
          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3 text-neutral-400" />
            <select 
              className="text-[10px] font-bold border rounded-lg px-2 h-7 bg-white outline-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="semua">Semua</option>
              <option value="kripto">Kripto</option>
              <option value="saham">Saham</option>
              <option value="komoditas">Komoditas</option>
            </select>
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {filteredMarket.map((asset) => {
            const lastPrice = asset.history[asset.history.length - 2] || asset.price;
            const change = ((asset.price - lastPrice) / lastPrice) * 100;
            const isUp = change >= 0;
            const chartData = asset.history.map((price, i) => ({ price, week: i }));
            const qty = quantities[asset.id] || 0;
            const totalPrice = asset.price * qty;

            return (
              <AccordionItem key={asset.id} value={asset.id} className="border-none bg-white rounded-2xl shadow-md overflow-hidden">
                <AccordionTrigger className="hover:no-underline p-5 group">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
                        {isUp ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-neutral-800 text-sm">{asset.name}</h4>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase">{asset.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">Rp {Math.floor(asset.price).toLocaleString('id-ID')}</p>
                      <p className={cn("text-[10px] font-bold", isUp ? "text-green-600" : "text-red-600")}>
                        {isUp ? "+" : ""}{change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-5 pt-0 space-y-4">
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <Line type="monotone" dataKey="price" stroke={isUp ? "#16a34a" : "#dc2626"} strokeWidth={2} dot={false} />
                        <YAxis hide domain={['auto', 'auto']} />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-2 border rounded shadow-sm text-[10px] font-bold">
                                  Rp {Math.floor(payload[0].value as number).toLocaleString('id-ID')}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input 
                        type="number" 
                        placeholder="Jumlah Unit..." 
                        value={qty || ""}
                        onChange={(e) => handleQtyChange(asset.id, e.target.value)}
                        className="rounded-xl h-10 flex-1"
                      />
                      <div className="text-right min-w-[120px]">
                        <p className="text-[9px] font-bold text-neutral-400 uppercase">Total Harga</p>
                        <p className="text-xs font-bold text-primary">Rp {Math.floor(totalPrice).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 rounded-xl" onClick={() => { onTrade(asset.id, qty); setQuantities(prev => ({ ...prev, [asset.id]: 0 })); }}>Beli Aset</Button>
                      <Button variant="outline" className="flex-1 rounded-xl" onClick={() => { onTrade(asset.id, -qty); setQuantities(prev => ({ ...prev, [asset.id]: 0 })); }}>Jual Aset</Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 px-2 text-neutral-700">
          <LayoutDashboard className="text-primary w-5 h-5" /> Portofolio Aset
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {portfolio.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-neutral-100 flex flex-col items-center">
              <TrendingUp className="w-8 h-8 text-neutral-200 mb-2" />
              <p className="text-neutral-400 italic text-sm">Belum memiliki aset investasi.</p>
            </div>
          ) : (
            portfolio.map((item) => {
              const asset = market.find(a => a.id === item.assetId);
              if (!asset) return null;
              const value = asset.price * item.quantity;
              const profit = value - (item.averageBuyPrice * item.quantity);
              const profitPct = (profit / (item.averageBuyPrice * item.quantity)) * 100;

              return (
                <Card key={item.assetId} className="border-none shadow-md rounded-2xl bg-white">
                  <CardContent className="p-5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center font-bold text-primary text-xs">
                        {asset.name.substring(0,2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{asset.name}</h4>
                        <p className="text-[10px] text-neutral-400 font-bold">{item.quantity} Unit</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-primary">Rp {Math.floor(value).toLocaleString('id-ID')}</p>
                      <p className={cn("text-[10px] font-bold", profit >= 0 ? "text-green-600" : "text-red-600")}>
                        {profitPct.toFixed(2)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
