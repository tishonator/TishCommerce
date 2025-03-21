import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LocalizationProvider } from "./context/LocalizationContext";

// Load two fonts: one for headings, one for body
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "700"], // normal + bold, for headings
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "700"], // typical body range
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          antialiased
          ${poppins.variable}
          ${inter.variable}
        `}
      >
        <LocalizationProvider>
          <Header />
          {children}
          <Footer />
        </LocalizationProvider>
      </body>
    </html>
  );
}
