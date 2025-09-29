import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { BarChart3, FileText, User, Settings, Calendar, TrendingUp, Home, Package, Plus, Edit3, Send, ShoppingCart, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface StockItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  specifications: {
    width: number
    height: number
    material: string
    color: string
  }
}

const Account: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalKozijnen: 0,
    draftKozijnen: 0,
    submittedKozijnen: 0,
    approvedKozijnen: 0,
    totalItems: 0
  })
  const [recentKozijnen, setRecentKozijnen] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<{[key: string]: number}>({})
  const [cartItems, setCartItems] = useState<any[]>([])
  const [stockItems, setStockItems] = useState<StockItem[]>([])

  // Load stock items from Supabase
  useEffect(() => {
    fetchStockItems()
  }, [])

  const fetchStockItems = async () => {
    try {
      const { data, error } = await supabase
        .from('stock_items')
        .select('*')
        .eq('is_active', true)

      if (error) {
        console.error('Error fetching stock items:', error)
        return
      }

      // Transform database data to match interface
      const transformedItems: StockItem[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
        image: item.image_url,
        specifications: item.specifications || {}
      }))

      setStockItems(transformedItems)
    } catch (error) {
      console.error('Error loading stock items:', error)
    }
  }

  // Load cart from localStorage
  useEffect(() => {
    if (user?.id) {
      const savedCart = localStorage.getItem(`cart_${user.id}`)
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setCart(parsedCart)
          
          // Convert cart to items with details
          if (stockItems.length > 0) {
            const items = Object.entries(parsedCart).map(([itemId, quantity]) => {
              const stockItem = stockItems.find(item => item.id === itemId)
              return stockItem ? { ...stockItem, quantity } : null
            }).filter(Boolean)
            
            setCartItems(items)
          }
          console.log('Cart loaded from localStorage:', parsedCart)
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error)
        }
      }
    }
  }, [user?.id, stockItems])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    fetchAccountData()
  }, [user, navigate])

  const handleSendAllKozijnen = async () => {
    if (!confirm(`Weet u zeker dat u alle ${stats.totalKozijnen} kozijn${stats.totalKozijnen !== 1 ? 'en' : ''} wilt versturen naar FT-Kozijnen?`)) {
      return
    }

    try {
      // Get all draft kozijnen
      const { data: draftKozijnen, error: fetchError } = await supabase
        .from('quotes')
        .select('id')
        .eq('user_id', user?.id)
        .eq('status', 'concept')

      if (fetchError) {
        console.error('Error fetching draft kozijnen:', fetchError)
        alert('Er ging iets mis bij het ophalen van de kozijnen')
        return
      }

      if (!draftKozijnen || draftKozijnen.length === 0) {
        alert('Er zijn geen concept kozijnen om te versturen')
        return
      }

      // Update all draft kozijnen to submitted
      const { error: updateError } = await supabase
        .from('quotes')
        .update({ status: 'submitted' })
        .eq('user_id', user?.id)
        .eq('status', 'concept')

      if (updateError) {
        console.error('Error updating kozijnen:', updateError)
        alert('Er ging iets mis bij het versturen van de kozijnen')
      } else {
        alert(`Alle ${draftKozijnen.length} kozijn${draftKozijnen.length !== 1 ? 'en' : ''} zijn succesvol verstuurd naar FT-Kozijnen!`)
        // Refresh dashboard data
        fetchAccountData()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Er ging iets mis bij het versturen van de kozijnen')
    }
  }

  const removeFromCart = (itemId: string) => {
    if (!user?.id) return
    
    const newCart = { ...cart }
    delete newCart[itemId]
    setCart(newCart)
    
    try {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart))
      console.log('Item removed from cart:', itemId)
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
    
    // Update cart items
    const items = Object.entries(newCart).map(([id, quantity]) => {
      const stockItem = stockItems.find(item => item.id === id)
      return stockItem ? { ...stockItem, quantity } : null
    }).filter(Boolean)
    
    setCartItems(items)
  }

  const getTotalCartValue = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price)
  }

  const fetchAccountData = async () => {
    try {
      if (!user?.id) {
        console.error('No user ID available')
        return
      }

      const { data: kozijnen, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching account data:', error)
      } else {
        const kozijnenData = kozijnen || []
        
        // Calculate stats
        const totalKozijnen = kozijnenData.length
        const draftKozijnen = kozijnenData.filter(k => k.status === 'concept').length
        const submittedKozijnen = kozijnenData.filter(k => k.status === 'submitted').length
        const approvedKozijnen = kozijnenData.filter(k => k.status === 'approved').length
        const totalItems = kozijnenData.reduce((sum, kozijn) => {
          if (Array.isArray(kozijn.items)) {
            return sum + kozijn.items.length
          }
          return sum + 1 // Single item if not array
        }, 0)

        setStats({
          totalKozijnen,
          draftKozijnen,
          submittedKozijnen,
          approvedKozijnen,
          totalItems
        })

        // Get recent kozijnen (last 5)
        setRecentKozijnen(kozijnenData.slice(0, 5))
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'ingediend':
        return 'bg-blue-100 text-blue-800'
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concept':
        return 'Concept'
      case 'submitted':
        return 'Verstuurd'
      case 'reviewed':
        return 'In behandeling'
      case 'approved':
        return 'Goedgekeurd'
      default:
        return 'Onbekend'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Dashboard laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mijn Account</h1>
          <p className="text-gray-600">Welkom terug, {user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Aantal Kozijnen</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Settings className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Concepten</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draftKozijnen}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verstuurd</p>
                <p className="text-2xl font-bold text-gray-900">{stats.submittedKozijnen}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Kozijnen */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recente Kozijnen</h2>
              <button
                onClick={() => navigate('/quotes')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Alle kozijnen →
              </button>
            </div>

            {recentKozijnen.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nog geen offertes aangemaakt</p>
                <button
                  onClick={() => navigate('/configurator')}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Eerste offerte maken
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentKozijnen.map((kozijn) => (
                  <div key={kozijn.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Offerte #{kozijn.id.slice(0, 8)}
                          {Array.isArray(kozijn.items) && kozijn.items.length > 1 && (
                            <span className="text-sm font-normal text-gray-600 ml-2">
                              ({kozijn.items.length} kozijnen)
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {Array.isArray(kozijn.items) && kozijn.items.length > 0 ? (
                            <>
                              {kozijn.items[0]?.categorie || 'Onbekend'} • {formatDate(kozijn.created_at)}
                              {kozijn.items.length > 1 && (
                                <span className="text-gray-400"> + {kozijn.items.length - 1} meer</span>
                              )}
                            </>
                          ) : (
                            formatDate(kozijn.created_at)
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(kozijn.status)}`}>
                        {getStatusText(kozijn.status)}
                      </span>
                      <button
                        onClick={() => navigate('/quotes')}
                        className="text-primary-600 hover:text-primary-800 text-sm"
                      >
                        Bekijk offertes →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shopping Cart */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Winkelwagen</span>
              </h2>
              <button
                onClick={() => navigate('/shop')}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                Naar winkel →
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Uw winkelwagen is leeg</p>
                <button
                  onClick={() => navigate('/shop')}
                 className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Bekijk voorraad
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.specifications.width} × {item.specifications.height} mm
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-gray-900">
                          {formatPrice(item.price)} × {item.quantity}
                        </span>
                        <span className="font-bold text-primary-600">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Verwijder uit winkelwagen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">Totaal:</span>
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(getTotalCartValue())}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Bestelling Plaatsen
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Gratis levering vanaf €500
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Snelle Acties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/configurator')}
               className="bg-primary-600 text-white p-4 rounded-lg hover:bg-primary-700 transition-colors flex flex-col items-center space-y-2 transform hover:scale-105 duration-200"
              >
                <Plus className="h-8 w-8" />
                <div className="text-center">
                  <p className="font-medium">Kozijn Toevoegen</p>
                  <p className="text-xs opacity-90">Configureer maatwerk</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/quotes')}
               className="bg-primary-100 text-primary-900 p-4 rounded-lg hover:bg-primary-200 transition-colors flex flex-col items-center space-y-2 transform hover:scale-105 duration-200"
              >
                <Edit3 className="h-8 w-8" />
                <div className="text-center">
                  <p className="font-medium">Mijn Offertes</p>
                  <p className="text-xs text-green-700">Beheer offertes</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/shop')}
               className="bg-primary-100 text-primary-900 p-4 rounded-lg hover:bg-primary-200 transition-colors flex flex-col items-center space-y-2 transform hover:scale-105 duration-200"
              >
                <ShoppingCart className="h-8 w-8" />
                <div className="text-center">
                  <p className="font-medium">Voorraad Shop</p>
                  <p className="text-xs text-purple-700">Direct leverbaar</p>
                </div>
              </button>

              {stats.totalKozijnen > 0 && (
                <button
                  onClick={() => navigate('/finalize-quote')}
                  className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors flex flex-col items-center space-y-2 transform hover:scale-105 duration-200 ring-2 ring-orange-300 shadow-lg"
                >
                  <Send className="h-8 w-8" />
                  <div className="text-center">
                    <p className="font-bold">🎯 Offerte Indienen</p>
                    <p className="text-xs text-orange-100">{stats.draftKozijnen} offerte{stats.draftKozijnen !== 1 ? 's' : ''} indienen</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        {stats.totalKozijnen > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Offerte Status Overzicht</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-yellow-600">
                    {Math.round((stats.draftKozijnen / stats.totalKozijnen) * 100)}%
                  </span>
                </div>
                <p className="font-medium text-gray-900">Concepten</p>
                <p className="text-sm text-gray-600">{stats.draftKozijnen} van {stats.totalKozijnen}</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.round((stats.submittedKozijnen / stats.totalKozijnen) * 100)}%
                  </span>
                </div>
                <p className="font-medium text-gray-900">Verstuurd</p>
                <p className="text-sm text-gray-600">{stats.submittedKozijnen} van {stats.totalKozijnen}</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">
                    {Math.round((stats.approvedKozijnen / stats.totalKozijnen) * 100)}%
                  </span>
                </div>
                <p className="font-medium text-gray-900">Goedgekeurd</p>
                <p className="text-sm text-gray-600">{stats.approvedKozijnen} van {stats.totalKozijnen}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Account