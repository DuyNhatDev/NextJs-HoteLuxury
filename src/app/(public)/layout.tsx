import ChatBot from '@/app/(public)/components/chatbot'
import Footer from '@/app/(public)/components/layout/footer'
import Header from '@/app/(public)/components/layout/header'

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='relative flex min-h-screen w-full flex-col'>
      <Header />
      <main className='flex flex-1 flex-col gap-4 md:gap-8'>{children}
      </main>
      <Footer />
      <div className='fixed right-5 bottom-5 z-50'>
        <ChatBot />
      </div>
    </div>
  )
}
