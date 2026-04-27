import { useState } from 'react'
import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { Plus, Edit2, Trash2, LogOut, Users, AlertCircle, CheckCircle, Settings } from 'lucide-react'
import { useIdentity } from '../lib/identity-context'
import { getServerUser } from '../lib/auth'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: '/admin' },
      })
    }
    if (user.user_metadata?.role !== 'admin') {
      throw redirect({ to: '/dashboard' })
    }
    return { user }
  },
  component: AdminDashboard,
})

interface UserAccount {
  id: string
  email: string
  name: string
  status: 'active' | 'inactive'
  subscriptions: string[]
  createdAt: string
}

// Mock data - replace with actual API calls
const mockUsers: UserAccount[] = [
  {
    id: '1',
    email: 'client1@example.com',
    name: 'John Doe',
    status: 'active',
    subscriptions: ['Antivirus', 'Cloud Storage'],
    createdAt: '2025-06-15',
  },
  {
    id: '2',
    email: 'client2@example.com',
    name: 'Jane Smith',
    status: 'active',
    subscriptions: ['Network Monitoring', 'Email Encryption'],
    createdAt: '2025-08-20',
  },
  {
    id: '3',
    email: 'client3@example.com',
    name: 'Mike Johnson',
    status: 'inactive',
    subscriptions: ['Server Maintenance'],
    createdAt: '2025-09-10',
  },
]

function AdminDashboard() {
  const { user, logout } = useIdentity()
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserAccount[]>(mockUsers)
  const [showNewUserForm, setShowNewUserForm] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserEmail || !newUserName) return

    const newUser: UserAccount = {
      id: Math.random().toString(),
      email: newUserEmail,
      name: newUserName,
      status: 'active',
      subscriptions: [],
      createdAt: new Date().toISOString().split('T')[0],
    }

    setUsers([...users, newUser])
    setNewUserEmail('')
    setNewUserName('')
    setShowNewUserForm(false)
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const handleToggleUserStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    )
  }

  const activeUsers = users.filter((u) => u.status === 'active').length
  const inactiveUsers = users.filter((u) => u.status === 'inactive').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-5 h-5 text-indigo-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition flex items-center gap-2 text-sm sm:text-base flex-shrink-0"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-lg p-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{activeUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center gap-4 flex-col sm:flex-row">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Accounts
            </h2>
            <button
              onClick={() => setShowNewUserForm(!showNewUserForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Add User
            </button>
          </div>

          {/* New User Form */}
          {showNewUserForm && (
            <div className="px-4 sm:px-6 py-4 bg-blue-50 border-b border-blue-200">
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-base"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-base"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Create User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewUserForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">
                    Services
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((userAccount) => (
                  <tr
                    key={userAccount.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <p className="font-medium text-gray-900 truncate">
                        {userAccount.name}
                      </p>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <p className="text-sm text-gray-600 truncate">
                        {userAccount.email}
                      </p>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          userAccount.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {userAccount.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <p className="text-sm text-gray-600">
                        {userAccount.subscriptions.join(', ') || '-'}
                      </p>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleUserStatus(userAccount.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900"
                          title={
                            userAccount.status === 'active'
                              ? 'Deactivate'
                              : 'Activate'
                          }
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(userAccount.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="px-4 sm:px-6 py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No users yet</p>
              <button
                onClick={() => setShowNewUserForm(true)}
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Create your first user
              </button>
            </div>
          )}
        </div>

        {/* Support & Documentation */}
        <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Admin Tips</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Create user accounts and assign subscriptions</li>
            <li>• Toggle user status to activate or deactivate accounts</li>
            <li>• Users can only view their subscriptions, not edit them</li>
            <li>
              • Users can contact support via WhatsApp at the link provided
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
