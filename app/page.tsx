import Link from "next/link";
import RainbowText from "@/components/RainbowText";
import RoleButtons from "@/components/RoleButtons";

export default function Home() {
  return (
    <div>
      {/* Header */}
      <header>
        <Link href="/" className="logo">InnerQuest</Link>
      </header>

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