import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Shield,
  Wifi,
  Monitor,
  Server,
  Mail,
  Clock,
  MessageCircle,
} from 'lucide-react'
import { getServerUser } from '../lib/auth'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    // Redirect to appropriate dashboard based on role
    const isAdmin = user.user_metadata?.role === 'admin'
    throw redirect({ to: isAdmin ? '/admin' : '/dashboard' })
  },
  component: Home,
})

// Replace with your actual WhatsApp business number (digits only, with country code)
const WHATSAPP_NUMBER = '60123456789'
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hello! I need help with my IT subscription.',
)
const WHATSAPP_LINK = 'https://wa.me/message/IIIBPBTDMJ66O1'

type SubscriptionStatus = 'active' | 'expiring' | 'expired'

interface Service {
  id: string
  name: string
  description: string
  status: SubscriptionStatus
  renewalDate: string
  daysLeft: number
  plan: string
  icon: React.ElementType
}

const services: Service[] = [
  {
    id: '1',
    name: 'Antivirus & Security',
    description: 'Endpoint protection for all devices',
    status: 'active',
    renewalDate: '2026-12-31',
    daysLeft: 248,
    plan: 'Business Pro',
    icon: Shield,
  },
  {
    id: '2',
    name: 'Internet Service',
    description: 'Dedicated fibre broadband 500Mbps',
    status: 'active',
    renewalDate: '2026-08-15',
    daysLeft: 110,
    plan: 'Enterprise Fibre',
    icon: Wifi,
  },
  {
    id: '3',
    name: 'Remote Desktop Support',
    description: 'Unlimited remote IT assistance',
    status: 'expiring',
    renewalDate: '2026-05-10',
    daysLeft: 13,
    plan: 'Standard',
    icon: Monitor,
  },
  {
    id: '4',
    name: 'Cloud Backup',
    description: '2TB encrypted cloud storage & backup',
    status: 'active',
    renewalDate: '2026-11-20',
    daysLeft: 207,
    plan: 'Business 2TB',
    icon: Server,
  },
  {
    id: '5',
    name: 'Business Email',
    description: 'Microsoft 365 Business Standard – 10 users',
    status: 'expired',
    renewalDate: '2026-04-01',
    daysLeft: -26,
    plan: 'M365 Business',
    icon: Mail,
  },
]

const statusConfig: Record<
  SubscriptionStatus,
  {
    label: string
    badge: string
    card: string
    icon: React.ElementType
    iconColor: string
  }
> = {
  active: {
    label: 'Active',
    badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    card: 'border-l-4 border-l-emerald-500',
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
  },
  expiring: {
    label: 'Expiring Soon',
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    card: 'border-l-4 border-l-amber-400',
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
  },
  expired: {
    label: 'Expired',
    badge: 'bg-red-100 text-red-700 border border-red-200',
    card: 'border-l-4 border-l-red-500',
    icon: XCircle,
    iconColor: 'text-red-500',
  },
}

const summary = {
  active: services.filter((s) => s.status === 'active').length,
  expiring: services.filter((s) => s.status === 'expiring').length,
  expired: services.filter((s) => s.status === 'expired').length,
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ServiceCard({ service }: { service: Service }) {
  const cfg = statusConfig[service.status]
  const StatusIcon = cfg.icon
  const ServiceIcon = service.icon

  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 ${cfg.card}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-2.5 rounded-lg">
            <ServiceIcon className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {service.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.badge}`}
        >
          {cfg.label}
        </span>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {service.status === 'expired'
              ? `Expired on ${formatDate(service.renewalDate)}`
              : `Renews ${formatDate(service.renewalDate)}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusIcon className={`w-4 h-4 ${cfg.iconColor}`} />
          <span className="text-xs font-medium text-gray-600">
            {service.status === 'expired'
              ? `${Math.abs(service.daysLeft)}d overdue`
              : `${service.daysLeft}d left`}
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-400">
        Plan: <span className="text-gray-600 font-medium">{service.plan}</span>
      </div>
    </div>
  )
}

function WhatsAppButton() {
  const href = WHATSAPP_LINK
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm">Chat with us</span>
    </a>
  )
}

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My IT Subscriptions
          </h1>
          <p className="text-gray-500 mt-1">
            Overview of all your active IT services and support plans.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 text-center border-t-4 border-t-emerald-500">
            <p className="text-3xl font-bold text-emerald-600">
              {summary.active}
            </p>
            <p className="text-sm text-gray-500 mt-1">Active</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 text-center border-t-4 border-t-amber-400">
            <p className="text-3xl font-bold text-amber-500">
              {summary.expiring}
            </p>
            <p className="text-sm text-gray-500 mt-1">Expiring Soon</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 text-center border-t-4 border-t-red-500">
            <p className="text-3xl font-bold text-red-500">{summary.expired}</p>
            <p className="text-sm text-gray-500 mt-1">Expired</p>
          </div>
        </div>

        {/* Service list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Help note */}
        <p className="text-center text-xs text-gray-400 mt-10">
          Need help renewing a service? Tap the WhatsApp button to reach our
          support team instantly.
        </p>
      </div>

      <WhatsAppButton />
    </div>
  )
}
