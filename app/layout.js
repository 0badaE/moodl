import Link from "next/link";
import "./globals.css";
import { Fugaz_One} from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import Head from "./Head";
import Logout from "@/components/Logout";
import { VscGithubAlt } from "react-icons/vsc";




const fugazOne = Fugaz_One({
  subsets: ["latin"],
  variable: "--font-fugaz-one",
  weight: "400",
});


export const metadata = {
  title: "Moodl",
  description: "Track your daily mood everyday of the year.",
};

export default function RootLayout({ children }) {
  const header = (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <Link href={"/"}>
      <h1 className={'text-3xl textGradiant ' + fugazOne.className}>Moodl</h1>
      </Link>
      <Logout/>
    </header>
  );

  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center">
      <a href="https://github.com/0badaE/moodl/tree/main" target="_blank" rel="noopener noreferrer">
        <button>
          <VscGithubAlt size={30} />
        </button>
      </a>
    </footer>
  );

  return (
    <html lang="en">
      <Head/>
      <AuthProvider>
        <body className={`${fugazOne.variable} w-full max-w-[1000px]  mx-auto text-sm sm:text-base min-h-screen flex flex-col  text-slate-800`}>
          {header}
          {children}
          {footer}
        </body>
      </AuthProvider>
    </html>
  );
}
