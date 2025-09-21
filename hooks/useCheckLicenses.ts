import { useRef, useState } from "react";
import type { ResultItem } from "@components/ResultsTable";
import { MAX_ADDRESSES } from "@lib/constants";
import { getBalance } from "@lib/eth";

// --- paramètres anti-batch DRPC ---
const BATCH_SIZE = 2;              // <= 2 pour rester sous la limite free tier
const WAIT_BETWEEN_BATCH_MS = 120; // petit délai pour éviter que DRPC regroupe deux lots

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isValidAddress(addr: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

export default function useCheckLicenses() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  // Permet d'ignorer un "run" obsolète si l'utilisateur relance un check
  const runIdRef = useRef(0);

  const check = async (addresses: string[]) => {
    const snapshot = addresses.slice(0, MAX_ADDRESSES);
    const runId = ++runIdRef.current;

    // État initial : toutes les lignes en "checking"
    setIsChecking(true);
    setResults(snapshot.map((addr) => ({ address: addr, status: "checking" as const })));

    // On associe chaque adresse à son index pour préserver l'ordre
    const indexed = snapshot.map((address, idx) => ({ address, idx }));

    // Découpe en lots de 2
    for (let i = 0; i < indexed.length; i += BATCH_SIZE) {
      // Si un nouveau run a démarré, on abandonne celui-ci
      if (runId !== runIdRef.current) return;

      const chunk = indexed.slice(i, i + BATCH_SIZE);

      // Chaque lot est exécuté en parallèle (max 2 appels simultanés)
      const batch = await Promise.all(
        chunk.map(async ({ address, idx }) => {
          if (!isValidAddress(address)) {
            return { idx, address, status: "invalid" as const, count: 0 };
          }
          try {
            const bal = await getBalance(address); // bigint
            const n = Number(bal);                 // suffisant ici (petits nombres)
            const status = n > 0 ? ("found" as const) : ("not_found" as const);
            return { idx, address, status, count: n };
          } catch (e: any) {
            return {
              idx,
              address,
              status: "error" as const,
              count: 0,
              errorMsg: e?.message ?? "RPC error"
            };
          }
        })
      );

      // Si entre-temps un autre run a démarré, on n'écrase pas ses résultats
      if (runId !== runIdRef.current) return;

      // Écrit les résultats du lot aux bons index (ordre stable)
      setResults((prev) => {
        const next = prev.slice();
        for (const r of batch) {
          next[r.idx] = {
            address: r.address,
            status: r.status,
            errorMsg: (r as any).errorMsg,
            count: r.count
          };
        }
        return next;
      });

      // Petit délai pour éviter que DRPC batch deux lots successifs ensemble
      if (i + BATCH_SIZE < indexed.length) {
        await sleep(WAIT_BETWEEN_BATCH_MS);
      }
    }

    setIsChecking(false);
  };

  return { results, isChecking, check };
}

