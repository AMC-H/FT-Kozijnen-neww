import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

const SUPABASE_IMG_URL = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/kozijnen-photos/'

// Paneel-nummers die uitgesloten moeten worden per variant:
const UITGESLOTEN_MET = [9,11,30,55,62,72,73,74,75,109,110,111,112,134,140,141,142,143,144]
const UITGESLOTEN_ZONDER = [59,60,61,63,64,65,66,67,68,69,70,71,93,96,120,137]

interface PanelConfig {
  paneelnummer: number
  afbeelding_met: string | null
  afbeelding_zonder: string | null
  beschikbaar_pvc: boolean
  beschikbaar_alu: boolean
  beschikbaar_hout: boolean
  pvc_breedte_min_mm: number | null
  pvc_breedte_max_mm: number | null
  pvc_hoogte_min_mm: number | null
  pvc_hoogte_max_mm: number | null
  alu_breedte_min_mm: number | null
  alu_breedte_max_mm: number | null
  alu_hoogte_min_mm: number | null
  alu_hoogte_max_mm: number | null
  hout_breedte_min_mm: number | null
  hout_breedte_max_mm: number | null
  hout_hoogte_min_mm: number | null
  hout_hoogte_max_mm: number | null
}

const GLASOPTIES = [
  { value: "hr++", label: "HR++ glas" },
  { value: "mat", label: "Mat glas" },
  { value: "triple", label: "Triple glas" }
];

const SLUITWERKOPTIES = [
  { value: "standaard", label: "Standaard hang- en sluitwerk" },
  { value: "veiligheid", label: "Veiligheidsslot" },
  { value: "meerpunt", label: "Meerpuntssluiting" },
  { value: "antiinbraak", label: "Anti-inbraak beslag" },
  { value: "comfort", label: "Comfort hang- en sluitwerk" }
];

const DORPELOPTIES = [
  { value: "ja", label: "Ja" },
  { value: "nee", label: "Nee" }
];

const EkolineConfigurator: React.FC = () => {
  const navigate = useNavigate()
  const [variant, setVariant] = useState<'met' | 'zonder'>('met')
  const [panelen, setPanelen] = useState<PanelConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showConfig, setShowConfig] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [opleggingKleur, setOpleggingKleur] = useState<'inox' | 'zwart' | ''>('')

  useEffect(() => {
    loadPanelen()
  }, [])

  const loadPanelen = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('panelen_config')
        .select('*')
        .order('paneelnummer', { ascending: true })
      if (error) throw error
      setPanelen(data || [])
      setCurrentIndex(0)
    } catch (e: any) {
      setError(e?.message || 'Fout bij laden deuren')
    } finally {
      setLoading(false)
    }
  }

  const filteredPanelen = panelen.filter(p => {
    if (variant === 'met') {
      return !!p.afbeelding_met && p.afbeelding_met !== 'null' && !UITGESLOTEN_MET.includes(p.paneelnummer)
    }
    if (variant === 'zonder') {
      return !!p.afbeelding_zonder && p.afbeelding_zonder !== 'null' && !UITGESLOTEN_ZONDER.includes(p.paneelnummer)
    }
    return false
  })

  useEffect(() => {
    if (filteredPanelen.length > 0 && currentIndex >= filteredPanelen.length) {
      setCurrentIndex(0)
    }
  }, [filteredPanelen.length, currentIndex])

  const currentPanel = filteredPanelen[currentIndex] || null

  const getPanelImageUrl = (p: PanelConfig | null) => {
    if (!p) return ''
    const filename = variant === 'met' ? p.afbeelding_met : p.afbeelding_zonder
    if (!filename) return ''
    return SUPABASE_IMG_URL + filename + `?v=${p.paneelnummer}`
  }

  const handleVariantChange = (newVariant: 'met' | 'zonder') => {
    if (variant === newVariant) return
    setVariant(newVariant)
    setCurrentIndex(0)
    setOpleggingKleur('')
  }

  const goToPrevious = () => {
    if (filteredPanelen.length === 0) return
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : filteredPanelen.length - 1
    )
  }
  const goToNext = () => {
    if (filteredPanelen.length === 0) return
    setCurrentIndex((prev) =>
      prev < filteredPanelen.length - 1 ? prev + 1 : 0
    )
  }

  const handleSelectPanel = () => {
    setShowConfig(true)
  }

  const materiaalInfo = currentPanel
    ? [
        currentPanel.beschikbaar_pvc && {
          label: 'Kunststof',
          breedte: [currentPanel.pvc_breedte_min_mm, currentPanel.pvc_breedte_max_mm],
          hoogte: [currentPanel.pvc_hoogte_min_mm, currentPanel.pvc_hoogte_max_mm],
        },
        currentPanel.beschikbaar_alu && {
          label: 'Aluminium',
          breedte: [currentPanel.alu_breedte_min_mm, currentPanel.alu_breedte_max_mm],
          hoogte: [currentPanel.alu_hoogte_min_mm, currentPanel.alu_hoogte_max_mm],
        },
        currentPanel.beschikbaar_hout && {
          label: 'Hout',
          breedte: [currentPanel.hout_breedte_min_mm, currentPanel.hout_breedte_max_mm],
          hoogte: [currentPanel.hout_hoogte_min_mm, currentPanel.hout_hoogte_max_mm],
        },
      ].filter(Boolean)
    : []

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
      variant,
      opleggingKleur: variant === 'met' ? opleggingKleur : undefined,
      paneelnummer: currentPanel?.paneelnummer,
    }, null, 2))
  }

  // ----------------- Dynamisch formulier -----------------
  if (showConfig && currentPanel) {
    // Materiaal-opties per paneel
    const materiaalOpties = [
      currentPanel.beschikbaar_pvc && { value: 'kunststof', label: 'Kunststof' },
      currentPanel.beschikbaar_alu && { value: 'aluminium', label: 'Aluminium' },
      currentPanel.beschikbaar_hout && { value: 'hout', label: 'Hout' },
    ].filter(Boolean);

    // Dynamische min/max per gekozen materiaal
    const breedteMin =
      formData.materiaal === 'kunststof' ? currentPanel.pvc_breedte_min_mm :
      formData.materiaal === 'aluminium' ? currentPanel.alu_breedte_min_mm :
      formData.materiaal === 'hout' ? currentPanel.hout_breedte_min_mm : 400;
    const breedteMax =
      formData.materiaal === 'kunststof' ? currentPanel.pvc_breedte_max_mm :
      formData.materiaal === 'aluminium' ? currentPanel.alu_breedte_max_mm :
      formData.materiaal === 'hout' ? currentPanel.hout_breedte_max_mm : 3000;
    const hoogteMin =
      formData.materiaal === 'kunststof' ? currentPanel.pvc_hoogte_min_mm :
      formData.materiaal === 'aluminium' ? currentPanel.alu_hoogte_min_mm :
      formData.materiaal === 'hout' ? currentPanel.hout_hoogte_min_mm : 400;
    const hoogteMax =
      formData.materiaal === 'kunststof' ? currentPanel.pvc_hoogte_max_mm :
      formData.materiaal === 'aluminium' ? currentPanel.alu_hoogte_max_mm :
      formData.materiaal === 'hout' ? currentPanel.hout_hoogte_max_mm : 3000;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Ekoline deur {currentPanel.paneelnummer} configureren
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
                key={`${currentPanel.paneelnummer}-${variant}`}
                src={getPanelImageUrl(currentPanel)}
                alt={`Ekoline deur ${currentPanel.paneelnummer} ${variant}`}
                className="max-w-full max-h-64 mx-auto object-contain rounded-lg shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-family="sans-serif" font-size="18"%3EAfbeelding niet beschikbaar%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Materiaal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Materiaal *</label>
                <select
                  value={formData.materiaal || ''}
                  onChange={(e) => handleFormChange('materiaal', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                >
                  <option value="">Kies materiaal</option>
                  {materiaalOpties.map((m: any) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              {/* Maten */}
              {formData.materiaal && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Breedte (mm) *</label>
                    <input
                      type="number"
                      value={formData.breedte || ''}
                      onChange={e => handleFormChange('breedte', e.target.value)}
                      min={breedteMin}
                      max={breedteMax}
                      placeholder={`Tussen ${breedteMin} en ${breedteMax} mm`}
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
                      min={hoogteMin}
                      max={hoogteMax}
                      placeholder={`Tussen ${hoogteMin} en ${hoogteMax} mm`}
                      className="w-full border border-gray-300 rounded-lg p-3"
                      required
                    />
                  </div>
                </div>
              )}
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
                  {GLASOPTIES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {/* Dorpel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dorpel *</label>
                <select
                  value={formData.dorpel || ''}
                  onChange={e => handleFormChange('dorpel', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                >
                  <option value="">Kies dorpel</option>
                  {DORPELOPTIES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {/* Sluitwerk */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hang- en sluitwerk *</label>
                <select
                  value={formData.sluitwerk || ''}
                  onChange={e => handleFormChange('sluitwerk', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                >
                  <option value="">Kies hang- en sluitwerk</option>
                  {SLUITWERKOPTIES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {/* Kleur oplegging voor variant met */}
              {variant === 'met' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kleur oplegging *</label>
                  <select
                    value={opleggingKleur}
                    onChange={e => setOpleggingKleur(e.target.value as 'inox' | 'zwart')}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    required
                  >
                    <option value="">Kies kleur oplegging</option>
                    <option value="inox">INOX (zilver)</option>
                    <option value="zwart">Zwart</option>
                  </select>
                </div>
              )}
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
              {/* Foto-upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto's uploaden</label>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg"
                  className="w-full border border-gray-300 rounded-lg p-3"
                  onChange={e =>
                    handleFormChange('fotos', e.target.files ? Array.from(e.target.files) : [])
                  }
                />
                <p className="text-xs text-gray-500 mt-1">PNG, JPG tot 8MB per foto, max 5 foto's</p>
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
    </div>
    )
  }

  // --- CARROUSEL ---
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ekoline Deuren</h1>
            <p className="text-gray-600">Kies uw gewenste deur design</p>
          </div>
          <button
            onClick={() => navigate('/configurator')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Terug naar configurator</span>
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => handleVariantChange('met')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                  variant === 'met'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Met INOX oplegging
              </button>
              <button
                onClick={() => handleVariantChange('zonder')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                  variant === 'zonder'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Zonder INOX oplegging
              </button>
            </div>
          </div>
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
                  {/* Previous image preview */}
                  <div className="hidden md:flex flex-shrink-0 w-48 h-80 items-center justify-center opacity-40 transition-opacity hover:opacity-60">
                    {filteredPanelen[currentIndex > 0 ? currentIndex - 1 : filteredPanelen.length - 1] && (
                      <img
                        src={getPanelImageUrl(filteredPanelen[currentIndex > 0 ? currentIndex - 1 : filteredPanelen.length - 1])}
                        alt="Vorige"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    )}
                  </div>

                  {/* Current image - full size and centered */}
                  <div className="flex-shrink-0 w-full md:w-96 h-[500px] flex items-center justify-center mx-auto">
                    <img
                      key={`${currentPanel?.paneelnummer}-${variant}`}
                      src={getPanelImageUrl(currentPanel)}
                      alt={`Ekoline deur ${currentPanel?.paneelnummer} ${variant}`}
                      className="w-full h-full object-contain rounded-lg shadow-2xl bg-white p-4"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-family="sans-serif" font-size="18"%3EAfbeelding niet beschikbaar%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>

                  {/* Next image preview */}
                  <div className="hidden md:flex flex-shrink-0 w-48 h-80 items-center justify-center opacity-40 transition-opacity hover:opacity-60">
                    {filteredPanelen[currentIndex < filteredPanelen.length - 1 ? currentIndex + 1 : 0] && (
                      <img
                        src={getPanelImageUrl(filteredPanelen[currentIndex < filteredPanelen.length - 1 ? currentIndex + 1 : 0])}
                        alt="Volgende"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    )}
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
                Ekoline deur {currentPanel?.paneelnummer} - {variant === 'met' ? 'Met INOX oplegging' : 'Zonder INOX oplegging'}
              </h3>
              <div className="text-gray-500 text-sm mb-2 space-y-1 mt-2">
                {materiaalInfo.length === 0 ? (
                  <div>Geen materialen beschikbaar voor deze deur</div>
                ) : (
                  materiaalInfo.map((m: any) => (
                    <div key={m.label}>
                      <span className="font-medium">{m.label}:</span>{' '}
                      {m.breedte[0]}–{m.breedte[1]} mm breed, {m.hoogte[0]}–{m.hoogte[1]} mm hoog
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={handleSelectPanel}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Check className="h-5 w-5" />
              <span>Kies deze deur</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EkolineConfigurator