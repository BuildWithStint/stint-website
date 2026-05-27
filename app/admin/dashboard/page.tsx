'use client'

import { AdminDashboard } from '../../../src/components/pages/AdminDashboard'
import { ProtectedRoute } from '../../../src/components/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
}