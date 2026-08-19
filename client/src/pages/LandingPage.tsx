import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Bot,
  BrainCircuit,
  Award,
  Sparkles,
  ArrowRight,
  Globe2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <Badge variant="emerald" size="md">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            OOSC 4.0 Hackathon • Problem Statement 2
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            BharatEdu AI
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 font-medium">
            Learn Better. Learn Personally. Learn Equitably.
          </p>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            An AI-powered personalized and equitable education platform built to bridge learning gaps, overcome accessibility barriers, and empower students and teachers across India with grounded, multi-lingual, and low-connectivity educational tools.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/dashboard">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
                Student Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/teacher">
              <Button variant="outline" size="lg" className="border-slate-600 bg-slate-800/80 text-white hover:bg-slate-800">
                Teacher Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Core Platform Pillars */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Platform Core Capabilities</h2>
          <p className="text-slate-500 text-sm mt-1">
            Foundation modules designed to ensure equitable access and personalized growth for every learner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Grounded AI Tutoring</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Curriculum-aligned assistance powered by verified open educational content with verifiable source citations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Learning Gap & Misconception Detection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Diagnostic analytics to pinpoint exact learning hurdles and misconception roots early.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Scholarship & Eligibility Access</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated matching and assistance for educational schemes, stipends, and scholarships.
            </p>
          </div>
        </div>
      </div>

      {/* Principles & Standards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Equitable Access & Inclusivity Standards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Multilingual content support for diverse regional languages.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Voice & Image-based interactive learning modes.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Low-bandwidth & offline-first data optimization.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Teacher insight dashboards and early intervention alerts.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
