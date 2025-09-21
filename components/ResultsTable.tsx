export type ResultItem = {
  address: string;
  status: "unknown" | "checking" | "found" | "not_found" | "invalid" | "error";
  errorMsg?: string;
  count?: number; // ← nombre de licences
};

export default function ResultsTable({ results }: { results: ResultItem[] }) {
  if (!results.length) return null;

  const label = (r: ResultItem) => {
    switch (r.status) {
      case "checking":  return "Checking…";
      case "found":     return "✅ License found";
      case "not_found": return "❌ No license";
      case "invalid":   return "Invalid address";
      case "error":     return r.errorMsg ?? "Error";
      default:          return "—";
    }
  };

  return (
    <table className="table">
      <caption className="sr-only">License check results</caption>
      <thead>
        <tr>
          <th>Address</th>
          <th>Status</th>
          <th>Count</th> {/* nouvelle colonne */}
        </tr>
      </thead>
      <tbody>
        {results.map((r) => (
          <tr key={r.address}>
            <td style={{ wordBreak: "break-all" }}>{r.address}</td>
            <td>{label(r)}</td>
            <td>{typeof r.count === "number" ? r.count : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

