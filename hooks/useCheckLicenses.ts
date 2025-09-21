import { useState } from "react";
import type { ResultItem } from "@components/ResultsTable";
import { MAX_ADDRESSES } from "@lib/constants";

export default function useCheckLicenses() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const check = async (addresses: string[]) => {
    setIsChecking(true);

    // Initialisation des lignes
    setResults(
      addresses.slice(0, MAX_ADDRESSES).map((addr) => ({
        address: addr,
        status: "checking" as const
      }))
    );

    // ⚠️ Étape 2 : on remplacera ce mock par l'appel ethers balanceOf()
    await new Promise((r) => setTimeout(r, 400)); // simulateur rapide

    setResults((prev) =>
      prev.map((r, i) => {
        // Simple mock alternant les résultats
        if (!/^0x[a-fA-F0-9]{40}$/.test(r.address)) {
          return { ...r, status: "invalid" };
        }
        return { ...r, status: i % 2 === 0 ? "found" : "not_found" };
      })
    );

    setIsChecking(false);
  };

  return { results, isChecking, check };
}

