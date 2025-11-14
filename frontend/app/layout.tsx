import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit'

import { Providers } from "@/components/ProvidersComponents/Provider";
import Header from "@/components/HomePageComponents/Header";
import { ThemeProvider } from "@/components/ProvidersComponents/theme-provider";

import { Toaster } from 'react-hot-toast'

const geistSans = Geist({
  variable: "--font-geist-sans", subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrimStake",
  description: "A Decentralized Staking Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <Header />
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4500,
                style: {
                  background: "rgba(15, 20, 30, 0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  color: "#e2e8f0",
                  fontSize: "14px",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.45)",

                  // 🔥 Fix overflow
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxWidth: "320px",
                },

                success: {
                  iconTheme: { primary: "#22d3ee", secondary: "black" },
                  style: {
                    background: "rgba(0, 40, 60, 0.65)",
                    border: "1px solid rgba(56,189,248,0.4)",
                    color: "#ecfeff",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxWidth: "320px",
                  },
                },

                error: {
                  iconTheme: { primary: "#f43f5e", secondary: "black" },
                  style: {
                    background: "rgba(40, 0, 10, 0.65)",
                    border: "1px solid rgba(248,113,113,0.4)",
                    color: "#ffe4e6",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxWidth: "320px",
                  },
                },

                loading: {
                  iconTheme: { primary: "#818cf8", secondary: "black" },
                  style: {
                    background: "rgba(20, 20, 40, 0.65)",
                    border: "1px solid rgba(129,140,248,0.3)",
                    color: "#e0e7ff",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxWidth: "320px",
                  },
                },
              }}
            />


          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
