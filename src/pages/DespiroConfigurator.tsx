import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const SUPABASE_IMG_URL =
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/'

type ConfigOptions = {
  Handgreep?: string[]
  Glas_Opties?: string[]
  Scharnieren?: string[]
  Kleur_Omkadering?: string[]
}

interface DespiroPaneel {
  id: number
  naam: string
  slug: string
  image_path: string | null
  min_breedte: number | null
  max_breedte: number | null
  min_hoogte: number | null
  max_hoogte: number | null
  design_kenmerk: string | null
  beglazing_standaard: string | null
  config_options: ConfigOptions | null
}

function parseConfigOptions(json: any): ConfigOptions {
  if (!json) return {}
  if (typeof json === 'object') return json
  try {
    return JSON.parse(json)
  } catch {
    return {}
  }
}

const standaardMaterialen = [
  { value: 'aluminium', label: 'Aluminium' },
  { value: 'kunststof', label: 'Kunststof' },
]

const standaardKleuren = [
  { value: 'RAL 9016', label: 'RAL 9016' },
  { value: 'RAL 9005', label: 'RAL 9005' },
  { value: 'RAL 7016', label: 'RAL 7016' },
  { value: 'RAL 9001', label: 'RAL 9001' },
  { value: 'RAL 9010', label: 'RAL 9010' },
]

const DespiroConfigurator: React.FC = () => {
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
      setPanelen(
        (data || []).map((row: any) => ({
          ...row,
          config_options: parseConfigOptions(row.config_options),
        }))
      )
      setLoading(false)
    }
    loadPanelen()
  }, [])

  const currentPanel = panelen[currentIndex] || null
  const prevPanel = panelen[(currentIndex - 1 + panelen.length) % panelen.length]
  const nextPanel = panelen[(currentIndex + 1) % panelen.length]

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
    alert(
      'Gegevens klaar voor verzending:\n' +
        JSON.stringify(
          {
            ...formData,
            paneelId: currentPanel?.id,
            paneelNaam: currentPanel?.naam,
          },
          null,
          2
        )
    )
  }

  const goToPrevious = () => {
    if (panelen.length === 0) return
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : panelen.length - 1))
  }
  const goToNext = () => {
    if (panelen.length === 0) return
    setCurrentIndex((prev) => (prev < panelen.length - 1 ? prev + 1 : 0))
  }

  const asOptions = (arr?: string[]) =>
    arr?.map((v) => ({ value: v, label: v })) || []

  // --- CARROUSEL ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Despiro deuren laden...</p>
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
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Terug naar configurator
          </button>
        </div>
      </div>
    )
  }

  if (!showConfig && currentPanel) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <button
              onClick={() => navigate('/configurator')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1 bg-transparent border-none px-0 py-0"
              style={{ marginBottom: '0.5rem' }}
            >
              <span style={{ fontSize: '1.2rem' }}>&larr;</span>
              Terug naar configuratie
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg px-4 md:px-12 py-8">
            <h1 className="text-3xl font-bold text-center mb-2">Despiro Deuren</h1>
            <p className="text-center text-gray-600 mb-10">
              Kies uw gewenste deur design uit onze exclusieve Despiro collectie.
            </p>
            <div className="flex items-center justify-center gap-2 md:gap-6 mb-8">
              {/* Vorige thumbnail */}
              <button
                onClick={goToPrevious}
                aria-label="Vorige deur"
                className="rounded-full bg-white shadow-sm hover:bg-gray-100 transition p-2 mr-2"
                style={{ marginRight: '-1.5rem', zIndex: 2 }}
              >
                <ChevronLeft className="h-6 w-6 text-gray-500" />
              </button>
              <img
                src={getPanelImageUrl(prevPanel)}
                alt={prevPanel?.naam || 'Vorige'}
                className="w-20 h-36 object-contain opacity-40 grayscale pointer-events-none select-none"
                draggable={false}
                style={{
                  boxShadow: '0 2px 8px #0001',
                  background: '#f8f8f8',
                  borderRadius: 16,
                }}
              />
              {/* Hoofdafbeelding */}
              <div
                className="bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center"
                style={{
                  padding: '2.5rem 2rem',
                  minWidth: 340, // GROOT!
                  minHeight: 410,
                  maxWidth: 380,
                  maxHeight: 470,
                }}
              >
                <img
                  src={getPanelImageUrl(currentPanel)}
                  alt={currentPanel?.naam}
                  className="w-60 h-96 object-contain"
                  style={{ margin: '0 auto', maxWidth: 320, maxHeight: 400 }}
                />
              </div>
              <img
                src={getPanelImageUrl(nextPanel)}
                alt={nextPanel?.naam || 'Volgende'}
                className="w-20 h-36 object-contain opacity-40 grayscale pointer-events-none select-none"
                draggable={false}
                style={{
                  boxShadow: '0 2px 8px #0001',
                  background: '#f8f8f8',
                  borderRadius: 16,
                }}
              />
              <button
                onClick={goToNext}
                aria-label="Volgende deur"
                className="rounded-full bg-white shadow-sm hover:bg-gray-100 transition p-2 ml-2"
                style={{ marginLeft: '-1.5rem', zIndex: 2 }}
              >
                <ChevronRight className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                {currentPanel?.slug
                  ? `Despiro deur ${currentPanel.slug.toUpperCase()}`
                  : currentPanel?.naam}
              </h2>
              {/* Geen extra info tonen hier! */}
            </div>
            <div className="text-center">
              <button
                onClick={() => setShowConfig(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto text-lg"
              >
                <Check className="h-5 w-5" />
                <span>Configureer deze deur</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- FORMULIER ---
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowConfig(false)}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1 bg-transparent border-none px-0 py-0"
          >
            <span style={{ fontSize: '1.2rem' }}>&larr;</span>
            Terug naar configuratie
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Titel + info */}
          <div className="text-center mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              {currentPanel?.slug
                ? `Despiro deur ${currentPanel.slug.toUpperCase()}`
                : currentPanel?.naam}
            </h2>
            <div className="mb-4 text-gray-700 text-center">
              <div>
                <strong>Design kenmerk:</strong> {currentPanel?.design_kenmerk || '-'}
              </div>
              <div>
                <strong>Beglazing standaard:</strong>{' '}
                {currentPanel?.beglazing_standaard || '-'}
              </div>
              <div>
                <strong>Afmetingen:</strong>
                {' '}
                Breedte {currentPanel?.min_breedte} - {currentPanel?.max_breedte} mm,
                {' '}
                Hoogte {currentPanel?.min_hoogte} - {currentPanel?.max_hoogte} mm
              </div>
            </div>
          </div>
          <div className="text-center mb-5">
            <img
              src={getPanelImageUrl(currentPanel)}
              alt={`Despiro deur ${currentPanel?.naam}`}
              className="mx-auto rounded-lg shadow-xl w-[320px] h-[400px] object-contain"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-family="sans-serif" font-size="18"%3EAfbeelding niet beschikbaar%3C/text%3E%3C/svg%3E'
              }}
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Materiaal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materiaal *
              </label>
              <select
                value={formData.materiaal || ''}
                onChange={(e) => handleFormChange('materiaal', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              >
                <option value="">Kies materiaal</option>
                {standaardMaterialen.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Breedte en Hoogte */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breedte (mm) *
                </label>
                <input
                  type="number"
                  value={formData.breedte || ''}
                  onChange={(e) => handleFormChange('breedte', e.target.value)}
                  min={currentPanel?.min_breedte || 500}
                  max={currentPanel?.max_breedte || 1400}
                  placeholder={
                    currentPanel?.min_breedte && currentPanel?.max_breedte
                      ? `Tussen ${currentPanel.min_breedte} en ${currentPanel.max_breedte} mm`
                      : 'Geef breedte op'
                  }
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hoogte (mm) *
                </label>
                <input
                  type="number"
                  value={formData.hoogte || ''}
                  onChange={(e) => handleFormChange('hoogte', e.target.value)}
                  min={currentPanel?.min_hoogte || 1900}
                  max={currentPanel?.max_hoogte || 2600}
                  placeholder={
                    currentPanel?.min_hoogte && currentPanel?.max_hoogte
                      ? `Tussen ${currentPanel.min_hoogte} en ${currentPanel.max_hoogte} mm`
                      : 'Geef hoogte op'
                  }
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                />
              </div>
            </div>
            {/* Kleur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kleur *
              </label>
              <select
                value={formData.kleur || ''}
                onChange={(e) => handleFormChange('kleur', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              >
                <option value="">Kies kleur</option>
                {standaardKleuren.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Dynamische opties uit config_options */}
            {currentPanel?.config_options?.Handgreep && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Handgreep *
                </label>
                <select
                  value={formData.handgreep || ''}
                  onChange={(e) => handleFormChange('handgreep', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                >
                  <option value="">Kies handgreep</option>
                  {asOptions(currentPanel.config_options.Handgreep).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {currentPanel?.config_options?.Glas_Opties && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Glas optie *
                </label>
                <select
                  value={formData.glas_optie || ''}
                  onChange={(e) => handleFormChange('glas_optie', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                >
                  <option value="">Kies glas optie</option>
                  {asOptions(currentPanel.config_options.Glas_Opties).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {currentPanel?.config_options?.Scharnieren && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scharnieren *
                </label>
                <select
                  value={formData.scharnieren || ''}
                  onChange={(e) => handleFormChange('scharnieren', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                >
                  <option value="">Kies scharnieren</option>
                  {asOptions(currentPanel.config_options.Scharnieren).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {currentPanel?.config_options?.Kleur_Omkadering && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kleur omkadering *
                </label>
                <select
                  value={formData.kleur_omkadering || ''}
                  onChange={(e) =>
                    handleFormChange('kleur_omkadering', e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                >
                  <option value="">Kies kleur omkadering</option>
                  {asOptions(currentPanel.config_options.Kleur_Omkadering).map(
                    (o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}
            {/* Opmerkingen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opmerkingen
              </label>
              <textarea
                value={formData.opmerkingen || ''}
                onChange={(e) => handleFormChange('opmerkingen', e.target.value)}
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
  )
}

export default DespiroConfigurator