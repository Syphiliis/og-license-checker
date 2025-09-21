import { useRef, useState } from "react";
import type { ResultItem } from "@components/ResultsTable";
import { MAX_ADDRESSES } from "@lib/constants";
import { getBalance } from "@lib/eth";

function isValidAddress(addr: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

export default function useCheckLicenses() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const runIdRef = useRef(0);

  const check = async (addresses: string[]) => {
    const snapshot = addresses.slice(0, MAX_ADDRESSES);
    const runId = ++runIdRef.current;

    // Init en "checking"
    setIsChecking(true);
    setResults(snapshot.map((addr) => ({ address: addr, status: "checking" as const })));

    // Lance toutes les requêtes en parallèle, mais on recompose l'ordre à la fin
    const queries = snapshot.map(async (addr, idx) => {
      if (!isValidAddress(addr)) {
        return { idx, address: addr, status: "invalid" as const, count: 0 };
      }
      try {
        const bal = await getBalance(addr);
        const has = bal > 0n;
        return { idx, address: addr, status: has ? "found" as const : "not_found" as const, count: Number(bal) };
      } catch (e: any) {
        return { idx, address: addr, status: "error" as const, count: 0, errorMsg: e?.message ?? "RPC error" };
      }
    });

    const outcomes = await Promise.all(queries);

    // Si un nouveau run a démarré entre-temps, on ignore ces résultats
    if (runId !== runIdRef.current) return;

    // Reconstruit dans l'ordre original
    const next: ResultItem[] = outcomes
      .sort((a, b) => a.idx - b.idx)
      .map(o => ({
        address: o.address,
        status: o.status,
        errorMsg: (o as any).errorMsg,
        count: o.count
      }));

    setResults(next);
    setIsChecking(false);
  };

  return { results, isChecking, check };
}

