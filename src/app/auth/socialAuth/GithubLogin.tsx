"use client";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";


export default function GithubLoginButton() {
  return (
    <button
      type="button"
      className="w-full py-3 text-green-200 font-bold uppercase transition-all duration-300 shadow-[0_0_5px_rgba(0,255,100,0.5)] hover:shadow-[0_0_10px_rgba(0,255,100,0.7)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-[#1d332e] hover:bg-[#162522] p-3 rounded-lg flex justify-center items-center gap-4"
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
    >
      <FaGithub size={24} />
      Continue with Github
    </button>
  );
}
