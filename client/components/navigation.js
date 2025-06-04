"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import { LayoutDashboard, Plus, BarChart3, Zap, Settings, User } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "New Job", href: "/new-job", icon: Plus },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function NavigationSidebar() {
  const router = useRouter()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">CloudOps</h1>
            <p className="text-xs text-gray-500">Job Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = router.pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-100 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Jobs</span>
              <span className="font-medium text-gray-900">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Queue</span>
              <span className="font-medium text-gray-900">3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">CPU Usage</span>
              <span className="font-medium text-gray-900">67%</span>
            </div>
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Sarah Chen</p>
            <p className="text-xs text-gray-500 truncate">Data Engineer</p>
          </div>
          <Settings className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
      </div>
    </div>
  )
}
