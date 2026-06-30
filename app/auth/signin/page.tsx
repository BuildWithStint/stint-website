'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { centralAuthAPI } from '@/services/api'
import { buildProductAuthParamString, completeProductAuth, readProductAuthContext } from '@/utils/central-auth'

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type SignInValues = z.infer<typeof signInSchema>

function SignPageContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const authContext = readProductAuthContext(searchParams)
  const product = authContext.product
  const buildParamString = () => buildProductAuthParamString(authContext)

  const handleSignInSubmit = async (data: SignInValues) => {
    setIsLoading(true)
    try {
      const response = await centralAuthAPI.signIn(data.email, data.password, authContext.request)
      setIsLoading(false)
      toast.success('Signed in successfully!')
      setTimeout(() => {
        completeProductAuth(response, authContext.destination, router.push)
      }, 500)
    } catch (error) {
      setIsLoading(false)
      toast.error(centralAuthAPI.errorMessage(error))
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const response = await centralAuthAPI.getGoogleAuthUrl(authContext.request)
      window.location.href = response.url
    } catch (error) {
      setIsGoogleLoading(false)
      toast.error(centralAuthAPI.errorMessage(error))
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FBF7] text-slate-950 flex flex-col lg:flex-row">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#EDF7EC',
            color: '#0A0A0B',
            border: '1px solid rgba(43,93,62,0.15)',
            fontSize: '13px',
            fontFamily: "'DM Sans', sans-serif",
          },
        }}
      />

      <div className="flex flex-col w-full lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-[#F6FBF5] via-[#EEF6ED] to-[#E8F1E6]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F6FBF5] via-[#EEF6ED] to-[#E8F1E6]" />
        <div className="absolute top-[10%] left-[5%] w-[420px] h-[420px] rounded-full bg-[#2b5d3e]/10 blur-[160px]" />
        <div className="absolute bottom-[8%] right-[-8%] w-[360px] h-[360px] rounded-full bg-[#2b5d3e]/8 blur-[120px]" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(43,93,62,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(43,93,62,0.12) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
        }} />

        <div className="relative z-10 flex min-h-screen flex-col justify-between p-8 sm:p-10 xl:p-14">
          <div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10"
            >
              <h1 className="text-4xl xl:text-5xl font-['Playfair_Display'] font-bold leading-tight tracking-tight text-slate-950">
                {product ? (
                  <>Sign in to<br /><span className="text-[#2b5d3e]">{product}</span></>
                ) : (
                  <>Design.<br />Build.<br /><span className="text-[#2b5d3e]">Scale.</span></>
                )}
              </h1>
              <p className="mt-5 max-w-[360px] text-sm leading-relaxed text-slate-600">
                {product
                  ? `Use your STINT account to securely access ${product}. Your credentials are managed by STINT.`
                  : 'Access your STINT workspace and manage projects, teams, and deliverables from one unified dashboard.'}
              </p>
            </motion.div>

            <div className="mt-10 w-16 h-1 rounded-full bg-[#2b5d3e]/80" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="mt-10 grid gap-6 sm:grid-cols-3"
            >
              {[
                { value: '150+', label: 'Hospitals' },
                { value: '98%', label: 'Satisfaction' },
                { value: '24/7', label: 'Support' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl font-semibold text-slate-950">{stat.value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-600">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="mt-10 rounded-[28px] border border-[#2b5d3e]/15 bg-white p-6 shadow-[0_20px_70px_rgba(43,93,62,0.08)]"
            >
              <div className="flex gap-2 mb-4">
                {[...Array(5)].map((_, index) => (
                  <span key={index} className="h-3 w-3 rounded-full bg-[#2b5d3e]" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-slate-700 italic">
                "Committed to delivering compassionate, accurate, and patient-centered healthcare with excellence."
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2b5d3e]/10 text-[#2b5d3e] font-semibold">
                  AK
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Arjun K.</p>
                  <p className="text-xs text-slate-500">Founder, TechScale</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 text-sm text-slate-600">
            © {new Date().getFullYear()} STINT · Secured by STINT
          </div>
        </div>
      </div>

      <div className="flex-1 w-full lg:w-[55%] relative flex items-center justify-center px-6 sm:px-12 py-12 bg-[#F5F9F1]">
        <div className="absolute top-[-15%] right-[-15%] w-[520px] h-[520px] rounded-full bg-[#2b5d3e]/10 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[460px]"
        >

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">{product ? `Sign in to ${product}` : 'Sign In'}</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {product ? 'Use your STINT credentials or Google account' : 'Enter your credentials to access your workspace'}
            </p>
          </div>

          <div className="rounded-[32px] border border-[#dfe8dd] bg-white p-8 shadow-[0_20px_80px_rgba(43,93,62,0.08)]">
            <button
              type="button"
              disabled={isGoogleLoading || isLoading}
              onClick={handleGoogleSignIn}
              className="mb-6 flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#2b5d3e] text-sm font-semibold text-white transition hover:bg-[#275240] disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <span className="inline-flex h-4 w-4 animate-spin rounded-full border-[3px] border-white/25 border-t-white" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
              )}
              Continue with Google
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="h-px w-full bg-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[10px] uppercase tracking-[0.25em] text-slate-400">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleSignInSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">Email</label>
                <div className={`rounded-2xl border bg-[#F5FBF4] px-3 py-2 transition ${
                  focusedField === 'email'
                    ? 'border-[#2b5d3e]/60 shadow-[0_0_0_4px_rgba(43,93,62,0.08)]'
                    : errors.email
                      ? 'border-red-500/40'
                      : 'border-[#D8E3D4] focus-within:border-[#2b5d3e]/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className={`text-[#2b5d3e] ${focusedField === 'email' ? 'text-[#2b5d3e]' : 'text-slate-400'}`} />
                    <input
                      type="email"
                      placeholder="name@company.com"
                      className="w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                      {...register('email', { onBlur: () => setFocusedField(null) })}
                      onFocus={() => setFocusedField('email')}
                    />
                  </div>
                </div>
                {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">Password</label>
                  <button
                    type="button"
                    onClick={() => toast('Password reset is not yet available.', { icon: '🔒' })}
                    className="text-[10px] font-medium text-[#2b5d3e]/80 hover:text-[#2b5d3e]"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className={`rounded-2xl border bg-[#F5FBF4] px-3 py-2 transition ${
                  focusedField === 'password'
                    ? 'border-[#2b5d3e]/60 shadow-[0_0_0_4px_rgba(43,93,62,0.08)]'
                    : errors.password
                      ? 'border-red-500/40'
                      : 'border-[#D8E3D4] focus-within:border-[#2b5d3e]/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <Lock size={16} className={`text-[#2b5d3e] ${focusedField === 'password' ? 'text-[#2b5d3e]' : 'text-slate-400'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                      {...register('password', { onBlur: () => setFocusedField(null) })}
                      onFocus={() => setFocusedField('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                {errors.password && <p className="text-[10px] text-red-500">{errors.password.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                whileTap={{ scale: 0.985 }}
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#2b5d3e] text-sm font-semibold text-white transition hover:bg-[#275240] disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-flex h-4 w-4 animate-spin rounded-full border-[3px] border-white/25 border-t-white" />
                ) : (
                  <>
                    {product ? `Continue to ${product}` : 'Sign In'} <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link
                href={`/auth/signup${buildParamString()}`}
                className="font-semibold text-[#2b5d3e] hover:text-[#1f4c34]"
              >
                Create account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function SignPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-[1.5px] border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    }>
      <SignPageContent />
    </Suspense>
  )
}
