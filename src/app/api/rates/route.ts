// app/api/rates/route.ts
import { NextResponse } from "next/server";

const CURRENCIES = ["USD", "EUR", "CHF", "AUD", "CAD"] as const;

export async function GET() {
    try {
        const apiKey = process.env.EXCHANGE_API_KEY; // set in .env.local

        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing EXCHANGE_API_KEY" },
                { status: 500 }
            );
        }

        // Provider base (free plan usually forces EUR)
        const providerBase = "EUR";

        // We want USD, EUR, CHF, AUD, CAD + GBP (for conversion)
        const symbols = [...CURRENCIES, "GBP"].join(",");

        const url = `https://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}&base=${providerBase}&symbols=${symbols}`;

        const res = await fetch(url);

        if (!res.ok) {
            const text = await res.text(); // inspect this in your terminal
            console.error("External API error:", res.status, text);
            return NextResponse.json(
                { error: "Failed to fetch rates from provider" },
                { status: 500 }
            );
        }

        const data = await res.json();
        // expected shape: { base: "EUR", rates: { USD: ..., GBP: ..., ... } }

        if (!data.rates || !data.rates.GBP) {
            console.error("Provider response missing GBP rate:", data);
            return NextResponse.json(
                { error: "Provider response invalid (no GBP rate)" },
                { status: 500 }
            );
        }

        const ratesFromEUR: Record<string, number> = data.rates;
        const eurToGBP = ratesFromEUR["GBP"];

        // Convert: 1 GBP = (rate_EUR_to_X / rate_EUR_to_GBP)
        const gbpBasedRates: Record<string, number> = {};

        for (const code of CURRENCIES) {
            const eurToCode = ratesFromEUR[code];
            if (eurToCode) {
                gbpBasedRates[code] = eurToCode / eurToGBP;
            }
        }

        // Respond as if base is GBP
        return NextResponse.json({
            base: "GBP",
            rates: gbpBasedRates,
        });
    } catch (err) {
        console.error("Internal error in /api/rates:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
