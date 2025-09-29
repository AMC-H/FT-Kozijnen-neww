export interface WindowConfig {
  id: string
  category?: 'ramen' | 'deuren' | 'schuifsystemen'
  type: string
  modelName?: string
  modelImageUrl?: string
  dimensions: {
    width: number
    height: number
  }
  glassOption: 'hr++' | 'triple' | 'mat'
  colorInside: string
  colorOutside: string
  notes?: string
  photos?: string[]
}

export interface Quote {
  id: string
  user_id: string
  items: WindowConfig[]
  status: 'concept' | 'submitted' | 'reviewed' | 'approved'
  customer_details?: CustomerDetails
  created_at: string
  updated_at: string
}

export interface CustomerDetails {
  full_name: string
  address: string
  postal_code: string
  city: string
  phone: string
  email: string
}

export interface Profile {
  id: string
  full_name?: string
  address?: string
  postal_code?: string
  city?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  company?: string
  phone?: string
}
