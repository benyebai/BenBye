export const metadata = {
  title: "Benjamin Bai",
  description: "Portfolio of Benjamin Bai."
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body style={{ backgroundColor: '#ffffff' }}>
        {children}
      </body>
    </html>
  );
}



