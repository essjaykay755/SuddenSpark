import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import DarkModeSwitch from "@/components/DarkModeSwitch";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shower Thoughts",
  description: "Share your random shower thoughts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-white dark:bg-[#0F0D0E] text-black dark:text-white transition-colors duration-200">
            <header className="bg-gray-100 dark:bg-[#231F20] shadow-md transition-colors duration-200">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Shower Thoughts</h1>
                <DarkModeSwitch />
              </div>
            </header>
            <main className="container mx-auto mt-8 px-4">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
