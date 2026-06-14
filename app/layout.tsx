import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import Script from "next/script";
import { site } from "@/lib/content";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "MVI Lab - Vision, Innovation, Impact",
  description: "Leading innovation and research laboratory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSans.variable} suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${notoSans.className} flex min-h-full flex-col bg-[#f9f9f9] text-[#333] antialiased`}
        suppressHydrationWarning
      >
        <Script id="font-size-init" strategy="beforeInteractive">
          {`(function(){try{var v=localStorage.getItem("font-size-level");if(v==="0"||v==="1"||v==="2"||v==="3")document.documentElement.setAttribute("data-font-size-level",v)}catch(e){}})();`}
        </Script>
        {children}
      </body>
    </html>
  );
}
