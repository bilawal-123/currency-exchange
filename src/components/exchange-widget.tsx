"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
type RateRow = {
    code: string;
    rateToGBP: number;
};

const CURRENCIES = ["USD", "EUR", "CHF", "AUD", "CAD"] as const;
const FLAG_MAP: Record<string, string> = {
    USD: "/images/flags/us.jpg",
    EUR: "/images/flags/eu.jpg",
    CHF: "/images/flags/ch.jpg",
    CAD: "/images/flags/ca.jpg",
    AUD: "/images/flags/au.jpg"
};
const CURRENCY_NAMES: Record<string, string> = {
    USD: "United States Dollar",
    EUR: "Euro",
    CHF: "Swiss Franc",
    AUD: "Australian Dollar",
    CAD: "Canadian Dollar",
};
export function ExchangeWidget() {
    const [rates, setRates] = useState<RateRow[]>([]);
    const [base] = useState<string>("GBP");
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRates = async () => {
        try {
            setError(null);

            const url = `/api/rates`;
            const res = await fetch(url);

            if (!res.ok) {
                const msg = await res.text();
                console.error("Backend error:", res.status, msg);
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();

            const mapped: RateRow[] = CURRENCIES.map((code) => ({
                code,
                rateToGBP: data.rates?.[code] ?? 0,
            }));

            setRates(mapped);
            setLastUpdated(new Date());
        } catch (err) {
            console.error(err);
            setError("Failed to load rates");
        } finally {
            setRefreshing(false);
        }
    };

    const handleRefreshClick = () => {
        setRefreshing(true);
        fetchRates();
    };

    useEffect(() => {
        setRefreshing(true);
        fetchRates();
    }, [base]);

    const formatTime = (date: Date | null) => {
        if (!date) return "—";
        return date.toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <>
            {/* Becuase of time shortage I didn't create a design system  */}
            <section className="w-full max-w-xl bg-gray-100 border-2 border-green-700 shadow-xl">
                <header className="flex items-center justify-between gap-4 bg-green-700 p-2">
                    <div>
                        <h1 className="text-sm font-semibold tracking-tight text-white">
                            Exchange Rates{" "}
                            <small className="text-xs">
                                <span className="font-medium text-slate-100">
                                    &nbsp;Base currency: {base}
                                </span>
                            </small>
                        </h1>
                    </div>

                    {/* We can create our custom components by extending this button if we are using the design system */}
                    <button
                        type="button"
                        onClick={handleRefreshClick}
                        disabled={refreshing}
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-white hover:cursor-pointer hover:bg-slate-900 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
                    >
                        {refreshing ? "Refreshing…" : "Refresh"}
                    </button>
                </header>

                <div className="p-2">
                    <div className="font-bold text-right">1 {base} =</div>

                    {error && (
                        <p className="px-3 pb-2 text-red-600 font-medium">
                            {error}
                        </p>
                    )}

                    <ul className="divide-y divide-slate-800">
                        {rates.map((row) => (
                            <li
                                key={row.code}
                                className="px-1 py-3 flex items-center justify-between text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={FLAG_MAP[row.code]}
                                        alt={row.code}
                                        width={40}
                                        height={30}
                                        className=""
                                    />
                                    <div className="flex flex-col leading-tight">
                                        <span className="font-semibold">{CURRENCY_NAMES[row.code]}</span>
                                    </div>
                                </div>

                                <div className="font-mono text-sm font-bold">
                                    {row.rateToGBP.toFixed(3)}
                                </div>
                            </li>
                        ))}

                        {rates.length === 0 && !error && (
                            <li className="px-3 py-3 text-center text-green-700">
                                Loading the latest rates…
                            </li>
                        )}
                    </ul>
                </div>

                <footer className="flex justify-end gap-2 p-2 text-sm font-semibold">
                    <span>Rates:</span>
                    <span>{formatTime(lastUpdated)}</span>
                </footer>
            </section>
        </>
    );
}
