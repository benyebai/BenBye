export const metadata = {
  title: "Benjamin Bai",
  description: "Portfolio of Benjamin Bai."
};

import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="brand-header" aria-hidden="false">
          <Link href="/" className="brand-top-left"><span className="brand-b">B</span><span className="brand-en">EN</span></Link>
          <div className="brand-vertical">AI</div>
        </div>
        {children}
        <nav className="footer-links" aria-label="Social links">
          <a href="https://x.com/benbye" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://www.linkedin.com/in/benjamin-bai-709090210/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:benjamin.bai@uwaterloo.ca">Email</a>
          <a href="https://github.com/benyebai" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </body>
    </html>
  );
}



