import Link from "next/link";
import RainbowText from "@/components/RainbowText";
import RoleButtons from "@/components/RoleButtons";
import Script from 'next/script';

export default function Home() {
  return (
    <div>
      {/* Header */}
      <header>
        <Link href="/" className="logo">InnerQuest</Link>
      </header>

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

      {/* Main Content */}
      <main>
        {/* RainbowText Component */}
        <RainbowText text="Start your InnerQuest!" />
        <h2>Get to know you!</h2>

        {/* Role Selection Buttons */}
        <RoleButtons />
      </main>

      {/* Language Select Dropdown */}
      <div className="language-select">
        <select>
          <option value="select">Select</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
}
