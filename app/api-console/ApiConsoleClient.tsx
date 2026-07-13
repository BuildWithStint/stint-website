'use client'

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyRound,
  Building2,
  ShieldCheck,
  Clock,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  Terminal,
  AlertTriangle,
} from 'lucide-react';
import {
  consoleAPI,
  ConsoleOrgMembership,
  ConsoleTokenResponse,
} from '../../src/services/api';

const EXPIRY_PRESETS = [
  { label: '15 min', seconds: 900 },
  { label: '1 hour', seconds: 3600 },
  { label: '6 hours', seconds: 21600 },
  { label: '24 hours', seconds: 86400 },
];

const MAX_EXPIRY_SECONDS = 86400;
// Lifetime for the throwaway tokens used to list orgs / permissions.
const HELPER_TOKEN_SECONDS = 60;

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function ApiConsoleClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [expiresInSeconds, setExpiresInSeconds] = useState(3600);
  const [customExpiry, setCustomExpiry] = useState(false);

  const [orgs, setOrgs] = useState<ConsoleOrgMembership[] | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [availablePermissions, setAvailablePermissions] = useState<string[] | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  const [result, setResult] = useState<ConsoleTokenResponse | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<'orgs' | 'permissions' | 'generate' | null>(null);
  const [copied, setCopied] = useState<'token' | 'curl' | null>(null);
  const [showClaims, setShowClaims] = useState(false);

  const selectedOrg = orgs?.find((o) => o.orgId === selectedOrgId) ?? null;
  const claims = useMemo(() => (result ? decodeJwtPayload(result.token) : null), [result]);

  const credentialsReady = email.trim().length > 0 && password.length > 0;

  const handleLoadOrgs = async () => {
    setError('');
    setBusy('orgs');
    try {
      // Mint a throwaway org-less token, then list the caller's real memberships.
      const helper = await consoleAPI.generateToken({
        email: email.trim(),
        password,
        expiresInSeconds: HELPER_TOKEN_SECONDS,
      });
      const { orgs: loaded } = await consoleAPI.getOrgs(helper.token);
      setOrgs(loaded);
      if (loaded.length === 0) setError('Your account has no active organization memberships.');
    } catch (err) {
      setError(consoleAPI.errorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const handleOrgChange = (orgId: string) => {
    setSelectedOrgId(orgId);
    // Permissions are per-org — a stale list from another org must not linger.
    setAvailablePermissions(null);
    setSelectedPermissions(new Set());
  };

  const handleLoadPermissions = async () => {
    if (!selectedOrgId) return;
    setError('');
    setBusy('permissions');
    try {
      const helper = await consoleAPI.generateToken({
        email: email.trim(),
        password,
        orgId: selectedOrgId,
        expiresInSeconds: HELPER_TOKEN_SECONDS,
      });
      setAvailablePermissions(helper.permissions);
      setSelectedPermissions(new Set(helper.permissions));
    } catch (err) {
      setError(consoleAPI.errorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const togglePermission = (key: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy('generate');
    setResult(null);
    try {
      const scoping =
        selectedOrgId &&
        availablePermissions &&
        selectedPermissions.size > 0 &&
        selectedPermissions.size < availablePermissions.length;

      const response = await consoleAPI.generateToken({
        email: email.trim(),
        password,
        ...(selectedOrgId ? { orgId: selectedOrgId } : {}),
        ...(scoping ? { permissions: [...selectedPermissions] } : {}),
        expiresInSeconds,
      });
      setResult(response);
      setShowClaims(false);
    } catch (err) {
      setError(consoleAPI.errorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const copyText = async (text: string, which: 'token' | 'curl') => {
    await navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  };

  const curlExample = result
    ? `curl -H "Authorization: Bearer ${result.token}" \\\n  http://localhost:4031/auth/me`
    : '';

  const expiresAt = result
    ? new Date(Date.now() + result.expiresInSeconds * 1000).toLocaleString()
    : '';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Terminal size={20} className="text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">API Console</h1>
              <p className="text-sm text-muted-foreground">
                Generate short-lived access tokens for local API development
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs rounded-full border border-amber-500/20">
            Dev only — disabled in production
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-2 gap-8 items-start">
        {/* ————— Request builder ————— */}
        <form onSubmit={handleGenerate} className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-lg font-medium flex items-center gap-2">
              <KeyRound size={18} className="text-accent" />
              Credentials
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Tokens are minted for your real account — identity, role, and permissions
              come from your actual memberships and can never be escalated.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="dev@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Your account password"
              />
            </div>
          </div>

          {/* Expiry */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Clock size={14} className="text-accent" />
              Expiry
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPIRY_PRESETS.map((preset) => (
                <button
                  key={preset.seconds}
                  type="button"
                  onClick={() => {
                    setExpiresInSeconds(preset.seconds);
                    setCustomExpiry(false);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    !customExpiry && expiresInSeconds === preset.seconds
                      ? 'bg-accent text-background border-accent'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCustomExpiry(true)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  customExpiry
                    ? 'bg-accent text-background border-accent'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                Custom
              </button>
            </div>
            {customExpiry && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={60}
                  max={MAX_EXPIRY_SECONDS}
                  value={expiresInSeconds}
                  onChange={(e) =>
                    setExpiresInSeconds(
                      Math.min(MAX_EXPIRY_SECONDS, Math.max(1, Number(e.target.value) || 0)),
                    )
                  }
                  className="w-36 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <span className="text-sm text-muted-foreground">seconds (max 86400 = 24h)</span>
              </div>
            )}
          </div>

          {/* Organization */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Building2 size={14} className="text-accent" />
              Organization <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            {orgs === null ? (
              <button
                type="button"
                disabled={!credentialsReady || busy !== null}
                onClick={handleLoadOrgs}
                className="px-4 py-2 text-sm border border-border rounded-lg text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {busy === 'orgs' && <RefreshCw size={14} className="animate-spin" />}
                Load my organizations
              </button>
            ) : (
              <select
                value={selectedOrgId}
                onChange={(e) => handleOrgChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">No organization (org-less token)</option>
                {orgs.map((org) => (
                  <option key={org.orgId} value={org.orgId}>
                    {org.name} — {org.role}
                  </option>
                ))}
              </select>
            )}
            {selectedOrg && (
              <p className="text-xs text-muted-foreground mt-2">
                Token will carry your real role in this org:{' '}
                <span className="text-accent capitalize">{selectedOrg.role}</span>
              </p>
            )}
          </div>

          {/* Permission scoping */}
          {selectedOrgId && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <ShieldCheck size={14} className="text-accent" />
                Permissions
              </label>
              {availablePermissions === null ? (
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={handleLoadPermissions}
                  className="px-4 py-2 text-sm border border-border rounded-lg text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {busy === 'permissions' && <RefreshCw size={14} className="animate-spin" />}
                  Load my permissions to scope the token
                </button>
              ) : availablePermissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No readable permissions in this org yet — the token will carry your role only.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedPermissions(new Set(availablePermissions))}
                      className="text-accent hover:underline"
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPermissions(new Set())}
                      className="text-muted-foreground hover:underline"
                    >
                      Clear
                    </button>
                    <span className="text-muted-foreground ml-auto">
                      {selectedPermissions.size}/{availablePermissions.length} selected
                    </span>
                  </div>
                  <div className="max-h-48 overflow-y-auto border border-border rounded-lg divide-y divide-border">
                    {availablePermissions.map((key) => (
                      <label
                        key={key}
                        className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.has(key)}
                          onChange={() => togglePermission(key)}
                          className="accent-[var(--accent)]"
                        />
                        <span className="font-mono text-xs">{key}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deselect keys to mint a down-scoped token. You can only grant what you already hold.
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!credentialsReady || busy !== null}
            className="w-full px-4 py-2.5 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {busy === 'generate' ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <KeyRound size={16} />
            )}
            Generate token
          </button>
        </form>

        {/* ————— Result ————— */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-card border border-border rounded-lg p-6 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium flex items-center gap-2">
                    <Check size={18} className="text-green-500" />
                    Token generated
                  </h2>
                  <span className="text-xs text-muted-foreground">expires {expiresAt}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Access token</span>
                    <button
                      onClick={() => copyText(result.token, 'token')}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied === 'token' ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                      {copied === 'token' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-background border border-border rounded-lg p-3 font-mono text-xs break-all max-h-28 overflow-y-auto">
                    {result.token}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-background border border-border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Identity</p>
                    <p className="truncate">{result.user.email}</p>
                  </div>
                  <div className="bg-background border border-border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Org / role</p>
                    <p className="truncate capitalize">
                      {result.org ? `${result.org.name} — ${result.org.role}` : 'org-less'}
                    </p>
                  </div>
                </div>

                {result.org && (
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Granted permissions ({result.permissions.length})
                    </p>
                    {result.permissions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">None — role claim only.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                        {result.permissions.map((key) => (
                          <span
                            key={key}
                            className="px-2 py-0.5 bg-accent/10 text-accent rounded font-mono text-xs"
                          >
                            {key}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Try it</span>
                    <button
                      onClick={() => copyText(curlExample, 'curl')}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied === 'curl' ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                      {copied === 'curl' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-background border border-border rounded-lg p-3 font-mono text-xs overflow-x-auto">
                    {curlExample}
                  </pre>
                </div>

                {claims && (
                  <div>
                    <button
                      onClick={() => setShowClaims(!showClaims)}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${showClaims ? 'rotate-180' : ''}`}
                      />
                      Decoded claims
                    </button>
                    {showClaims && (
                      <pre className="mt-2 bg-background border border-border rounded-lg p-3 font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto">
                        {JSON.stringify(claims, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card border border-dashed border-border rounded-lg p-10 text-center"
              >
                <KeyRound size={28} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Your generated token, its scope, and a ready-to-run curl command will appear here.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-card border border-border rounded-lg p-4 text-xs text-muted-foreground space-y-1.5">
            <p className="font-medium text-foreground text-sm">How this works</p>
            <p>
              • Tokens are exchanged for <span className="text-foreground">real credentials</span> against
              the central auth service — the console never fabricates identities.
            </p>
            <p>• Role and permissions mirror your actual org membership; down-scoping only, never escalation.</p>
            <p>• Lifetime is capped at 24 hours and the endpoint is disabled entirely in production.</p>
            <p>• Credential attempts share the sign-in rate limit — repeated failures will throttle.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
