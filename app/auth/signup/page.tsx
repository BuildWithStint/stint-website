'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { centralAuthAPI } from '@/services/api'
import { buildProductAuthParamString, completeProductAuth, readProductAuthContext } from '@/utils/central-auth'

const signUpSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  agreeTerms: z.boolean().refine((val) => val === true, 'You must agree to the Terms of Service and Privacy Policy'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type SignUpValues = z.infer<typeof signUpSchema>

function SignUpPageContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  })

  const watchPassword = watch('password', '')
  const watchAgreeTerms = watch('agreeTerms', false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const authContext = readProductAuthContext(searchParams)
  const product = authContext.product
  const buildParamString = () => buildProductAuthParamString(authContext)

  const handleSignUpSubmit = async (data: SignUpValues) => {
    setIsLoading(true)
    try {
      const response = await centralAuthAPI.signUp(data.email, data.password, authContext.request)
      setIsLoading(false)
      toast.success('Account created successfully!')
      setTimeout(() => {
        completeProductAuth(response, authContext.destination, router.push)
      }, 500)
    } catch (error) {
      setIsLoading(false)
      toast.error(centralAuthAPI.errorMessage(error))
    }
  }

  const handleGoogleSignUp = async () => {
    if (!watchAgreeTerms) {
      toast.error('You must agree to the Terms of Service')
      return
    }

    setIsGoogleLoading(true)
    try {
      const response = await centralAuthAPI.getGoogleAuthUrl(authContext.request)
      window.location.href = response.url
    } catch (error) {
      setIsGoogleLoading(false)
      toast.error(centralAuthAPI.errorMessage(error))
    }
  }

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!watchPassword) return { width: '0%', color: 'transparent', label: '' }
    if (watchPassword.length < 8) return { width: '25%', color: '#ef4444', label: 'Weak' }
    if (watchPassword.length < 10) return { width: '50%', color: '#f59e0b', label: 'Fair' }
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(watchPassword)) return { width: '100%', color: '#22c55e', label: 'Strong' }
    return { width: '75%', color: '#2b5d3e', label: 'Good' }
  }

  const strength = getPasswordStrength()

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

      {/* ── Left Panel — Branding ── */}
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
                  <>Sign up for<br /><span className="text-[#2b5d3e]">{product}</span></>
                ) : (
                  <>Join the<br /><span className="text-[#2b5d3e]">Collective.</span></>
                )}
              </h1>
              <p className="mt-5 max-w-[360px] text-sm leading-relaxed text-slate-600">
                {product
                  ? `Create a STINT account to securely access ${product}. Your credentials are managed by STINT.`
                  : 'Create your account and start building extraordinary digital products with the STINT team.'}
              </p>
            </motion.div>

            <div className="mt-10 w-16 h-1 rounded-full bg-[#2b5d3e]/80" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="mt-10 space-y-3"
            >
              {[
                'Secure Electronic Health Records (EHR) Management',
                'Appointment Scheduling & Patient Tracking',
                'Prescription & Medication Management',
                'HIPAA-inspired Role-Based Access Control',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#2b5d3e]/10 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#2b5d3e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-600">{feature}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="mt-10 rounded-[28px] border border-[#2b5d3e]/15 bg-white p-6 shadow-[0_20px_70px_rgba(43,93,62,0.08)]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#2b5d3e]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2b5d3e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[12px] font-medium text-slate-950">Patient Data Protection</div>
                  <div className="text-[10px] text-slate-500">Encrypted Records • Secure Authentication</div>
                </div>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Every patient record is securely stored and accessible only to authorized healthcare professionals through role-based access, confidentiality.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 text-sm text-slate-600">
            © {new Date().getFullYear()} STINT · Secured by STINT
          </div>
        </div>
      </div>

      {/* ── Right Panel — Sign Up Form ── */}
      <div className="flex-1 w-full lg:w-[55%] relative flex items-center justify-center px-6 sm:px-12 py-12 bg-[#F5F9F1]">
        <div className="absolute top-[-15%] right-[-15%] w-[520px] h-[520px] rounded-full bg-[#2b5d3e]/10 blur-[120px] pointer-events-none" />

        {/* Back to Home — mobile */}
        <Link
          href="/"
          className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-[10px] font-['DM_Mono'] tracking-[0.15em] uppercase text-slate-500 hover:text-slate-950 transition-colors duration-300 z-10"
        >
          <ArrowLeft size={12} /> Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[460px]"
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              {product ? `Sign up for ${product}` : 'Create Account'}
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {product
                ? 'Create your STINT account to get started'
                : 'Set up your workspace in less than a minute'}
            </p>
          </div>

          <div className="rounded-[32px] border border-[#dfe8dd] bg-white p-8 shadow-[0_20px_80px_rgba(43,93,62,0.08)]">
            {/* Google Button */}
            <button
              type="button"
              disabled={isGoogleLoading || isLoading}
              onClick={handleGoogleSignUp}
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

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="h-px w-full bg-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[10px] uppercase tracking-[0.25em] text-slate-400">or</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleSignUpSubmit)} className="space-y-5">
              {/* Email */}
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
                    <Mail size={16} className={`${focusedField === 'email' ? 'text-[#2b5d3e]' : 'text-slate-400'}`} />
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

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">Password</label>
                <div className={`rounded-2xl border bg-[#F5FBF4] px-3 py-2 transition ${
                  focusedField === 'password'
                    ? 'border-[#2b5d3e]/60 shadow-[0_0_0_4px_rgba(43,93,62,0.08)]'
                    : errors.password
                      ? 'border-red-500/40'
                      : 'border-[#D8E3D4] focus-within:border-[#2b5d3e]/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <Lock size={16} className={`${focusedField === 'password' ? 'text-[#2b5d3e]' : 'text-slate-400'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
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
                {/* Password strength bar */}
                {watchPassword && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 h-[2px] bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: strength.width }}
                        transition={{ duration: 0.3 }}
                        style={{ backgroundColor: strength.color }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 min-w-[36px]">{strength.label}</span>
                  </div>
                )}
                {errors.password && <p className="text-[10px] text-red-500">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">Confirm Password</label>
                <div className={`rounded-2xl border bg-[#F5FBF4] px-3 py-2 transition ${
                  focusedField === 'confirm'
                    ? 'border-[#2b5d3e]/60 shadow-[0_0_0_4px_rgba(43,93,62,0.08)]'
                    : errors.confirmPassword
                      ? 'border-red-500/40'
                      : 'border-[#D8E3D4] focus-within:border-[#2b5d3e]/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <Lock size={16} className={`${focusedField === 'confirm' ? 'text-[#2b5d3e]' : 'text-slate-400'}`} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                      {...register('confirmPassword', { onBlur: () => setFocusedField(null) })}
                      onFocus={() => setFocusedField('confirm')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              {/* Terms */}
              <div className="space-y-1.5">
                <label htmlFor="terms" className="flex items-start gap-2.5 pt-1 cursor-pointer select-none group">
                  <div className="relative mt-[3px]">
                    <input
                      id="terms"
                      type="checkbox"
                      className="sr-only peer"
                      {...register('agreeTerms')}
                    />
                    <div className={`w-4 h-4 rounded border-[1.5px] transition-all duration-200 flex items-center justify-center ${
                      watchAgreeTerms
                        ? 'bg-[#2b5d3e] border-[#2b5d3e]'
                        : 'border-[#D8E3D4] group-hover:border-[#2b5d3e]/40'
                    }`}>
                      {watchAgreeTerms && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 leading-[1.5]">
                    I agree to the{' '}
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-[#2b5d3e]/80 hover:text-[#2b5d3e] transition-colors">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-[#2b5d3e]/80 hover:text-[#2b5d3e] transition-colors">Privacy Policy</a>
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-[10px] text-red-500">{errors.agreeTerms.message}</p>}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                whileTap={{ scale: 0.985 }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2b5d3e] text-sm font-semibold text-white transition hover:bg-[#275240] disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span className="inline-flex h-4 w-4 animate-spin rounded-full border-[3px] border-white/25 border-t-white" />
                ) : (
                  <>
                    {product ? `Sign up for ${product}` : 'Create Account'} <UserPlus size={15} />
                  </>
                )}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                href={`/auth/signin${buildParamString()}`}
                className="font-semibold text-[#2b5d3e] hover:text-[#1f4c34]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7FBF7] flex items-center justify-center">
        <div className="w-6 h-6 border-[1.5px] border-[#2b5d3e]/20 border-t-[#2b5d3e] rounded-full animate-spin" />
      </div>
    }>
      <SignUpPageContent />
    </Suspense>
  )
}
