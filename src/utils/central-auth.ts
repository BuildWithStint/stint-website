import type { CentralAuthResponse, CentralAuthRequestContext } from '@/services/api'

interface SearchParamsLike {
  get(name: string): string | null
}

export interface ProductAuthContext {
  product: string
  destination: string
  request: CentralAuthRequestContext
}

export function readProductAuthContext(searchParams: SearchParamsLike): ProductAuthContext {
  const explicitClientId = clean(searchParams.get('clientId'))
  const product = clean(searchParams.get('product'))
  const clientId = normalizeClientId(explicitClientId || product || 'stint')
  const destination = clean(searchParams.get('redirectUri')) || clean(searchParams.get('redirect')) || '/'
  const redirectUri = isHttpUrl(destination) ? new URL(destination).toString() : undefined

  return {
    product: normalizeProductLabel(product) || clientIdToLabel(clientId),
    destination,
    request: {
      clientId,
      ...(redirectUri ? { redirectUri } : {}),
    },
  }
}

export function buildProductAuthParamString(context: ProductAuthContext): string {
  const params = new URLSearchParams()
  if (context.product) params.set('product', context.product)
  if (context.request.clientId) params.set('clientId', context.request.clientId)
  if (context.request.redirectUri) params.set('redirectUri', context.request.redirectUri)
  const paramString = params.toString()
  return paramString ? `?${paramString}` : ''
}

export function completeProductAuth(response: CentralAuthResponse, destination: string, push: (path: string) => void) {
  if (typeof window === 'undefined') return

  const isExternalDestination = isHttpUrl(destination)
  if (!isExternalDestination) {
    window.localStorage.setItem('stintAuthToken', response.accessToken || response.token)
    window.localStorage.setItem('stintRefreshToken', response.refreshToken)
    window.localStorage.setItem('stintAuthUser', JSON.stringify(response.user))
    window.localStorage.setItem('stintAuthClient', JSON.stringify(response.client))
    push(destination)
    return
  }

  window.location.href = withAuthHash(destination, response)
}

function withAuthHash(destination: string, response: CentralAuthResponse): string {
  const url = new URL(destination)
  const hash = new URLSearchParams(url.hash.replace(/^#/, ''))
  hash.set('token', response.token)
  hash.set('accessToken', response.accessToken || response.token)
  hash.set('refreshToken', response.refreshToken)
  hash.set('tokenType', response.tokenType)
  hash.set('expiresInSeconds', String(response.expiresInSeconds))
  hash.set('refreshExpiresInSeconds', String(response.refreshExpiresInSeconds))
  hash.set('userId', response.user.id)
  hash.set('email', response.user.email)
  hash.set('provider', response.user.provider)
  if (response.user.orgId) hash.set('orgId', response.user.orgId)
  if (response.client.clientId) hash.set('clientId', response.client.clientId)
  if (response.client.redirectUri) hash.set('redirectUri', response.client.redirectUri)
  url.hash = hash.toString()
  return url.toString()
}

function clean(value: string | null): string {
  return value?.trim() || ''
}

function normalizeClientId(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63)

  if (/^[a-z][a-z0-9-]{1,62}$/.test(normalized)) return normalized
  if (/^[a-z]$/.test(normalized)) return `${normalized}-app`
  return 'stint'
}

// Known product display names — slug → proper display label
const PRODUCT_DISPLAY_NAMES: Record<string, string> = {
  medsworld: 'MedsWorld',
}

function normalizeProductLabel(product: string): string {
  if (!product) return ''
  return PRODUCT_DISPLAY_NAMES[product.toLowerCase()] ?? product
}

function clientIdToLabel(clientId: string): string {
  const lower = clientId.toLowerCase()
  if (PRODUCT_DISPLAY_NAMES[lower]) return PRODUCT_DISPLAY_NAMES[lower]
  return clientId
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
