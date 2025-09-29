import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react'

export default function ClassicLineSelector() {
  const nav = useNavigate()
  const [i, setI] = useState(0)
  const panels = Array.from({ length: 21 }, (_, k) => {
    const n = String(k + 1).padStart(2, '0')
    return { n, url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/kozijnen-photos/ClassicLine-panelen-${n}-k.jpg` }
  })
  const cur = panels[i], prev = panels[(i + panels.length - 1) % panels.length], next = panels[(i + 1) % panels.length]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ClassicLine Panelen</h1>
          <button onClick={() => nav('/configurator')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-5 w-5" /> Terug
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="relative w-full max-w-4xl mx-auto h-96">
            <img src={prev.url} alt="" className="absolute left-0 top-1/2 -translate-y-1/2 max-h-full max-w-[25%] opacity-50 scale-75 object-contain" />
            <img src={cur.url} alt={`ClassicLine paneel ${cur.n}`} className="mx-auto h-full object-contain rounded-lg shadow-xl" />
            <img src={next.url} alt="" className="absolute right-0 top-1/2 -translate-y-1/2 max-h-full max-w-[25%] opacity-50 scale-75 object-contain" />
            <button onClick={() => setI(x => (x + panels.length - 1) % panels.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow"><ChevronLeft className="h-6 w-6 text-gray-700" /></button>
            <button onClick={() => setI(x => (x + 1) % panels.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow"><ChevronRight className="h-6 w-6 text-gray-700" /></button>
          </div>

          <div className="text-center mt-4">
            <h3 className="text-xl font-semibold">Paneel {cur.n} – ClassicLine</h3>
            <button
              onClick={() => nav(`/configurator?classiclinePanel=${cur.n}`)}
              className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
            >
              <Check className="h-5 w-5" /> Kies dit paneel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}