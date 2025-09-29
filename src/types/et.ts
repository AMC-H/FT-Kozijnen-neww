export type EtPaneel = {
  slug: string
  naam: string
  min_breedte: number
  min_hoogte: number
  max_breedte: number
  max_hoogte: number
  beglazing_toegestaan: boolean
  duo_kleur: boolean
  omkadering_rule: string | null
  opmerking: string | null
}
