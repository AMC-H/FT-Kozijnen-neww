import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

const SUPABASE_IMG_URL = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/kozijnen-photos/'

const UITGESLOTEN_MET = [9,11,30,55,62,72,73,74,75,109,110,111,112,134,140,141,142,143,144]
const UITGESLOTEN_ZONDER = [59,60,61,63,64,65,66,67,68,69,70,71,93,96,120,137]

// RAL & houtkleuren - volledige lijst
const RAL_CODES = [
  'RAL 1000','RAL 1001','RAL 1002','RAL 1003','RAL 1004','RAL 1005','RAL 1006','RAL 1007',
  'RAL 1016','RAL 1017','RAL 1019','RAL 1020','RAL 1023','RAL 1024','RAL 1026','RAL 1027','RAL 1028',
  'RAL 1032','RAL 1033','RAL 1034','RAL 1035','RAL 1036','RAL 1037',
  'RAL 2000','RAL 2001','RAL 2002','RAL 2003','RAL 2004','RAL 2005','RAL 2007',
  'RAL 3000','RAL 3001','RAL 3002','RAL 3003','RAL 3004','RAL 3005','RAL 3007','RAL 3009','RAL 3011',
  'RAL 3012','RAL 3013','RAL 3014','RAL 3015','RAL 3016','RAL 3017','RAL 3018','RAL 3020','RAL 3022',
  'RAL 3027','RAL 3028','RAL 3031',
  'RAL 4001','RAL 4002','RAL 4003','RAL 4004','RAL 4005','RAL 4006','RAL 4007','RAL 4008','RAL 4009','RAL 4010',
  'RAL 5000','RAL 5001','RAL 5002','RAL 5003','RAL 5004','RAL 5005','RAL 5007','RAL 5008','RAL 5009','RAL 5010',
  'RAL 5011','RAL 5012','RAL 5013','RAL 5014','RAL 5015','RAL 5017','RAL 5018','RAL 5019','RAL 5020','RAL 5021',
  'RAL 5022','RAL 5023','RAL 5024',
  'RAL 6000','RAL 6001','RAL 6002','RAL 6003','RAL 6004','RAL 6005','RAL 6006','RAL 6007','RAL 6008','RAL 6009',
  'RAL 6010','RAL 6011','RAL 6012','RAL 6013','RAL 6014','RAL 6015','RAL 6016','RAL 6017','RAL 6018','RAL 6019',
  'RAL 6020','RAL 6021','RAL 6022','RAL 6024','RAL 6025','RAL 6026','RAL 6027','RAL 6028','RAL 6029','RAL 6032',
  'RAL 6033','RAL 6034','RAL 6035','RAL 6036',
  'RAL 7000','RAL 7001','RAL 7002','RAL 7003','RAL 7004','RAL 7005','RAL 7006','RAL 7008','RAL 7009','RAL 7010',
  'RAL 7011','RAL 7012','RAL 7013','RAL 7015','RAL 7016','RAL 7019','RAL 7021','RAL 7022','RAL 7023','RAL 7024',
  'RAL 7026','RAL 7030','RAL 7031','RAL 7032','RAL 7033','RAL 7034','RAL 7035','RAL 7038','RAL 7040','RAL 7042',
  'RAL 7043','RAL 7044','RAL 7045','RAL 7046','RAL 7047','RAL 7048',
  'RAL 8000','RAL 8001','RAL 8002','RAL 8003','RAL 8004','RAL 8007','RAL 8008','RAL 8016','RAL 8017','RAL 8019',
  'RAL 8022','RAL 8023','RAL 8024','RAL 8025','RAL 8028','RAL 8029',
  'RAL 9001','RAL 9002','RAL 9003','RAL 9004','RAL 9005','RAL 9006','RAL 9007','RAL 9010','RAL 9016','RAL 9017',
  'RAL 9022','RAL 9023'
];

const KNOWN_RAL_HEX: Record<string, string> = {
  'RAL 9005': '#0A0A0A','RAL 9016': '#F2F2F2','RAL 9010': '#F5F1DF','RAL 9001': '#E6DCC7',
  'RAL 7016': '#373F43','RAL 7035': '#D7D7D7','RAL 7039': '#6D6F6A','RAL 8017': '#3B2B20',
  'RAL 8019': '#3E3B39','RAL 9006': '#A7A9AC','RAL 9007': '#8F8F8F'
};

const WOOD_NAMES = [
  'Stone Pine','Walnut','Wenge','Oak','Dark Chestnut','Cypress','Afromosia',
  'Cherry Tree','Forest Green','Framire','Light Green','Mahogany','Old Pine',
  'Sapelli','Golden Sun','Chestnut','Iroko','Acajou','Ash Gray','Brown Chocolate',
  'Beige','Tan','Calvados','Dark Brown','Milky White','Mocha','Frosty White','Kempas'
];

function stringToHsl(seed: string) {
  let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return `hsl(${h % 360},55%,55%)`
}

function buildGroupedColorOptions() {
  const ral = RAL_CODES.map(code => ({
    value: code,
    label: code,
    swatch: KNOWN_RAL_HEX[code] || stringToHsl(code)
  }));
  const wood = WOOD_NAMES.map(name => ({
    value: name,
    label: `${name} (houtkleur)`,
    swatch: stringToHsl(name)
  }));
  return [
    { label: 'RAL-kleuren', options: ral },
    { label: 'Houtkleuren', options: wood }
  ];
}

function ColorPickerSelect({
  value, onChange, groups, placeholder = 'Kies kleur'
}: {
  value?: string,
  onChange: (v: string) => void,
  groups: { label: string, options: { value: string, label: string, swatch: string }[] }[],
  placeholder?: string
}) {
  const [open, setOpen] = useState(false);
  const flat = groups.flatMap(g => g.options);
  const current = flat.find(o => o.value === value);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full border border-gray-300 rounded-lg p-3 flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block w-6 h-6 rounded border border-gray-300"
            style={{ background: current?.swatch || '#eee' }}
          />
          <span className={current ? 'text-gray-900' : 'text-gray-500'}>
            {current ? current.label : placeholder}
          </span>
        </div>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>
      </button>
      {open && (
        <div role="listbox" className="absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {groups.map(g => (
            <div key={g.label}>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 sticky top-0 bg-white">{g.label}</div>
              {g.options.map(o => (
                <button
                  type="button"
                  key={o.value}
                  role="option"
                  aria-selected={o.value === value}
                  onClick={() => { onChange(o.value); setOpen(false) }}
                  className={`w-full px-3 py-2 flex items-center gap-3 text-left ${o.value === value ? 'font-medium bg-blue-50' : ''}`}
                >
                  <span className="inline-block w-5 h-5 rounded border border-gray-300" style={{ background: o.swatch }} />
                  <span className="text-sm text-gray-900">{o.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

  function getMaatRange(materiaal: string | undefined, panel: PanelConfig, type: "breedte" | "hoogte") {
    if (!materiaal || !panel) return [undefined, undefined]
    if (materiaal === 'kunststof') {
      return type === "breedte"
        ? [panel.pvc_breedte_min_mm, panel.pvc_breedte_max_mm]
        : [panel.pvc_hoogte_min_mm, panel.pvc_hoogte_max_mm]
    }
    if (materiaal === 'aluminium') {
      return type === "breedte"
        ? [panel.alu_breedte_min_mm, panel.alu_breedte_max_mm]
        : [panel.alu_hoogte_min_mm, panel.alu_hoogte_max_mm]
    }
    if (materiaal === 'hout') {
      return type === "breedte"
        ? [panel.hout_breedte_min_mm, panel.hout_breedte_max_mm]
        : [panel.hout_hoogte_min_mm, panel.hout_hoogte_max_mm]
    }
    return [undefined, undefined]
  }

  return (
    <>
      {showConfig && currentPanel ? (
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
                    {currentPanel.beschikbaar_pvc && (
                      <option value="kunststof">Kunststof</option>
                    )}
                    {currentPanel.beschikbaar_alu && (
                      <option value="aluminium">Aluminium</option>
                    )}
                    {currentPanel.beschikbaar_hout && (
                      <option value="hout">Hout</option>
                    )}
                  </select>
                </div>
                {/* Breedte en Hoogte altijd zichtbaar */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Breedte (mm) *</label>
                    <input
                      type="number"
                      value={formData.breedte || ''}
                      onChange={e => handleFormChange('breedte', e.target.value)}
                      min={getMaatRange(formData.materiaal, currentPanel, "breedte")[0]}
                      max={getMaatRange(formData.materiaal, currentPanel, "breedte")[1]}
                      placeholder={
                        formData.materiaal
                          ? `Tussen ${getMaatRange(formData.materiaal, currentPanel, "breedte")[0]} en ${getMaatRange(formData.materiaal, currentPanel, "breedte")[1]} mm`
                          : "Kies eerst materiaal"
                      }
                      className="w-full border border-gray-300 rounded-lg p-3"
                      required
                      disabled={!formData.materiaal}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hoogte (mm) *</label>
                    <input
                      type="number"
                      value={formData.hoogte || ''}
                      onChange={e => handleFormChange('hoogte', e.target.value)}
                      min={getMaatRange(formData.materiaal, currentPanel, "hoogte")[0]}
                      max={getMaatRange(formData.materiaal, currentPanel, "hoogte")[1]}
                      placeholder={
                        formData.materiaal
                          ? `Tussen ${getMaatRange(formData.materiaal, currentPanel, "hoogte")[0]} en ${getMaatRange(formData.materiaal, currentPanel, "hoogte")[1]} mm`
                          : "Kies eerst materiaal"
                      }
                      className="w-full border border-gray-300 rounded-lg p-3"
                      required
                      disabled={!formData.materiaal}
                    />
                  </div>
                </div>
                {/* Kleur binnenzijde */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kleur binnenzijde *</label>
                  <ColorPickerSelect
                    value={formData.kleur_binnen}
                    onChange={v => handleFormChange('kleur_binnen', v)}
                    groups={buildGroupedColorOptions()}
                    placeholder="Kies kleur binnenzijde"
                  />
                </div>
                {/* Kleur buitenzijde */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kleur buitenzijde *</label>
                  <ColorPickerSelect
                    value={formData.kleur_buiten}
                    onChange={v => handleFormChange('kleur_buiten', v)}
                    groups={buildGroupedColorOptions()}
                    placeholder="Kies kleur buitenzijde"
                  />
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
      ) : loading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Ekoline deuren laden...</p>
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
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Terug naar configurator
            </button>
          </div>
        </div>
      ) : filteredPanelen.length === 0 ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Geen deuren beschikbaar voor variant "{variant}"
            </p>
            <button
              onClick={() => navigate('/configurator')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Terug naar configurator
            </button>
          </div>
        </div>
      ) : (
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
      )}
    </>
  )
}

export default EkolineConfigurator