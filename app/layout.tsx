import './globals.css'
import type { Metadata } from 'next'
import Script from "next/script";

export const metadata: Metadata = {
  title: 'Hope Harbor | InnerQuest',
  description: 'Discover your emotional state and get personalized guidance',
  icons: {
    icon: [
      {
        url: '/hopeharbor_logo.png',
        href: '/hopeharbor_logo.png',
        type: 'image/png',
        sizes: '32x32'
      },
      {
        url: '/favicon.ico',
        href: '/favicon.ico',
      }
    ],
    apple: {
      url: '/hopeharbor_logo.png',
      sizes: '180x180',
      type: 'image/png',
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children} {/* This renders the current page (e.g., Home, Questionnaire) */}
        
        {/* Google AdSense Setup */}
        <Script 
        async 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1983494775099471" crossOrigin="anonymous"
        strategy="afterInteractive"
        /> 

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
  )
}
