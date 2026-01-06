import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "@/app/global.css";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import AppProviders from "./providers";

import { LanguageProvider } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "TMS - Chap Chap",
  description: "A platform to help you manage your money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <LanguageProvider>
        <html lang="en" className={`${figtree.variable} ${figtree.variable} antialiased`}>
          <body>
            <header className="flex justify-end items-center p-4 gap-4 h-16 border-b">
              <LanguageSwitcher />
              <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
      </LanguageProvider>
    </AppProviders>
  );
}
