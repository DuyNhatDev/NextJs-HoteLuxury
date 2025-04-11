import ListFilterHotel from "@/app/(public)/[hotel]/components/list-filter-hotel"

export default async function ListHotelPage({ params }: { params: Promise<{ hotel: string }> }) {
  const { hotel } = await params
  return (
    <div>
      <h1>{hotel}</h1>
      <ListFilterHotel/>
    </div>
  )
}
