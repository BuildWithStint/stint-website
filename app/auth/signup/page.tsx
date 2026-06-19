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

const signUpSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
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

  // Read product name and redirect URL from query params
  const product = searchParams.get('product') || ''
  const redirectUrl = searchParams.get('redirect') || ''

  // Build query string to forward params between sign/signup
  const buildParamString = () => {
    const params = new URLSearchParams()
    if (product) params.set('product', product)
    if (redirectUrl) params.set('redirect', redirectUrl)
    const str = params.toString()
    return str ? `?${str}` : ''
  }

  const handleSignUpSubmit = async (data: SignUpValues) => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      toast.success('Account created successfully!')
      setTimeout(() => router.push(`/auth/signin${buildParamString()}`), 1200)
    }, 1500)
  }

  const handleGoogleSignUp = () => {
    if (!watchAgreeTerms) {
      toast.error('You must agree to the Terms of Service')
      return
    }

    setIsGoogleLoading(true)

    setTimeout(() => {
      setIsGoogleLoading(false)
      toast.success('Account created with Google!')
      setTimeout(() => router.push(`/auth/signin${buildParamString()}`), 800)
    }, 1800)
  }

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!watchPassword) return { width: '0%', color: 'transparent', label: '' }
    if (watchPassword.length < 6) return { width: '25%', color: '#ef4444', label: 'Weak' }
    if (watchPassword.length < 10) return { width: '50%', color: '#f59e0b', label: 'Fair' }
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(watchPassword)) return { width: '100%', color: '#22c55e', label: 'Strong' }
    return { width: '75%', color: '#C8973D', label: 'Good' }
  }

  const strength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-background flex">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1d',
            color: '#F2EDE4',
            border: '1px solid rgba(242,237,228,0.15)',
            fontSize: '13px',
            fontFamily: "'DM Sans', sans-serif",
          },
        }}
      />

      {/* ── Left Panel — Branding ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        {/* Layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0f] via-[#111113] to-[#0a0a0b]" />
        <div className="absolute top-[15%] left-[5%] w-[500px] h-[500px] rounded-full bg-[#C8973D]/8 blur-[160px]" />
        <div className="absolute bottom-[5%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#C8973D]/5 blur-[120px]" />

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(242,237,228,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(242,237,228,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Accent border right */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#C8973D]/20 to-transparent" />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-[40%] right-[6%] w-6 h-6 bg-accent/5 rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute bottom-[38%] left-[22%] w-3 h-3 bg-accent/10 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Top: Logo */}
          <div>
            <Link href="/">
              <img
                src="/stint-logo.png"
                alt="STINT Logo"
                className="h-12 w-auto mix-blend-screen filter brightness-[1.2] contrast-[1.1]"
              />
            </Link>
          </div>

          {/* Middle: Main content block */}
          <div className="space-y-6 -mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-4xl xl:text-5xl font-['Playfair_Display'] font-bold text-foreground leading-[1.15] tracking-tight">
                {product ? (
                  <>Sign up for<br /><span className="text-accent">{product}</span></>
                ) : (
                  <>Join the<br /><span className="text-accent">Collective.</span></>
                )}
              </h1>
              <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-[320px]">
                {product
                  ? `Create a STINT account to securely access ${product}. Your credentials are managed by STINT.`
                  : 'Create your account and start building extraordinary digital products with the STINT team.'}
              </p>
            </motion.div>

            {/* Accent rule */}
            <div className="w-12 h-[2px] bg-gradient-to-r from-accent/60 to-transparent" />

            {/* Feature checklist */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="space-y-3"
            >
              {[
                'Real-time project collaboration',
                'Direct access to expert developers',
                'Secure workspace with role-based access',
                'Priority support & dedicated manager',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-muted-foreground/70">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* Trust card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="bg-[#131315]/60 border border-[#F2EDE4]/15 rounded-xl p-5 backdrop-blur-sm max-w-[340px]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[12px] font-medium text-foreground">Enterprise-grade security</div>
                  <div className="text-[10px] text-muted-foreground/60">SOC 2 compliant · End-to-end encrypted</div>
                </div>
              </div>
              <p className="text-[12px] text-muted-foreground/60 leading-relaxed">
                Your data is protected with industry-standard encryption. We never share your credentials with third parties.
              </p>
            </motion.div>
          </div>

          {/* Bottom: Copyright + powered-by */}
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-['DM_Mono'] text-muted-foreground/40 uppercase tracking-[0.15em]">
              © {new Date().getFullYear()} STINT
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-['DM_Mono'] text-muted-foreground/30 uppercase tracking-[0.1em]">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secured by STINT
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Sign Up Form ── */}
      <div className="flex-1 relative flex items-center justify-center px-6 sm:px-12 py-12 overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-[-15%] right-[-15%] w-[500px] h-[500px] rounded-full bg-[#C8973D]/[0.04] blur-[120px] pointer-events-none" />

        {/* Back to Home — mobile */}
        <Link
          href="/"
          className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-[10px] font-['DM_Mono'] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 z-10"
        >
          <ArrowLeft size={12} /> Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[380px] relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/">
              <img
                src="/stint-logo.png"
                alt="STINT Logo"
                className="h-12 w-auto mix-blend-screen filter brightness-[1.2] contrast-[1.1]"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            {product && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 border border-[#C8973D]/30 rounded-md text-[10px] font-['DM_Mono'] text-accent uppercase tracking-[0.15em] mb-3">
                {product}
              </div>
            )}
            <h2 className="text-2xl font-bold font-['Playfair_Display'] text-foreground tracking-tight">
              {product ? `Sign up for ${product}` : 'Create Account'}
            </h2>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              {product
                ? 'Create your STINT account to get started'
                : 'Set up your workspace in less than a minute'}
            </p>
          </div>

          {/* Google Button — compact */}
          <button
            type="button"
            disabled={isGoogleLoading || isLoading}
            onClick={handleGoogleSignUp}
            className="w-full h-11 bg-[#131315] hover:bg-[#1a1a1d] border border-[#F2EDE4]/20 hover:border-[#F2EDE4]/35 rounded-lg text-[13px] text-foreground flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 border-[1.5px] border-foreground/20 border-t-foreground rounded-full animate-spin" />
            ) : (
              <svg className="w-[14px] h-[14px] shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
            )}
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#F2EDE4]/15" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-[10px] text-muted-foreground/60 font-['DM_Mono'] uppercase tracking-[0.25em]">
                or
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleSignUpSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground/80 uppercase tracking-[0.08em] block">
                Email
              </label>
              <div className={`relative rounded-lg border transition-all duration-300 ${
                focusedField === 'email'
                  ? 'border-[#C8973D]/60 shadow-[0_0_0_3px_rgba(200,151,61,0.08)]'
                  : errors.email
                    ? 'border-red-500/40'
                    : 'border-[#F2EDE4]/15 hover:border-[#F2EDE4]/35'
              }`}>
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={14} className={`transition-colors duration-300 ${focusedField === 'email' ? 'text-accent' : 'text-muted-foreground/50'}`} />
                </span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none rounded-lg"
                  {...register('email', { onBlur: () => setFocusedField(null) })}
                  onFocus={() => setFocusedField('email')}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-400/80 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground/80 uppercase tracking-[0.08em] block">
                Password
              </label>
              <div className={`relative rounded-lg border transition-all duration-300 ${
                focusedField === 'password'
                  ? 'border-[#C8973D]/60 shadow-[0_0_0_3px_rgba(200,151,61,0.08)]'
                  : errors.password
                    ? 'border-red-500/40'
                    : 'border-[#F2EDE4]/15 hover:border-[#F2EDE4]/35'
              }`}>
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={14} className={`transition-colors duration-300 ${focusedField === 'password' ? 'text-accent' : 'text-muted-foreground/50'}`} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none rounded-lg"
                  {...register('password', { onBlur: () => setFocusedField(null) })}
                  onFocus={() => setFocusedField('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground/40 hover:text-foreground transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Password strength bar */}
              {watchPassword && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 h-[2px] bg-[#F2EDE4]/[0.03] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: strength.width }}
                      transition={{ duration: 0.3 }}
                      style={{ backgroundColor: strength.color }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 min-w-[36px]">{strength.label}</span>
                </div>
              )}
              {errors.password && (
                <p className="text-[10px] text-red-400/80 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground/80 uppercase tracking-[0.08em] block">
                Confirm Password
              </label>
              <div className={`relative rounded-lg border transition-all duration-300 ${
                focusedField === 'confirm'
                  ? 'border-[#C8973D]/60 shadow-[0_0_0_3px_rgba(200,151,61,0.08)]'
                  : errors.confirmPassword
                    ? 'border-red-500/40'
                    : 'border-[#F2EDE4]/15 hover:border-[#F2EDE4]/35'
              }`}>
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={14} className={`transition-colors duration-300 ${focusedField === 'confirm' ? 'text-accent' : 'text-muted-foreground/50'}`} />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none rounded-lg"
                  {...register('confirmPassword', { onBlur: () => setFocusedField(null) })}
                  onFocus={() => setFocusedField('confirm')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground/40 hover:text-foreground transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[10px] text-red-400/80 mt-1">{errors.confirmPassword.message}</p>
              )}
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
                      ? 'bg-accent border-accent'
                      : 'border-[#F2EDE4]/20 group-hover:border-[#F2EDE4]/35'
                  }`}>
                    {watchAgreeTerms && (
                      <svg className="w-2.5 h-2.5 text-[#0A0A0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground/60 leading-[1.5]">
                  I agree to the{' '}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-accent/80 hover:text-accent transition-colors">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-accent/80 hover:text-accent transition-colors">Privacy Policy</a>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-[10px] text-red-400/80 mt-1">{errors.agreeTerms.message}</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              whileTap={{ scale: 0.985 }}
              className="w-full h-11 bg-accent hover:bg-accent/90 disabled:opacity-50 text-[#0A0A0B] rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.2),0_0_20px_rgba(200,151,61,0.1)] mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-[1.5px] border-[#0A0A0B]/30 border-t-[#0A0A0B] rounded-full animate-spin" />
              ) : (
                <>
                  {product ? `Sign up for ${product}` : 'Create Account'} <UserPlus size={14} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-[13px] text-muted-foreground/60">
            Already have an account?{' '}
            <Link
              href={`/auth/signin${buildParamString()}`}
              className="text-accent/90 hover:text-accent font-medium transition-colors duration-300"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-[1.5px] border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    }>
      <SignUpPageContent />
    </Suspense>
  )
}
