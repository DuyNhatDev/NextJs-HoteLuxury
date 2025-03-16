import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import AppProvider from '@/components/app-provider'
import NextTopLoader from 'nextjs-toploader'
import { GoogleOAuthProvider } from '@react-oauth/google'
import envConfig from '@/config'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})
export const metadata: Metadata = {
  title: 'Đặt phòng khách sạn trực tuyến',
  description: 'The booking hotel app',
}
const clientId = envConfig.NEXT_PUBLIC_GG_CLIENT_ID
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <NextTopLoader showSpinner={false} color="oklch(0.869 0.022 252.894)" />
        <GoogleOAuthProvider clientId={clientId}>
          <AppProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster
                richColors
                expand
                closeButton
                duration={3000}
                swipeDirections={['left', 'right']}
                visibleToasts={3}
              />
            </ThemeProvider>
          </AppProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
