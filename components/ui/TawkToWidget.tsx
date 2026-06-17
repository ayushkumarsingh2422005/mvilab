import Script from "next/script";

const TAWK_PROPERTY_ID = "6a319536b319cc1d4d431fd6";
const TAWK_WIDGET_ID = "1jr8qtofk";

export function TawkToWidget() {
  return (
    <Script
      id="tawk-to"
      strategy="lazyOnload"
      src={`https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`}
      crossOrigin="anonymous"
      charSet="UTF-8"
    />
  );
}
