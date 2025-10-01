export const metadata = {
  title: "Your Name — Portfolio",
  description: "Minimal portfolio of Your Name: developer/designer."
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}



