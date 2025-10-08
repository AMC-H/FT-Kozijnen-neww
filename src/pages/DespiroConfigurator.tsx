import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowLeft, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

// PAS DIT AAN als je base url anders is!
const SUPABASE_IMG_URL = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/despiro-photos/'

interface DespiroPaneel {
  id: number
  naam: string
  image_path: string | null
  kleurmogelijkheden: string | null // bijvoorbeeld: "RAL, Hout"
  materiaal: string | null // bijvoorbeeld: "Kunststof, Aluminium"
  min_breedte_mm: number | null
  max_breedte_mm: number | null
  min_hoogte_mm: number | null
  max_hoogte_mm: number | null
  glasopties: string | null // bijvoorbeeld: "HR++, mat, triple"
  // Voeg meer velden toe als je tabel meer info bevat
}

const GLASOPTIES = [
  { value: "hr++", label: "HR++ glas" },
  { value: "mat", label: "Mat glas" },
  { value: "triple", label: "Triple glas" }
]

const MATERIALEN = [
  { value: "kunststof", label: "Kunststof" },
  { value: "aluminium", label: "Aluminium" },
  { value: "hout", label: "Hout" },
]

const RAL_KLEUREN = [
  "RAL 9016", "RAL 9005", "RAL 7016", "RAL 9001", "RAL 9010"
  // ... vul verder aan als je wilt
]
const HOUT_KLEUREN = [
  "Eiken", "Mahonie", "Walnut"
  // ... vul verder aan als je wilt
]

function DespiroConfigurator() {
  const navigate = useNavigate()
  const [panelen, setPanelen] = useState<DespiroPaneel[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    async function loadPanelen() {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('despiro_panelen')
        .select('*')
        .order('id', { ascending: true })
      if (error) setError(error.message)
      setPanelen((data || []) as DespiroPaneel[])
      setLoading(false)
    }
    loadPanelen()
  }, [])

  const currentPanel = panelen[currentIndex] || null

  const getPanelImageUrl = (panel: DespiroPaneel | null) => {
    if (!panel || !panel.image_path) return ''
    return SUPABASE_IMG_URL + panel.image_path
  }

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Gegevens klaar voor verzending:\n' + JSON.stringify({
      ...formData,
      paneelId: currentPanel?.id,
      paneelNaam: currentPanel?.naam,
    }, null, 2))
  }

  const goToPrevious = () => {
    if (panelen.length === 0) return
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : panelen.length - 1))
  }
  const goToNext = () => {
    if (panelen.length === 0) return
    setCurrentIndex(prev => (prev < panelen.length - 1 ? prev + 1 : 0))
  }

  return (
    <>
      {showConfig && currentPanel ? (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Despiro deur {currentPanel.naam} configureren
                </h1>
                <button
                  onClick={() => setShowConfig(false)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 inline" /> Terug naar deuren
                </button>
              </div>
              <div className="text-center mb-5">
                <img
                  src={getPanelImageUrl(currentPanel)}
                  alt={`Despiro deur ${currentPanel.naam}`}
                  className="mx-auto rounded-lg shadow-xl w-[400px] h-[600px] object-contain"
                  onError={e => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-family="sans-serif" font-size="18"%3EAfbeelding niet beschikbaar%3C/text%3E%3C/svg%3E';
                  }}
                  style={{ maxWidth: '100%', maxHeight: '80vh' }}
                />
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Materiaal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Materiaal *</label>
                  <select
                    value={formData.materiaal || ''}
                    onChange={e => handleFormChange('materiaal', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  >
                    <option value="">Kies materiaal</option>
                    {MATERIALEN.filter(m =>
                      !currentPanel.materiaal ||
                      currentPanel.materiaal.toLowerCase().includes(m.value)
                    ).map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                {/* Breedte en Hoogte */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Breedte (mm) *</label>
                    <input
                      type="number"
                      value={formData.breedte || ''}
                      onChange={e => handleFormChange('breedte', e.target.value)}
                      min={currentPanel.min_breedte_mm || 500}
                      max={currentPanel.max_breedte_mm || 1500}
                      placeholder={
                        currentPanel.min_breedte_mm && currentPanel.max_breedte_mm ?
                          `Tussen ${currentPanel.min_breedte_mm} en ${currentPanel.max_breedte_mm} mm`
                          : "Geef breedte op"
                      }
                      className="w-full border border-gray-300 rounded-lg p-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hoogte (mm) *</label>
                    <input
                      type="number"
                      value={formData.hoogte || ''}
                      onChange={e => handleFormChange('hoogte', e.target.value)}
                      min={currentPanel.min_hoogte_mm || 1500}
                      max={currentPanel.max_hoogte_mm || 2500}
                      placeholder={
                        currentPanel.min_hoogte_mm && currentPanel.max_hoogte_mm ?
                          `Tussen ${currentPanel.min_hoogte_mm} en ${currentPanel.max_hoogte_mm} mm`
                          : "Geef hoogte op"
                      }
                      className="w-full border border-gray-300 rounded-lg p-3"
                      required
                    />
                  </div>
                </div>
                {/* Kleur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kleur *</label>
                  <select
                    value={formData.kleur || ''}
                    onChange={e => handleFormChange('kleur', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  >
                    <option value="">Kies kleur</option>
                    {/* Toon alleen kleuren die passen bij de panelen */}
                    {(!currentPanel.kleurmogelijkheden || currentPanel.kleurmogelijkheden.toLowerCase().includes('ral')) &&
                      RAL_KLEUREN.map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))
                    }
                    {currentPanel.kleurmogelijkheden && currentPanel.kleurmogelijkheden.toLowerCase().includes('hout') &&
                      HOUT_KLEUREN.map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))
                    }
                  </select>
                </div>
                {/* Glasoptie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Glasoptie *</label>
                  <select
                    value={formData.glasoptie || ''}
                    onChange={e => handleFormChange('glasoptie', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  >
                    <option value="">Kies glasoptie</option>
                    {GLASOPTIES.filter(opt =>
                      !currentPanel.glasopties ||
                      currentPanel.glasopties.toLowerCase().includes(opt.value)
                    ).map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {/* Opmerkingen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opmerkingen</label>
                  <textarea
                    value={formData.opmerkingen || ''}
                    onChange={e => handleFormChange('opmerkingen', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    rows={3}
                    placeholder="Eventuele opmerkingen of speciale wensen…"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                >
                  <Check className="h-5 w-5" />
                  <span>Bevestig en ga verder</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Despiro deuren laden...</p>
          </div>
        </div>
      ) : error ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button
              onClick={() => navigate('/configurator')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Terug naar configurator
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="relative w-full mx-auto max-w-7xl">
                  <div className="flex items-center justify-center gap-4 px-4">
                    <button
                      onClick={goToPrevious}
                      className="flex-shrink-0 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-20"
                      aria-label="Vorige deur"
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-700" />
                    </button>
                    <div className="flex items-center justify-center gap-4 flex-1">
                      <div className="flex-shrink-0 w-full md:w-96 h-[500px] flex items-center justify-center mx-auto">
                        <img
                          src={getPanelImageUrl(currentPanel)}
                          alt={`Despiro deur ${currentPanel?.naam}`}
                          className="w-full h-full object-contain rounded-lg shadow-2xl bg-white p-4"
                          onError={e => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-family="sans-serif" font-size="18"%3EAfbeelding niet beschikbaar%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={goToNext}
                      className="flex-shrink-0 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-20"
                      aria-label="Volgende deur"
                    >
                      <ChevronRight className="h-6 w-6 text-gray-700" />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Despiro deur {currentPanel?.naam}
                  </h3>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => setShowConfig(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                >
                  <Check className="h-5 w-5" />
                  <span>Configureer deze deur</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DespiroConfigurator