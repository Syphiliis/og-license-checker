// components/JsonLd.tsx
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify sans indentation pour rester léger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

