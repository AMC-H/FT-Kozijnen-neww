import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

const SUPABASE_IMG_URL =
  import.meta.env.VITE_SUPABASE_URL +
  '/storage/v1/object/public/kozijnen-photos/'

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

const EkolineConfigurator: React.FC = () => {
  const navigate = useNavigate()
  const [variant, setVariant] = useState<'met' | 'zonder'>('met')
  const [panelen, setPanelen] = useState<PanelConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  // Formulier state
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
      setError(e?.message || 'Fout bij laden panelen')
    } finally {
      setLoading(false)
    }
  }

  // Filter panelen op basis van variant: alleen met afbeelding van dat type
  const filteredPanelen = panelen.filter((p) =>
    variant === 'met' ? !!p.afbeelding_met : !!p.afbeelding_zonder
  )

  useEffect(() => {
    // Reset index als te hoog na filteren
    if (currentIndex > filteredPanelen.length - 1) setCurrentIndex(0)
  }, [variant, filteredPanelen.length])

  const currentPanel = filteredPanelen[currentIndex] || null

  const getPanelImageUrl = (p: PanelConfig | null) =>
    p
      ? SUPABASE_IMG_URL +
        (variant === 'met' ? p.afbeelding_met : p.afbeelding_zonder)
      : ''

  const handleVariantChange = (newVariant: 'met' | 'zonder') => {
    if (variant === newVariant) return
    setVariant(newVariant)
    setCurrentIndex(0)
    setOpleggingKleur('') // reset kleurkeuze bij variantwissel
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : filteredPanelen.length - 1
    )
  }
  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev < filteredPanelen.length - 1 ? prev + 1 : 0
    )
  }

  const handleSelectPanel = () => {
    setShowConfig(true)
  }

  // Materiaal en afmetingen tonen
  const materiaalInfo = currentPanel
    ? [
        currentPanel.beschikbaar_pvc && {
          label: 'PVC',
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

  // Handler voor formulier velden
  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  // (Demo) submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Gegevens klaar voor verzending:\n' + JSON.stringify({
      ...formData,
      variant,
      opleggingKleur: variant === 'met' ? opleggingKleur : undefined,
      paneelnummer: currentPanel?.paneelnummer,
    }, null, 2))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ekoline panelen laden...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/configurator')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Terug naar configurator
          </button>
        </div>
      </div>
    )
  }

  if (filteredPanelen.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Geen panelen beschikbaar voor variant "{variant}"
          </p>
          <button
            onClick={() => navigate('/configurator')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Terug naar configurator
          </button>
        </div>
      </div>
    )
  }

  // --- CONFIGURATIE FORMULIER ---
  if (showConfig && currentPanel) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Ekoline {currentPanel.paneelnummer} configureren
              </h1>
              <button
                onClick={() => setShowConfig(false)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 inline" /> Terug naar panelen
              </button>
            </div>
            <div className="text-center mb-5">
              <img
                src={getPanelImageUrl(currentPanel)}
                alt={`Ekoline paneel ${currentPanel.paneelnummer} ${variant}`}
                className="max-w-full max-h-64 mx-auto object-contain rounded-lg shadow-xl"
              />
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Materiaal keuze */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Materiaal *</label>
                <select
                  value={formData.materiaal || ''}
                  onChange={(e) => handleFormChange('materiaal', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Kies materiaal</option>
                  {currentPanel.beschikbaar_pvc && <option value="PVC">PVC</option>}
                  {currentPanel.beschikbaar_alu && <option value="Aluminium">Aluminium</option>}
                  {currentPanel.beschikbaar_hout && <option value="Hout">Hout</option>}
                </select>
              </div>
              {/* Afmetingen - dynamisch per materiaal */}
              {formData.materiaal && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Breedte (mm) *</label>
                    <input
                      type="number"
                      value={formData.breedte || ''}
                      onChange={e => handleFormChange('breedte', e.target.value)}
                      min={
                        formData.materiaal === 'PVC' ? currentPanel.pvc_breedte_min_mm :
                        formData.materiaal === 'Aluminium' ? currentPanel.alu_breedte_min_mm :
                        formData.materiaal === 'Hout' ? currentPanel.hout_breedte_min_mm : undefined
                      }
                      max={
                        formData.materiaal === 'PVC' ? currentPanel.pvc_breedte_max_mm :
                        formData.materiaal === 'Aluminium' ? currentPanel.alu_breedte_max_mm :
                        formData.materiaal === 'Hout' ? currentPanel.hout_breedte_max_mm : undefined
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
                      min={
                        formData.materiaal === 'PVC' ? currentPanel.pvc_hoogte_min_mm :
                        formData.materiaal === 'Aluminium' ? currentPanel.alu_hoogte_min_mm :
                        formData.materiaal === 'Hout' ? currentPanel.hout_hoogte_min_mm : undefined
                      }
                      max={
                        formData.materiaal === 'PVC' ? currentPanel.pvc_hoogte_max_mm :
                        formData.materiaal === 'Aluminium' ? currentPanel.alu_hoogte_max_mm :
                        formData.materiaal === 'Hout' ? currentPanel.hout_hoogte_max_mm : undefined
                      }
                      className="w-full border border-gray-300 rounded-lg p-3"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Alleen als gekozen variant 'met' is: extra optie voor kleur oplegging */}
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

              {/* Overige velden alleen als gewenst */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opmerkingen</label>
                <textarea
                  value={formData.opmerkingen || ''}
                  onChange={e => handleFormChange('opmerkingen', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  rows={3}
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
    )
  }

  // --- CARROUSEL ---
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ekoline Panelen</h1>
            <p className="text-gray-600">Kies uw gewenste paneel design</p>
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
          {/* Variant Toggle */}
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

          {/* Panel Display */}
          <div className="text-center mb-8">
            <div className="relative w-full max-w-4xl mx-auto h-96 overflow-hidden">
              <div className="flex items-center justify-center h-full relative">
                {/* Carousel Arrows */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 z-20 hover:scale-110"
                  aria-label="Vorig paneel"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
                <div className="w-full flex items-center justify-center z-10">
                  <img
                    src={getPanelImageUrl(currentPanel)}
                    alt={`Ekoline paneel ${currentPanel?.paneelnummer} ${variant}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                  />
                </div>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 z-20 hover:scale-110"
                  aria-label="Volgend paneel"
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Ekoline {currentPanel?.paneelnummer} - {variant === 'met' ? 'Met INOX oplegging' : 'Zonder INOX oplegging'}
              </h3>
              <div className="text-gray-500 text-sm mb-2 space-y-1 mt-2">
                {materiaalInfo.length === 0 ? (
                  <div>Geen materialen beschikbaar voor dit paneel</div>
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

          {/* Select Panel Button */}
          <div className="text-center">
            <button
              onClick={handleSelectPanel}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Check className="h-5 w-5" />
              <span>Kies dit paneel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ekoline Information Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <img 
              src="/ekoline-panels-overview.png" 
              alt="Ekoline panelen overzicht" 
              className="w-full max-w-6xl mx-auto rounded-lg"
            />
          </div>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              EkoLine-panelen zijn beschikbaar in een versie zonder opleggingen, met INOX-opleggingen en met zwarte 
              opleggingen.
            </p>
            <p>
              EkoLine is een esthetische collectie van deurpanelen. De klant krijgt onder meer de mogelijkheid deuren te fabriceren 
              volgens zijn eigen ontwerp, waarbij de beste constructieve oplossingen worden aangehouden.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EkolineConfigurator