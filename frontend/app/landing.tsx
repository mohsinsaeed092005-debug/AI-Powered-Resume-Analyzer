"use client";

import { Sparkles, Zap, Brain, Target, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Brain className="w-8 h-8 text-blue-400" />
          <span>ResumAI</span>
        </div>
        <Link
          href="/resume-analyzer"
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Land Your Dream Job with{" "}
              <span className="text-blue-400">AI-Powered Resume Analysis</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Get real-time feedback on your resume, improve your ATS score, and discover job opportunities that match your profile.
            </p>
            <div className="flex gap-4">
              <Link
                href="/resume-analyzer"
                className="flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-lg transition"
              >
                Analyze Your Resume
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 border-2 border-slate-400 hover:border-blue-400 rounded-lg font-semibold transition">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 blur-3xl"></div>
            <div className="relative bg-slate-800 rounded-lg p-8 border border-slate-700">
              <div className="space-y-4">
                <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-full"></div>
                <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                <div className="h-12 bg-blue-500 rounded mt-6 opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-20 bg-slate-800/50 border-y border-slate-700">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI Resume Analysis",
                desc: "Get intelligent feedback on your resume with actionable improvements"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "ATS Optimization",
                desc: "Ensure your resume passes Applicant Tracking Systems with high scores"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Job Predictions",
                desc: "Discover job opportunities that align with your skills and experience"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 hover:border-blue-400 transition"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose ResumAI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            "Instant AI-powered resume analysis",
            "Real-time ATS score calculation",
            "Personalized job recommendations",
            "Export optimized resume as PDF",
            "Skills gap analysis and suggestions",
            "Competitive advantage insights"
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <p className="text-lg text-slate-300">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg max-w-4xl mx-auto my-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Boost Your Career?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start analyzing your resume with AI today and land your dream job.
          </p>
          <Link
            href="/resume-analyzer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
          >
            Start Free Analysis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-slate-700 text-slate-400 text-center">
        <p>&copy; 2024 ResumAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
