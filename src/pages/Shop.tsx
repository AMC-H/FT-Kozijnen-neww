import React, { useState, useEffect } from 'react'
import { ShoppingCart, Eye, Filter, Search, Package, Star, Euro } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface StockItem {
  id: string
  name: string
  category: 'ramen' | 'deuren' | 'schuifsystemen'
  price: number
  originalPrice?: number
  stock: number
  image: string
  description: string
  specifications: {
    width: number
    height: number
    material: string
    color: string
    glassType: string
  }
  rating: number
  reviews: number
  discount?: number
}

const Shop: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'rating'>('name')
  const [cart, setCart] = useState<{[key: string]: number}>({})
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load cart from localStorage on component mount
  useEffect(() => {
    if (user?.id) {
      const savedCart = localStorage.getItem(`cart_${user.id}`)
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setCart(parsedCart)
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error)
        }
      }
    }
  }, [user?.id])

  // Load stock items from Supabase
  useEffect(() => {
    fetchStockItems()
  }, [])

  const fetchStockItems = async () => {
    try {
      setLoading(true)
      console.log('🔍 DEBUGGING: Fetching stock items from Supabase...')
      const { data, error } = await supabase
        .from('stock_items')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) {
        console.error('❌ ERROR fetching stock items:', error)
        console.error('Error details:', error.details, error.hint, error.message)
        return
      }

      console.log('📦 RAW DATA from Supabase:', data)
      console.log('📊 Number of items fetched:', data?.length || 0)
      
      // SPECIFIC DEBUG: Look for garage door
      const garageDoor = data?.find(item => 
        item.name?.toLowerCase().includes('garage') || 
        item.category === 'deuren'
      )
      console.log('🚪 GARAGE DOOR FOUND:', garageDoor)
      
      // DEBUG: Show all categories
      const categories = [...new Set(data?.map(item => item.category) || [])]
      console.log('📂 ALL CATEGORIES in database:', categories)
      
      // Transform database data to match interface
      const transformedItems: StockItem[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category as 'ramen' | 'deuren' | 'schuifsystemen',
        price: parseFloat(item.price),
        originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
        stock: item.stock_quantity,
        image: item.image_url,
        description: item.description,
        specifications: item.specifications || {},
        rating: parseFloat(item.rating || '0'),
        reviews: item.review_count || 0,
        discount: item.discount_percentage || undefined
      }))

      setStockItems(transformedItems)
    } catch (error) {
      console.error('Error loading stock items:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = stockItems
    .filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        case 'rating':
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const addToCart = (itemId: string) => {
    if (!user?.id) {
      navigate('/login')
      return
    }

    const newCart = {
      ...cart,
      [itemId]: (cart[itemId] || 0) + 1
    }
    
    setCart(newCart)
    
    // Save to localStorage
    try {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart))
      console.log('🛒 Cart saved to localStorage:', newCart)
      console.log('🔑 Storage key:', `cart_${user.id}`)
      console.log('📦 Added item ID:', itemId)
      const item = stockItems.find(item => item.id === itemId)
      if (item) {
        // Show a more user-friendly notification
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300'
        notification.innerHTML = `
          <div class="flex items-center space-x-2">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${item.name} toegevoegd aan winkelwagen!</span>
          </div>
        `
        document.body.appendChild(notification)
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          notification.style.opacity = '0'
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification)
            }
          }, 300)
        }, 3000)
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
      alert('Er ging iets mis bij het toevoegen aan de winkelwagen')
    }
  }

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'ramen': return 'Ramen'
      case 'deuren': return 'Deuren'
      case 'schuifsystemen': return 'Schuifsystemen'
      default: return 'Alle categorieën'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Voorraad laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Voorraad Kozijnen</h1>
            <p className="text-gray-600">Direct leverbare kozijnen uit onze voorraad</p>
          </div>
          {user && getTotalCartItems() > 0 && (
            <button
              onClick={() => navigate('/account')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{getTotalCartItems()} item(s) in winkelwagen</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek kozijnen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Alle categorieën</option>
              <option value="ramen">Ramen</option>
              <option value="deuren">Deuren</option>
              <option value="schuifsystemen">Schuifsystemen</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'name' | 'rating')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="name">Sorteer op naam</option>
              <option value="price">Sorteer op prijs</option>
              <option value="rating">Sorteer op beoordeling</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredItems.length} kozijn{filteredItems.length !== 1 ? 'en' : ''} gevonden
            {selectedCategory !== 'all' && ` in categorie "${getCategoryName(selectedCategory)}"`}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer group"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement
                      target.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {item.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    -{item.discount}%
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold flex items-center space-x-1">
                  <Package className="h-3 w-3" />
                  <span>{item.stock} op voorraad</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-primary-600 font-medium uppercase tracking-wide group-hover:text-primary-800 transition-colors">
                    {getCategoryName(item.category)}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {item.rating} ({item.reviews} reviews)
                  </span>
                </div>

                {/* Specifications */}
                <div className="text-xs text-gray-500 mb-3">
                  <p>{item.specifications.width} × {item.specifications.height} mm</p>
                  <p>{item.specifications.material} • {item.specifications.color}</p>
                  <p>{item.specifications.glassType}</p>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => { // Combine both onClick handlers
                      e.stopPropagation() // Stop event propagation for the first handler
                      // The second onClick handler's logic
                      // This is the original logic from the second onClick
                      navigate(`/product/${item.id}`)
                    }}
                    className="flex-1 bg-gray-100 hover:bg-primary-100 text-gray-800 hover:text-primary-800 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Bekijk</span>
                  </button>
                  
                  {user ? (
                    <button // Combine both onClick handlers
                      onClick={(e) => {
                        e.stopPropagation() // Stop event propagation for the first handler
                        addToCart(item.id)
                      }}
                      disabled={item.stock === 0}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-1"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>{item.stock === 0 ? 'Uitverkocht' : 'Toevoegen'}</span>
                    </button>
                  ) : (
                    <button // Combine both onClick handlers
                      onClick={(e) => {
                        e.stopPropagation() // Stop event propagation for the first handler
                        navigate('/login')
                      }}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Inloggen</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Geen kozijnen gevonden</h3>
            <p className="text-gray-600 mb-4">
              Probeer uw zoekopdracht aan te passen of kies een andere categorie.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-primary-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">ℹ️ Voorraad Informatie</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-primary-800">
            <div>
              <h4 className="font-medium mb-2">🚚 Levering</h4>
              <ul className="space-y-1">
                <li>• Voorraad items: 1-3 werkdagen</li>
                <li>• Gratis levering vanaf €500</li>
                <li>• Professionele installatie mogelijk</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">✅ Service</h4>
              <ul className="space-y-1">
                <li>• Kwaliteitsgarantie op alle producten</li>
                <li>• Vakkundige montage</li>
                <li>• Persoonlijk advies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop