import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom'
import { Image as ImageIcon, DoorOpen as Door, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import PhotoUpload from '../components/PhotoUpload'
import modellen from '../data/modellen.json'
import ImageWithFallback from '../components/ImageWithFallback'

interface DespiroPanel {
  id: number
  slug: string
  naam: string
  image_path: string | null
  min_breedte: number | null
  max_breedte: number | null
  min_hoogte: number | null
  max_hoogte: number | null
  design_kenmerk: string | null
  beglazing_standaard: string | null
  config_options: any
}

const EKOVITRE_DESC: Record<string, string[]> = {
  '01': ['Moderne verticale glasstroken', 'Elegante minimalistische uitstraling', 'Perfect voor hedendaagse architectuur'],
  '02': ['Horizontale glasverdeling', 'Klassieke symmetrische indeling', 'Tijdloze elegantie'],
  '03': ['Asymmetrische glasverdeling', 'Speelse moderne uitstraling', 'Unieke karakteristieke look'],
  '04': ['Grote centrale glaspartij', 'Maximale lichtinval', 'Open en ruimtelijk gevoel'],
  '05': ['Verticale glasstroken met accent', 'Dynamische uitstraling', 'Moderne architecturale details'],
  '06': ['Horizontale banden', 'Strakke lijnenspel', 'Eigentijdse vormgeving'],
  '07': ['Diagonale glasaccenten', 'Unieke geometrische vorm', 'Opvallende designstatement'],
  '08': ['Ruitverdeling klassiek', 'Traditionele uitstraling', 'Tijdloze charme'],
  '09': ['Moderne glasmozaïek', 'Artistieke glasverdeling', 'Creatieve vormgeving'],
  '10': ['Verticale accenten', 'Slanke elegante lijnen', 'Verfijnde uitstraling'],
  '11': ['Horizontale focus', 'Brede glaspartijen', 'Panoramische uitstraling'],
  '12': ['Geometrische patronen', 'Moderne kunstzinnige vorm', 'Architectonisch statement'],
  '13': ['Klassieke kruisverdeling', 'Traditionele charme', 'Herkenbare vormgeving'],
  '14': ['Asymmetrische moderne vorm', 'Speelse glasverdeling', 'Eigentijdse uitstraling'],
  '15': ['Minimalistisch design', 'Strakke eenvoud', 'Pure vormgeving']
}

const EKOVITRE_MIN_BREEDTE = 600
const EKOVITRE_MAX_BREEDTE = 950
const EKOVITRE_MIN_HOOGTE = 1700
const EKOVITRE_MAX_HOOGTE = 2200

const WOOD_NAMES = [
  'Stone Pine','Walnut','Wenge','Oak','Dark Chestnut','Cypress','Afromosia',
  'Cherry Tree','Forest Green','Framire','Light Green','Mahogany','Old Pine',
  'Sapelli','Golden Sun','Chestnut','Iroko','Acajou','Ash Gray','Brown Chocolate',
  'Beige','Tan','Calvados','Dark Brown','Milky White','Mocha','Frosty White','Kempas'
] as const

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
] as const

const KNOWN_RAL_HEX: Record<string, string> = {
  'RAL 9005': '#0A0A0A','RAL 9016': '#F2F2F2','RAL 9010': '#F5F1DF','RAL 9001': '#E6DCC7',
  'RAL 7016': '#373F43','RAL 7035': '#D7D7D7','RAL 7039': '#6D6F6A','RAL 8017': '#3B2B20',
  'RAL 8019': '#3E3B39','RAL 9006': '#A7A9AC','RAL 9007': '#8F8F8F'
}

function stringToHsl(seed: string) {
  let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return `hsl(${h % 360},55%,55%)`
}

type ColorOption = { value: string; label: string; swatch: string }
type ColorGroup  = { label: string; options: ColorOption[] }

function buildGroupedColorOptions(materialLabel?: string): ColorGroup[] {
  const ral: ColorOption[] = RAL_CODES.map(code => ({
    value: code, label: code, swatch: KNOWN_RAL_HEX[code] || stringToHsl(code)
  }))
  if (materialLabel === 'Hout') {
    const wood: ColorOption[] = WOOD_NAMES.map(n => ({ value: n, label: n, swatch: stringToHsl(n) }))
    return [{ label: 'Houtkleuren', options: wood }, { label: 'RAL-kleuren', options: ral }]
  }
  return [{ label: 'RAL-kleuren', options: ral }]
}

// ... hier horen je ColorPickerSelect, alle helpers, renderField, UI, forms, carrousel, enz.

const Configurator: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [currentModelIndex, setCurrentModelIndex] = useState(0)
  const [formData, setFormData] = useState<any>({})
  const [photoIds, setPhotoIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [despiroPanel, setDespiroPanel] = useState<DespiroPanel | null>(null)

  useEffect(() => {
    const ekolinePanel = searchParams.get('ekolinePanel')
    const ekolineVariant = searchParams.get('ekolineVariant')
    const ekovitrePanel = searchParams.get('ekovitrePanel')
    const classiclinePanel = searchParams.get('classiclinePanel')
    const despiroPanelSlug = searchParams.get('despiroPanelSlug')
    const preSelectedCategory = location.state?.preSelectedCategory

    if (ekolinePanel && ekolineVariant) {
      setSelectedCategory('buitendeuren')
      setSelectedModel({
        naam: `Ekoline Paneel ${ekolinePanel}`,
        afbeelding: `https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/kozijnen-photos/vbpaneel-${ekolinePanel}-k-${ekolineVariant}.jpg`,
        type: 'ekoline',
        velden: ['materiaal', 'breedte', 'hoogte', 'kleurBinnen', 'kleurBuiten', 'glasoptie', 'dorpel', 'draairichting', 'hangEnSluitwerk', 'aanslag', 'opmerkingen', 'fotoUpload']
      })
    } else if (ekovitrePanel) {
      setSelectedCategory('buitendeuren')
      setSelectedModel({
        naam: `EkoVitre Glaspaneel ${ekovitrePanel}`,
        afbeelding: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/kozijnen-photos/EkoVitre-glaspanelen-${ekovitrePanel}-k.jpg`,
        type: 'ekovitre',
        velden: ['materiaal', 'breedte', 'hoogte', 'kleurBinnen', 'kleurBuiten', 'glasoptie', 'dorpel', 'draairichting', 'hangEnSluitwerk', 'aanslag', 'opmerkingen', 'fotoUpload']
      })
    } else if (classiclinePanel) {
      setSelectedCategory('buitendeuren')
      setSelectedModel({
        naam: `ClassicLine Paneel ${classiclinePanel}`,
        afbeelding: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/kozijnen-photos/ClassicLine-panelen-${classiclinePanel}-k.jpg`,
        type: 'classicline',
        velden: ['materiaal', 'breedte', 'hoogte', 'kleurBinnen', 'kleurBuiten', 'glasoptie', 'dorpel', 'draairichting', 'hangEnSluitwerk', 'aanslag', 'opmerkingen', 'fotoUpload']
      })
    } else if (despiroPanelSlug) {
      loadDespiroPanel(despiroPanelSlug)
    } else if (preSelectedCategory) {
      setSelectedCategory(preSelectedCategory)
    }
  }, [searchParams, location.state])

  const loadDespiroPanel = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('despiro_panelen')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Error loading Despiro panel:', error)
        return
      }

      if (data) {
        setDespiroPanel(data)
        setSelectedCategory('buitendeuren')
        setSelectedModel({
          naam: data.naam,
          afbeelding: data.image_path ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${data.image_path}` : '',
          type: 'despiro',
          velden: ['materiaal', 'breedte', 'hoogte', 'kleurBinnen', 'kleurBuiten', 'glasoptie', 'dorpel', 'draairichting', 'hangEnSluitwerk', 'aanslag', 'opmerkingen', 'fotoUpload']
        })
      }
    } catch (error) {
      console.error('Error loading Despiro panel:', error)
    }
  }

  // ... (hier hoort je hele formulier, renderField, UI, alle logic, carrousel, etc.)

  return (
    // ... jouw complete render code: grids, carrousel, forms, knoppen, alles wat je had!
  )
}

export default Configurator
  max_breedte: number | null
  min_hoogte: number | null
  max_hoogte: number | null
  design_kenmerk: string | null
  beglazing_standaard: string | null
  config_options: any
}

const EKOVITRE_DESC: Record<string, string[]> = {
  '01': ['Moderne verticale glasstroken', 'Elegante minimalistische uitstraling', 'Perfect voor hedendaagse architectuur'],
  '02': ['Horizontale glasverdeling', 'Klassieke symmetrische indeling', 'Tijdloze elegantie'],
  '03': ['Asymmetrische glasverdeling', 'Speelse moderne uitstraling', 'Unieke karakteristieke look'],
  '04': ['Grote centrale glaspartij', 'Maximale lichtinval', 'Open en ruimtelijk gevoel'],
  '05': ['Verticale glasstroken met accent', 'Dynamische uitstraling', 'Moderne architecturale details'],
  '06': ['Horizontale banden', 'Strakke lijnenspel', 'Eigentijdse vormgeving'],
  '07': ['Diagonale glasaccenten', 'Unieke geometrische vorm', 'Opvallende designstatement'],
  '08': ['Ruitverdeling klassiek', 'Traditionele uitstraling', 'Tijdloze charme'],
  '09': ['Moderne glasmozaïek', 'Artistieke glasverdeling', 'Creatieve vormgeving'],
  '10': ['Verticale accenten', 'Slanke elegante lijnen', 'Verfijnde uitstraling'],
  '11': ['Horizontale focus', 'Brede glaspartijen', 'Panoramische uitstraling'],
  '12': ['Geometrische patronen', 'Moderne kunstzinnige vorm', 'Architectonisch statement'],
  '13': ['Klassieke kruisverdeling', 'Traditionele charme', 'Herkenbare vormgeving'],
  '14': ['Asymmetrische moderne vorm', 'Speelse glasverdeling', 'Eigentijdse uitstraling'],
  '15': ['Minimalistisch design', 'Strakke eenvoud', 'Pure vormgeving']
}

const EKOVITRE_MIN_BREEDTE = 600
const EKOVITRE_MAX_BREEDTE = 950
const EKOVITRE_MIN_HOOGTE  = 1700
const EKOVITRE_MAX_HOOGTE  = 2200

const WOOD_NAMES = [
  'Stone Pine','Walnut','Wenge','Oak','Dark Chestnut','Cypress','Afromosia',
  'Cherry Tree','Forest Green','Framire','Light Green','Mahogany','Old Pine',
  'Sapelli','Golden Sun','Chestnut','Iroko','Acajou','Ash Gray','Brown Chocolate',
  'Beige','Tan','Calvados','Dark Brown','Milky White','Mocha','Frosty White','Kempas'
] as const
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
] as const

const KNOWN_RAL_HEX: Record<string, string> = {
  'RAL 9005': '#0A0A0A','RAL 9016': '#F2F2F2','RAL 9010': '#F5F1DF','RAL 9001': '#E6DCC7',
  'RAL 7016': '#373F43','RAL 7035': '#D7D7D7','RAL 7039': '#6D6F6A','RAL 8017': '#3B2B20',
  'RAL 8019': '#3E3B39','RAL 9006': '#A7A9AC','RAL 9007': '#8F8F8F'
}

function stringToHsl(seed: string) {
  let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return `hsl(${h % 360},55%,55%)`
}

type ColorOption = { value: string; label: string; swatch: string }
type ColorGroup  = { label: string; options: ColorOption[] }

function buildGroupedColorOptions(materialLabel?: string): ColorGroup[] {
  const ral: ColorOption[] = RAL_CODES.map(code => ({
    value: code, label: code, swatch: KNOWN_RAL_HEX[code] || stringToHsl(code)
  }))
  if (materialLabel === 'Hout') {
    const wood: ColorOption[] = WOOD_NAMES.map(n => ({ value: n, label: n, swatch: stringToHsl(n) }))
    return [{ label: 'Houtkleuren', options: wood }, { label: 'RAL-kleuren', options: ral }]
  }
  return [{ label: 'RAL-kleuren', options: ral }]
}

// ... je ColorPickerSelect component hoort hier, laat weten als je deze wilt zien

// Vanaf hier volgt je hele Configurator component (zie vorige blokken voor de rest van de code)
function ColorPickerSelect({
  value, onChange, groups, placeholder = 'Kies kleur',
}: {
  value?: string
  onChange: (v: string) => void
  groups: ColorGroup[]
  placeholder?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const flat: ColorOption[] = groups.flatMap(g => g.options)
  const current = flat.find(o => o.value === value)
  const [hi, setHi] = useState<number>(Math.max(0, flat.findIndex(o => o.value === value)))

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (!open) return
    const kb = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setHi(h => Math.min(h + 1, flat.length - 1)); return }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); return }
      if (e.key === 'Enter')     { e.preventDefault(); const opt = flat[hi]; if (opt) { onChange(opt.value); setOpen(false) } }
    }
    document.addEventListener('keydown', kb)
    return () => document.removeEventListener('keydown', kb)
  }, [open, hi, flat, onChange])

  return (
    <div ref={ref} className="relative">
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
            style={{ background: current?.swatch || 'repeating-linear-gradient(45deg,#eee,#eee 6px,#ddd 6px,#ddd 12px)' }}
          />
          <span className={current ? 'text-gray-900' : 'text-gray-500'}>
            {current ? current.label : placeholder}
          </span>
        </div>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>
      </button>
      {open && (
        <div role="listbox" className="absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {groups.map((g, gi) => (
            <div key={g.label}>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 sticky top-0 bg-white">{g.label}</div>
              {g.options.map((o, oi) => {
                const index = groups.slice(0, gi).reduce((acc, gg) => acc + gg.options.length, 0) + oi
                const active = index === hi
                const selected = o.value === value
                return (
                  <button
                    type="button"
                    key={o.value}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setHi(index)}
                    onClick={() => { onChange(o.value); setOpen(false) }}
                    className={`w-full px-3 py-2 flex items-center gap-3 text-left ${active ? 'bg-blue-50' : ''} ${selected ? 'font-medium' : ''}`}
                  >
                    <span className="inline-block w-5 h-5 rounded border border-gray-300" style={{ background: o.swatch }} />
                    <span className="text-sm text-gray-900">{o.label}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
const Configurator: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [currentModelIndex, setCurrentModelIndex] = useState(0)
  const [formData, setFormData] = useState<any>({})
  const [photoIds, setPhotoIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [despiroPanel, setDespiroPanel] = useState<DespiroPanel | null>(null)

  useEffect(() => {
    const ekolinePanel = searchParams.get('ekolinePanel')
    const ekolineVariant = searchParams.get('ekolineVariant')
    const ekovitrePanel = searchParams.get('ekovitrePanel')
    const classiclinePanel = searchParams.get('classiclinePanel')
    const despiroPanelSlug = searchParams.get('despiroPanelSlug')
    const preSelectedCategory = location.state?.preSelectedCategory

    if (ekolinePanel && ekolineVariant) {
      setSelectedCategory('buitendeuren')
      setSelectedModel({
        naam: `Ekoline Paneel ${ekolinePanel}`,
        afbeelding: `https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/kozijnen-photos/vbpaneel-${ekolinePanel}-k-${ekolineVariant}.jpg`,
        type: 'ekoline',
        velden: ['materiaal', 'breedte', 'hoogte', 'kleurBinnen', 'kleurBuiten', 'glasoptie', 'dorpel', 'draairichting', 'hangEnSluitwerk', 'aanslag', 'opmerkingen', 'fotoUpload']
      })
    } else if (ekovitrePanel) {
      setSelectedCategory('buitendeuren')
      setSelectedModel({
        naam: `EkoVitre Glaspaneel ${ekovitrePanel}`,
        afbeelding: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/kozijnen-photos/EkoVitre-glaspanelen-${ekovitrePanel}-k.jpg`,
        type: 'ekovitre',
        velden: ['materiaal', 'breedte', 'hoogte', 'kleurBinnen', 'kleurBuiten', 'glasoptie', 'dorpel', 'draairichting', 'hangEnSluitwerk', 'aanslag', 'opmerkingen', 'fotoUpload']
      })
    } else if (classiclinePanel) {
      setSelectedCategory('buitendeuren')
      setSelectedModel({
        naam: `ClassicLine Paneel ${classiclinePanel}`,
        afbeelding: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/kozijnen-photos/ClassicLine-panelen-${classiclinePanel}-k.jpg`,
        type: 'classicline',
        velden: ['materiaal', 'breedte', 'hoogte', 'kleurBinnen', 'kleurBuiten', 'glasoptie', 'dorpel', 'draairichting', 'hangEnSluitwerk', 'aanslag', 'opmerkingen', 'fotoUpload']
      })
    } else if (despiroPanelSlug) {
      loadDespiroPanel(despiroPanelSlug)
    } else if (preSelectedCategory) {
      setSelectedCategory(preSelectedCategory)
    }
  }, [searchParams, location.state])

  const loadDespiroPanel = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('despiro_panelen')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Error loading Despiro panel:', error)
        return
      }

      if (data) {
        setDespiroPanel(data)
        setSelectedCategory('buitendeuren')
        setSelectedModel({
          naam: data.naam,
          afbeelding: data.image_path ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${data.image_path}` : '',
          type: 'despiro',
          velden: ['materiaal', 'breedte', 'hoogte', 'kleurBinnen', 'kleurBuiten', 'glasoptie', 'dorpel', 'draairichting', 'hangEnSluitwerk', 'aanslag', 'opmerkingen', 'fotoUpload']
        })
      }
    } catch (error) {
      console.error('Error loading Despiro panel:', error)
    }
  }
    // Get available models for selected category
  const availableModels = useMemo(() => {
    if (!selectedCategory) return []
    
    switch (selectedCategory) {
      case 'ramen':
        return modellen.ramen || []
      case 'buitendeuren':
        return modellen.buitendeuren || []
      case 'schuifsystemen':
        return modellen.schuifsystemen || []
      default:
        return []
    }
  }, [selectedCategory])

  // Navigation functions
  const nextModel = () => {
    if (currentModelIndex < availableModels.length - 1) {
      setCurrentModelIndex(currentModelIndex + 1)
    } else {
      setCurrentModelIndex(0)
    }
  }

  const prevModel = () => {
    if (currentModelIndex > 0) {
      setCurrentModelIndex(currentModelIndex - 1)
    } else {
      setCurrentModelIndex(availableModels.length - 1)
    }
  }

  const selectCurrentModel = () => {
    const model = availableModels[currentModelIndex]
    if (model) {
      setSelectedModel(model)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setLoading(true)

    try {
      // Create or update quote
      const quoteData = {
        user_id: user.id,
        items: [{
          model: selectedModel?.naam || 'Onbekend model',
          categorie: selectedCategory,
          formulier: {
            ...formData,
            photoIds: photoIds,
            modelImageUrl: selectedModel?.afbeelding
          }
        }],
        status: 'concept'
      }

      const { data, error } = await supabase
        .from('quotes')
        .insert([quoteData])
        .select()

      if (error) {
        console.error('Error saving quote:', error)
        alert('Er ging iets mis bij het opslaan van de offerte')
        return
      }

      // Navigate to quotes with success message
      navigate('/quotes', {
        state: {
          success: 'kozijn-added',
          kozijnModel: selectedModel?.naam || 'Onbekend model',
          kozijnCategorie: selectedCategory
        }
      })

    } catch (error) {
      console.error('Error:', error)
      alert('Er ging iets mis bij het opslaan van de offerte')
    } finally {
      setLoading(false)
    }
  }
    const renderField = (field: string) => {
    const colorGroups = buildGroupedColorOptions(formData.materiaal)

    switch (field) {
      case 'materiaal':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Materiaal *</label>
            <select
              value={formData.materiaal || ''}
              onChange={(e) => handleInputChange('materiaal', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Kies materiaal</option>
              <option value="Kunststof">Kunststof</option>
              <option value="Hout">Hout</option>
              <option value="Aluminium">Aluminium</option>
            </select>
          </div>
        )

      case 'breedte':
        const minBreedte = despiroPanel?.min_breedte || 
                          (selectedModel?.type === 'ekovitre' ? EKOVITRE_MIN_BREEDTE : 400)
        const maxBreedte = despiroPanel?.max_breedte || 
                          (selectedModel?.type === 'ekovitre' ? EKOVITRE_MAX_BREEDTE : 3000)
        
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breedte (mm) * 
              <span className="text-xs text-gray-500">
                (min: {minBreedte}mm, max: {maxBreedte}mm)
              </span>
            </label>
            <input
              type="number"
              min={minBreedte}
              max={maxBreedte}
              value={formData.breedte || ''}
              onChange={(e) => handleInputChange('breedte', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Tussen ${minBreedte} en ${maxBreedte} mm`}
              required
            />
          </div>
        )

      case 'hoogte':
        const minHoogte = despiroPanel?.min_hoogte || 
                         (selectedModel?.type === 'ekovitre' ? EKOVITRE_MIN_HOOGTE : 400)
        const maxHoogte = despiroPanel?.max_hoogte || 
                         (selectedModel?.type === 'ekovitre' ? EKOVITRE_MAX_HOOGTE : 3000)
        
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hoogte (mm) * 
              <span className="text-xs text-gray-500">
                (min: {minHoogte}mm, max: {maxHoogte}mm)
              </span>
            </label>
            <input
              type="number"
              min={minHoogte}
              max={maxHoogte}
              value={formData.hoogte || ''}
              onChange={(e) => handleInputChange('hoogte', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Tussen ${minHoogte} en ${maxHoogte} mm`}
              required
            />
          </div>
        )

      case 'kleurBinnen':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kleur binnenzijde *</label>
            <ColorPickerSelect
              value={formData.kleurBinnen}
              onChange={(value) => handleInputChange('kleurBinnen', value)}
              groups={colorGroups}
              placeholder="Kies kleur binnenzijde"
            />
          </div>
        )

      case 'kleurBuiten':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kleur buitenzijde *</label>
            <ColorPickerSelect
              value={formData.kleurBuiten}
              onChange={(value) => handleInputChange('kleurBuiten', value)}
              groups={colorGroups}
              placeholder="Kies kleur buitenzijde"
            />
          </div>
        )

      case 'kleurBewegendeDelen':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kleur bewegende delen</label>
            <ColorPickerSelect
              value={formData.kleurBewegendeDelen}
              onChange={(value) => handleInputChange('kleurBewegendeDelen', value)}
              groups={colorGroups}
              placeholder="Kies kleur bewegende delen"
            />
          </div>
        )

      case 'glasoptie':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Glasoptie *</label>
            <select
              value={formData.glasoptie || ''}
              onChange={(e) => handleInputChange('glasoptie', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Kies glasoptie</option>
              <option value="HR++">HR++ (standaard)</option>
              <option value="Triple">Triple glas</option>
              <option value="Mat">Mat glas</option>
            </select>
          </div>
        )

      case 'profielKeuze':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profiel keuze</label>
            <select
              value={formData.profielKeuze || ''}
              onChange={(e) => handleInputChange('profielKeuze', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Kies profiel</option>
              <option value="ideal-7000">Ideal 7000</option>
              <option value="ideal-8000">Ideal 8000</option>
            </select>
          </div>
        )

      // ... Rest van je cases voor velden (draairichting, hor, dorpel, hangEnSluitwerk, aanslag, opmerkingen, fotoUpload, etc.)
    }
  }
        case 'draairichting':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Draairichting</label>
            <select
              value={formData.draairichting || ''}
              onChange={(e) => handleInputChange('draairichting', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Kies draairichting</option>
              <option value="links">Links</option>
              <option value="rechts">Rechts</option>
            </select>
          </div>
        )

      case 'hor':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hor (insectenscreen)</label>
            <select
              value={formData.hor || ''}
              onChange={(e) => handleInputChange('hor', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Kies optie</option>
              <option value="ja">Ja, gewenst</option>
              <option value="nee">Nee, niet gewenst</option>
            </select>
          </div>
        )

      case 'dorpel':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dorpel</label>
            <select
              value={formData.dorpel || ''}
              onChange={(e) => handleInputChange('dorpel', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Kies dorpel</option>
              <option value="standaard">Standaard dorpel</option>
              <option value="lage-dorpel">Lage dorpel</option>
              <option value="geen-dorpel">Geen dorpel</option>
            </select>
          </div>
        )

      case 'hangEnSluitwerk':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hang- en sluitwerk</label>
            <select
              value={formData.hangEnSluitwerk || ''}
              onChange={(e) => handleInputChange('hangEnSluitwerk', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Kies hang- en sluitwerk</option>
              <option value="standaard">Standaard</option>
              <option value="veiligheid">Veiligheidsslot</option>
              <option value="anti-inbraak">Anti-inbraak</option>
            </select>
          </div>
        )

      case 'aanslag':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aanslag</label>
            <select
              value={formData.aanslag || ''}
              onChange={(e) => handleInputChange('aanslag', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Kies aanslag</option>
              <option value="ja">Ja</option>
              <option value="nee">Nee</option>
            </select>
          </div>
        )

      case 'opmerkingen':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opmerkingen</label>
            <textarea
              value={formData.opmerkingen || ''}
              onChange={(e) => handleInputChange('opmerkingen', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Eventuele opmerkingen of speciale wensen..."
            />
          </div>
        )

      case 'fotoUpload':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto's uploaden</label>
            <p className="text-sm text-gray-600 mb-4">
              Upload foto's van de huidige situatie, gewenste stijl of andere relevante afbeeldingen
            </p>
            <PhotoUpload
              userId={user?.id || ''}
              onPhotosUploaded={setPhotoIds}
              existingPhotoIds={photoIds}
              maxFiles={5}
            />
          </div>
        )

      default:
        return null
    }
  }

  const isFormValid = () => {
    if (!selectedModel) return false
    
    const requiredFields = selectedModel.velden?.filter((field: string) => 
      ['materiaal', 'breedte', 'hoogte', 'kleurBinnen', 'kleurBuiten', 'glasoptie'].includes(field)
    ) || []
    
    return requiredFields.every((field: string) => formData[field])
  }
  // ---- UI/JSX en return van de component ----

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Configureer uw ideale kozijnen</h1>
            <p className="text-gray-600">Kies eerst een categorie om te beginnen</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Kies uw categorie</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setSelectedCategory('ramen')}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center group"
              >
                <div className="text-gray-600 group-hover:text-blue-600 mb-4 flex justify-center">
                  <ImageIcon className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                  Ramen
                </h3>
                <p className="text-sm text-gray-600">Voor optimaal licht en ventilatie</p>
              </button>
              <button
                onClick={() => setSelectedCategory('buitendeuren')}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center group"
              >
                <div className="text-gray-600 group-hover:text-blue-600 mb-4 flex justify-center">
                  <Door className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                  Buitendeuren
                </h3>
                <p className="text-sm text-gray-600">Veilige en stijlvolle toegang</p>
              </button>
              <button
                onClick={() => setSelectedCategory('schuifsystemen')}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center group"
              >
                <div className="text-gray-600 group-hover:text-blue-600 mb-4 flex justify-center">
                  <ImageIcon className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                  Schuifsystemen
                </h3>
                <p className="text-sm text-gray-600">Moderne ruimtelijke oplossingen</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Model selectie carrousel
  if (!selectedModel) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => setSelectedCategory('')}
              className="text-blue-600 hover:underline flex items-center"
            >
              <ChevronLeft /> Terug naar categorieën
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Kies een model</h2>
          <div className="flex items-center justify-center gap-6 mb-6">
            <button onClick={prevModel} className="p-2 rounded-full hover:bg-blue-100">
              <ChevronLeft className="h-6 w-6" />
            </button>
            {availableModels.length > 0 && (
              <div className="flex flex-col items-center">
                <ImageWithFallback
                  src={availableModels[currentModelIndex].afbeelding}
                  alt={availableModels[currentModelIndex].naam}
                  className="h-48 w-auto object-contain rounded shadow"
                />
                <h3 className="mt-3 text-lg font-semibold">{availableModels[currentModelIndex].naam}</h3>
              </div>
            )}
            <button onClick={nextModel} className="p-2 rounded-full hover:bg-blue-100">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={selectCurrentModel}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            >
              <Check /> Kies dit model
            </button>
          </div>
        </div>
      </div>
    )
  }
  // Het formulier voor het gekozen model
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => setSelectedModel(null)}
            className="text-blue-600 hover:underline flex items-center"
          >
            <ChevronLeft /> Terug naar modellen
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {selectedModel?.naam || 'Model'}
        </h2>
        <div className="flex flex-col items-center mb-6">
          {selectedModel?.afbeelding && (
            <ImageWithFallback
              src={selectedModel.afbeelding}
              alt={selectedModel.naam}
              className="h-56 w-auto object-contain rounded shadow mb-4"
            />
          )}
        </div>
        <form
          className="space-y-6"
          onSubmit={e => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          {selectedModel.velden?.map((field: string) => (
            <div key={field}>{renderField(field)}</div>
          ))}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow transition
                ${isFormValid() && !loading ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : <Check />}
              Offerte aanvragen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Configurator