import Link from "next/link"
import { Zap, Clock, Gift } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 mt-[10vh]">
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="mx-auto pb-[30px] max-w-4xl bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
        Transform Your YouTube Content Strategy
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
        Generate fresh, engaging ideas for your YouTube channel in seconds. Never run out of content again!
      </p>
      <div className="mt-10 flex flex-col items-center">
        <Link
          href="/videos"
          className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-400 px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-red-500/30"
        >
          Get Started Free
          <svg
            className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <p className="mt-3 text-sm text-gray-500">No credit card required</p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Zap className="h-6 w-6 text-red-500" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-900">AI-Powered</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Clock className="h-6 w-6 text-red-500" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-900">Instant Results</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Gift className="h-6 w-6 text-red-500" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-900">Free to Try</p>
        </div>
      </div>
    </main>
  </div>
  );
}
