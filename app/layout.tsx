import "./globals.css"; // Import global styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>InnerQuest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link 
          rel="icon" 
          href="/favicon.ico" 
          sizes="any"
        />
      </head>
      <body>
        {children} {/* This renders the current page (e.g., Home, Questionnaire) */}
      </body>
    </html>
  );
}
