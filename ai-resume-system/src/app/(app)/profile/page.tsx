"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { auth, googleProvider } from "@/lib/firebase";

function getFirebaseErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";

  switch (code) {
    case "auth/email-already-in-use":
      return "This email already has an account. Please sign in instead.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign in was closed before it finished.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function ProfilePage() {
  const { user, configured, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"signin" | "join">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const redirectAfterAuth = () => {
    const next = searchParams.get("next");
    router.replace(next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
  };

  const handleSubmit = async () => {
    if (!auth) {
      setError("Firebase is not configured yet. Add Firebase env variables and redeploy.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      if (tab === "signin") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(credential.user, {
          displayName: email.trim().split("@")[0],
        });
      }
      redirectAfterAuth();
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError("Firebase is not configured yet. Add Firebase env variables and redeploy.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);
      redirectAfterAuth();
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (user) {
    return (
      <div className="text-white">
        <div className="max-w-md rounded-2xl border border-blue-500/15 bg-[#0b1120] p-5 sm:p-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl">
            {user.displayName?.[0] ?? user.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <h2 className="mb-1 text-xl font-bold">
            {user.displayName ?? user.email?.split("@")[0]}
          </h2>
          <p className="text-sm text-slate-400">{user.email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-6 rounded-xl border border-blue-500/20 px-4 py-2 text-sm text-blue-300 transition-colors hover:bg-blue-500/10"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center bg-[#050912] py-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div
            className="mb-2 inline-flex items-center gap-2 text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-base">
              🧠
            </div>
            ResumeAI
          </div>
          <p className="text-sm text-slate-400">Your AI-powered career companion</p>
        </div>

        <div className="rounded-2xl border border-blue-500/15 bg-[#0b1120] p-5 sm:p-8">
          {!configured && (
            <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-5 text-amber-200">
              Firebase env variables are missing locally. Add them in .env.local for local testing.
            </div>
          )}

          <div className="mb-7 flex border-b border-blue-500/15">
            {(["signin", "join"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm transition-all ${
                  tab === t
                    ? "-mb-px border-b-2 border-blue-500 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t === "signin" ? "Sign In" : "Join Free"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs text-slate-500">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-blue-500/20 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-blue-500/60"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs text-slate-500">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 12 characters..."
                className="w-full rounded-xl border border-blue-500/20 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-blue-500/60"
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {busy
                ? "Please wait..."
                : tab === "signin"
                  ? "Sign In to Dashboard"
                  : "Create Free Account"}
            </button>
            {error && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
                {error}
              </p>
            )}
          </div>

          <div className="relative my-5 text-center text-xs text-slate-600">
            <span className="relative z-10 bg-[#0b1120] px-3">or continue with</span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-500/10" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={busy}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
