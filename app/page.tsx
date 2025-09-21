"use client";

import { useMemo, useState } from "react";
import AddressTextarea from "@components/AddressTextarea";
import ResultsTable from "@components/ResultsTable";
import CheckButton from "@components/CheckButton";
import { MAX_ADDRESSES, UI } from "@lib/constants";
import useCheckLicenses from "@hooks/useCheckLicenses";

export default function Page() {
  const [rawInput, setRawInput] = useState("");
  const addresses = useMemo(
    () => rawInput.split(/\r?\n/).map(s => s.trim()).filter(Boolean),
    [rawInput]
  );

  const tooMany = addresses.length > MAX_ADDRESSES;
  const { results, isChecking, check } = useCheckLicenses();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tooMany || addresses.length === 0) return;
    void check(addresses.slice(0, MAX_ADDRESSES));
  };

  return (
    <main className="container">
      <h1 className="h1">0G Alignment Node — License Checker</h1>
      <p className="subtitle">Check up to 10 EVM addresses on Arbitrum.</p>

      {/* Card 1 — Input */}
      <form className="card" onSubmit={onSubmit} aria-describedby="helper">
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          EVM Wallet Addresses
        </div>

        <div className="input-row">
          <AddressTextarea
            id="addr"
            value={rawInput}
            onChange={setRawInput}
            placeholder={UI.placeholder}
            ariaInvalid={tooMany || undefined}
            ariaDescribedBy="helper"
          />
          <CheckButton
            disabled={isChecking || tooMany || addresses.length === 0}
            loading={isChecking}
          />
        </div>

        <p id="helper" className="helper mt-8">
          One address per line. Maximum {MAX_ADDRESSES}.
        </p>

        {tooMany && (
          <div className="error" role="alert" style={{ marginTop: 6 }}>
            {UI.tooMany(MAX_ADDRESSES, addresses.length)}
          </div>
        )}
      </form>

      {/* Card 2 — Results */}
      <section className="card compact mt-16">
        <div aria-live="polite" aria-atomic="true">
          {results.length ? (
            <ResultsTable results={results} />
          ) : (
            <p className="helper">
              Enter a wallet and click <strong>Check</strong> to see if you have
              licence on your address.
            </p>
          )}
        </div>
      </section>

      {/* Card 3 — CTA */}
      <section
        className="card"
        style={{
          marginTop: 16,
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>Want to go further?</div>
          <p className="helper">Deploy or buy nodes in minutes.</p>
        </div>
        <a
          className="cta"
          href="https://app.easy-node.xyz/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Deploy or buy a node with EasyNode →
        </a>
      </section>
    </main>
  );
}
