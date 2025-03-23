"use client"; // Needed because we're using localStorage and onClick events

import { useRouter } from "next/navigation";
import React from "react";

const RoleButtons = () => {
  const router = useRouter();

  const startQuiz = (role: string) => {
    localStorage.setItem("userRole", role);
    console.log('Role saved:', role); // Add logging
    router.refresh(); // Ensure Next.js picks up the localStorage change
    router.push("/questionnaire"); // Redirect to the questionnaire.tsx
  };

  return (
    <div className="identity-button-group">
      <button onClick={() => startQuiz("adolescence")}>Adolescence</button>
      <button onClick={() => startQuiz("undergraduate")}>Undergraduate</button>
      <button onClick={() => startQuiz("working")}>Working Professional</button>
    </div>
  );
};

export default RoleButtons;