import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const SUPABASE_IMG_URL = "https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/"

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
  if (typeof json === "object") return json
  try {
    return JSON.parse(json)
  } catch {
    return {}
  }
}

const standaardMaterialen = [
  { value: "aluminium", label: "Aluminium" },
  { value: "kunststof", label: "Kunststof" }
]

const standaardKleuren = [
  { value: "RAL 9016", label: "RAL 9016" },
  { value: "RAL 9005", label: "RAL 9005" },
  { value: "RAL 7016", label: "RAL 7016" },
  { value: "RAL 9001", label: "RAL 9001" },
  { value: "RAL 9010", label: "RAL 9010" }
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
      setPanelen((data || []).map((row: any) => ({
        ...row,
        config_options: parseConfigOptions(row.config_options)
      })))
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

  const asOptions = (arr?: string[]) => arr?.map(v => ({ value: v, label: v })) || []

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

  // ------------ CARROUSEL ------------
  if (!showConfig && currentPanel) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/configurator/buitendeuren')}
            className="mb-8 px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
          >
            ← Terug naar deuren
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Kies uw Despiro deur</h1>
            <p className="text-center text-gray-600 mb-8">
              Scroll en selecteer de gewenste deur uit onze exclusieve Despiro collectie.
            </p>
            <div className="flex items-center justify-center gap-6 mb-8">
              {/* Vorige thumbnail */}
              <img
                src={getPanelImageUrl(prevPanel)}
                alt={prevPanel?.naam || "Vorige"}
                className="w-16 h-24 object-contain opacity-60 hover:opacity-100 cursor-pointer transition"
                onClick={goToPrevious}
                style={{border: "2px solid #D1D5DB", borderRadius: 8}}
              />
              {/* Hoofdafbeelding */}
              <img
                src={getPanelImageUrl(currentPanel)}
                alt={currentPanel?.naam}
                className="w-52 h-80 object-contain rounded-lg shadow-2xl border-4 border-green-500"
              />
              {/* Volgende thumbnail */}
              <img
                src={getPanelImageUrl(nextPanel)}
                alt={nextPanel?.naam || "Volgende"}
                className="w-16 h-24 object-contain opacity-60 hover:opacity-100 cursor-pointer transition"
                onClick={goToNext}
                style={{border: "2px solid #D1D5DB", borderRadius: 8}}
              />
            </div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{currentPanel?.naam}</h2>
              <div className="text-gray-600 mt-2">
                <div><b>Design:</b> {currentPanel?.design_kenmerk || '-'}</div>
                <div><b>Beglazing:</b> {currentPanel?.beglazing_standaard || '-'}</div>
                <div>
                  <b>Afmetingen:</b> {currentPanel?.min_breedte}–{currentPanel?.max_breedte} mm breed,
                  {currentPanel?.min_hoogte}–{currentPanel?.max_hoogte} mm hoog
                </div>
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
    )
  }

  // ------------ FORMULIER ------------
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setShowConfig(false)}
          className="mb-8 px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
        >
          ← Terug naar deuren
        </button>
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="text-center mb-5">
            <img
              src={getPanelImageUrl(currentPanel)}
              alt={`Despiro deur ${currentPanel?.naam}`}
              className="mx-auto rounded-lg shadow-xl w-72 h-96 object-contain"
              onError={e => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-family="sans-serif" font-size="18"%3EAfbeelding niet beschikbaar%3C/text%3E%3C/svg%3E';
              }}
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          </div>
          <div className="mb-4 text-gray-700">
            <div><strong>Design kenmerk:</strong> {currentPanel?.design_kenmerk || '-'}</div>
            <div><strong>Beglazing standaard:</strong> {currentPanel?.beglazing_standaard || '-'}</div>
            <div>
              <strong>Afmetingen:</strong>
              {' '}Breedte {currentPanel?.min_breedte} - {currentPanel?.max_breedte} mm,
              {' '}Hoogte {currentPanel?.min_hoogte} - {currentPanel?.max_hoogte} mm
            </div>
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
                {standaardMaterialen.map(m => (
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
                  min={currentPanel?.min_breedte || 500}
                  max={currentPanel?.max_breedte || 1400}
                  placeholder={
                    currentPanel?.min_breedte && currentPanel?.max_breedte ?
                      `Tussen ${currentPanel.min_breedte} en ${currentPanel.max_breedte} mm`
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
                  min={currentPanel?.min_hoogte || 1900}
                  max={currentPanel?.max_hoogte || 2600}
                  placeholder={
                    currentPanel?.min_hoogte && currentPanel?.max_hoogte ?
                      `Tussen ${currentPanel.min_hoogte} en ${currentPanel.max_hoogte} mm`
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
                {standaardKleuren.map(k => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
            </div>
            {/* Dynamische opties uit config_options */}
            {currentPanel?.config_options?.Handgreep &&
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Handgreep *</label>
                <select
                  value={formData.handgreep || ''}
                  onChange={e => handleFormChange('handgreep', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                >
                  <option value="">Kies handgreep</option>
                  {asOptions(currentPanel.config_options.Handgreep).map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            }
            {currentPanel?.config_options?.Glas_Opties &&
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Glas optie *</label>
                <select
                  value={formData.glas_optie || ''}
                  onChange={e => handleFormChange('glas_optie', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                >
                  <option value="">Kies glas optie</option>
                  {asOptions(currentPanel.config_options.Glas_Opties).map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            }
            {currentPanel?.config_options?.Scharnieren &&
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scharnieren *</label>
                <select
                  value={formData.scharnieren || ''}
                  onChange={e => handleFormChange('scharnieren', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                >
                  <option value="">Kies scharnieren</option>
                  {asOptions(currentPanel.config_options.Scharnieren).map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            }
            {currentPanel?.config_options?.Kleur_Omkadering &&
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kleur omkadering *</label>
                <select
                  value={formData.kleur_omkadering || ''}
                  onChange={e => handleFormChange('kleur_omkadering', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                >
                  <option value="">Kies kleur omkadering</option>
                  {asOptions(currentPanel.config_options.Kleur_Omkadering).map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            }
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
  )
}

export default DespiroConfigurator