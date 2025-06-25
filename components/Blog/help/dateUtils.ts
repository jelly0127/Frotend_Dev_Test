// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

// Format date to ISO string
export function formatDateISO(dateString: string): string {
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return new Date().toISOString()
  }

  return date.toISOString()
}

// Get relative time (e.g., "2 days ago")
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
}

// Check if date is valid
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

// Format date for RSS feeds
export function formatRSSDate(dateString: string): string {
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return new Date().toUTCString()
  }

  return date.toUTCString()
} 