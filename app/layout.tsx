import "./globals.css"; // Import global styles
import Script from "next/script";

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

        {/* Google AdSense Setup */}
        <Script 
        async 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1983494775099471" crossOrigin="anonymous"
        strategy="afterInteractive"
        /> 

      </head>

      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-32ZXDHP4RC"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-32ZXDHP4RC');
          `,
        }}
      />
      <body>
        {children} {/* This renders the current page (e.g., Home, Questionnaire) */}
        
        {/* AdSense Display Ad */}
        <Script id="adsense-display" strategy="afterInteractive">
          {`
            (adsbygoogle = window.adsbygoogle || []).push({});
          `}
        </Script>
        <div>
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-1983494775099471"
            data-ad-slot="5886739152"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </body>
    </html>
  );
}
