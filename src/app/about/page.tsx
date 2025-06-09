import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description: 'Về HoteLuxury'
}

export default function AboutPage() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12 md:px-20'>
      <section className='mb-16 text-center'>
        <h1 className='mb-6 text-4xl font-bold text-blue-800 md:text-5xl'>Về Chúng Tôi</h1>
        <p className='mx-auto max-w-3xl text-lg text-gray-700'>
          HoteLuxury là nền tảng đặt phòng khách sạn hàng đầu giúp bạn tìm kiếm, so sánh và đặt phòng nhanh chóng, tiện
          lợi và đáng tin cậy cho mọi chuyến đi của bạn với mức giá tốt nhất.
        </p>
      </section>

      <section className='mb-20 grid grid-cols-1 gap-10 md:grid-cols-2'>
        <div className='rounded-3xl border-t-4 border-blue-500 bg-white p-8 shadow-xl transition duration-300 hover:shadow-2xl'>
          <h2 className='mb-4 text-2xl font-semibold text-gray-800'>Sứ mệnh của chúng tôi</h2>
          <p className='leading-relaxed text-gray-600'>
            Chúng tôi cam kết mang lại trải nghiệm đặt phòng tiện lợi, minh bạch và đáng tin cậy cho mọi khách hàng.
            Giúp bạn an tâm chọn lựa những khách sạn chất lượng, phù hợp với mọi ngân sách và nhu cầu cá nhân.
          </p>
        </div>
        <div className='rounded-3xl border-t-4 border-purple-500 bg-white p-8 shadow-xl transition duration-300 hover:shadow-2xl'>
          <h2 className='mb-4 text-2xl font-semibold text-gray-800'>Tầm nhìn dài hạn</h2>
          <p className='leading-relaxed text-gray-600'>
            Trở thành nền tảng đặt phòng khách sạn hàng đầu tại Việt Nam và khu vực Đông Nam Á, nơi du khách có thể đặt
            phòng nhanh chóng, an toàn, và dễ dàng cho mọi hành trình du lịch hoặc công tác.
          </p>
        </div>
      </section>

      {/* <section className='mb-20'>
        <h2 className='mb-10 text-center text-3xl font-semibold text-gray-800'>Giá trị cốt lõi</h2>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4'>
          {[
            { title: 'Chất lượng', color: 'from-blue-400 to-blue-600' },
            { title: 'Tin cậy', color: 'from-green-400 to-green-600' },
            { title: 'Hỗ trợ 24/7', color: 'from-purple-400 to-purple-600' },
            { title: 'Bảo mật', color: 'from-pink-400 to-pink-600' }
          ].map(({ title, color }) => (
            <div
              key={title}
              className={`bg-gradient-to-r ${color} transform rounded-xl p-6 text-center text-white shadow-lg transition duration-300 hover:scale-105`}
            >
              <p className='text-lg font-semibold'>{title}</p>
            </div>
          ))}
        </div>
      </section> */}

      <section className='mx-auto mb-20 max-w-5xl rounded-3xl bg-white p-10 shadow-xl transition duration-300 hover:shadow-2xl'>
        <h2 className='mb-6 text-3xl font-semibold text-gray-800'>Câu chuyện của chúng tôi</h2>
        <p className='leading-relaxed text-gray-600'>
          Trang web được thành lập vào năm 2024 với mong muốn xây dựng nền tảng kết nối khách du lịch với những khách
          sạn chất lượng nhất trên khắp Việt Nam. Chúng tôi hiểu rằng việc tìm kiếm một chỗ ở phù hợp có thể mất rất
          nhiều thời gian và công sức. Vì vậy chúng tôi tạo ra giải pháp giúp mọi người tiết kiệm thời gian, chi phí và
          nhận được giá trị xứng đáng cho mỗi kỳ nghỉ.
        </p>
        <p className='mt-4 leading-relaxed text-gray-600'>
          Không chỉ dừng lại ở Việt Nam, chúng tôi đang từng bước mở rộng dịch vụ ra thị trường quốc tế, nhằm phục vụ
          tốt hơn cho cộng đồng du khách toàn cầu.
        </p>
      </section>

      <section className='text-center'>
        <h2 className='mb-4 text-3xl font-semibold text-gray-800'>Kết nối với chúng tôi</h2>
        <p className='mb-6 text-gray-600'>
          Bạn có câu hỏi hoặc muốn hợp tác cùng chúng tôi? Đừng ngần ngại — chúng tôi luôn sẵn sàng lắng nghe!
        </p>
        <Link
          href='#'
          className='inline-block transform rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 text-white shadow-lg transition duration-300 hover:scale-105 hover:shadow-2xl'
        >
          Liên hệ ngay
        </Link>
      </section>
    </main>
  )
}
