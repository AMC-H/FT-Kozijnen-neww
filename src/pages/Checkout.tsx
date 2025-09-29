import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CreditCard, Truck, MapPin, ArrowLeft, Package, Euro, Check } from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  specifications: {
    width: number
    height: number
    material: string
    color: string
  }
}

const Checkout: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup')
  const [paymentMethod, setPaymentMethod] = useState<'ideal' | 'card' | 'bancontact'>('ideal')
  const [loading, setLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    postalCode: '',
    city: ''
  })
  const [stockItems, setStockItems] = useState<any[]>([])

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

      setStockItems(data || [])
    } catch (error) {
      console.error('Error loading stock items:', error)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    loadCartItems()
  }, [user, navigate])

  // Separate effect for loading cart items when stock items are available
  useEffect(() => {
    if (user && stockItems.length > 0) {
      loadCartItems()
    }
  }, [user, stockItems])

  const loadCartItems = () => {
    if (!user) return

    const savedCart = localStorage.getItem(`cart_${user.id}`)
    console.log('🛒 Loading cart from localStorage:', savedCart)
    
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart)
        console.log('📦 Parsed cart:', cart)
        console.log('📊 Available stock items:', stockItems.length)
        
        if (stockItems.length > 0) {
          const items = Object.entries(cart).map(([itemId, quantity]) => {
            const stockItem = stockItems.find(item => item.id === itemId)
            console.log(`🔍 Looking for item ${itemId}:`, stockItem ? 'Found' : 'Not found')
            
            if (stockItem) {
              return {
                id: stockItem.id,
                name: stockItem.name,
                price: parseFloat(stockItem.price),
                quantity: quantity as number,
                image: stockItem.image_url,
                specifications: stockItem.specifications || {}
              } as CartItem
            }
            return null
          }).filter(Boolean) as CartItem[]
          
          console.log('✅ Final cart items:', items)
          setCartItems(items)
          
          if (items.length === 0 && Object.keys(cart).length > 0) {
            console.log('⚠️ Cart has items but no matching stock items found')
          } else if (items.length === 0) {
            console.log('🔄 Empty cart, redirecting to shop')
            navigate('/shop')
          }
        } else {
          console.log('⏳ Stock items not loaded yet, waiting...')
        }
      } catch (error) {
        console.error('❌ Error loading cart:', error)
        navigate('/shop')
      }
    } else {
      console.log('🔄 No saved cart found, redirecting to shop')
      navigate('/shop')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price)
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getDeliveryFee = () => {
    return deliveryMethod === 'delivery' ? 350 : 0
  }

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone']
    if (deliveryMethod === 'delivery') {
      requiredFields.push('address', 'postalCode', 'city')
    }

    const missingFields = requiredFields.filter(field => !customerInfo[field as keyof typeof customerInfo])
    
    if (missingFields.length > 0) {
      alert(`Vul alle verplichte velden in: ${missingFields.join(', ')}`)
      setLoading(false)
      return
    }

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear cart
      localStorage.removeItem(`cart_${user?.id}`)
      
      // Navigate to success page
      navigate('/order-success', {
        state: {
          orderNumber: `FT-${Date.now()}`,
          total: getTotal(),
          deliveryMethod,
          items: cartItems
        }
      })
    } catch (error) {
      console.error('Payment error:', error)
      alert('Er ging iets mis bij de betaling. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bestelling Afronden</h1>
            <p className="text-gray-600">Vul uw gegevens in en kies uw bezorgoptie</p>
          </div>
          <button
            onClick={() => navigate('/account')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Terug naar winkelwagen</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contactgegevens</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voornaam *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={customerInfo.firstName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Achternaam *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={customerInfo.lastName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefoon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bezorgoptie</h2>
              <div className="space-y-4">
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    deliveryMethod === 'pickup' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setDeliveryMethod('pickup')}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={deliveryMethod === 'pickup'}
                      onChange={() => setDeliveryMethod('pickup')}
                      className="text-primary-600"
                    />
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Ophalen bij FT-Kozijnen</h3>
                      <p className="text-sm text-gray-600">Industrieweg 17 Opslag 6, 4561 GH Hulst</p>
                      <p className="text-sm font-medium text-green-600">Gratis</p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    deliveryMethod === 'delivery' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setDeliveryMethod('delivery')}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="delivery"
                      value="delivery"
                      checked={deliveryMethod === 'delivery'}
                      onChange={() => setDeliveryMethod('delivery')}
                      className="text-primary-600"
                    />
                    <Truck className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Thuisbezorging</h3>
                      <p className="text-sm text-gray-600">Levering op het gewenste adres</p>
                      <p className="text-sm font-medium text-orange-600">€350,00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {deliveryMethod === 'delivery' && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium text-gray-900 mb-4">Bezorgadres</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adres *
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Straatnaam en huisnummer"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postcode *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          required
                          value={customerInfo.postalCode}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="1234 AB"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Woonplaats *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={customerInfo.city}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Amsterdam"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Betaalmethode</h2>
              <div className="space-y-3">
                <div 
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                    paymentMethod === 'ideal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('ideal')}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      value="ideal"
                      checked={paymentMethod === 'ideal'}
                      onChange={() => setPaymentMethod('ideal')}
                      className="text-primary-600"
                    />
                    <span className="font-medium">iDEAL</span>
                  </div>
                </div>

                <div 
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                    paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-primary-600"
                    />
                    <CreditCard className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">Creditcard</span>
                  </div>
                </div>

                <div 
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                    paymentMethod === 'bancontact' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('bancontact')}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      value="bancontact"
                      checked={paymentMethod === 'bancontact'}
                      onChange={() => setPaymentMethod('bancontact')}
                      className="text-primary-600"
                    />
                    <span className="font-medium">Bancontact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bestelling Overzicht</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-600">
                        {item.specifications.width} × {item.specifications.height} mm
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600">Aantal: {item.quantity}</span>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotaal:</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Bezorging:</span>
                  <span>{getDeliveryFee() === 0 ? 'Gratis' : formatPrice(getDeliveryFee())}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Totaal:</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <form onSubmit={handleSubmit} className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Verwerken...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Bestelling Plaatsen - {formatPrice(getTotal())}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>Door te bestellen gaat u akkoord met onze algemene voorwaarden</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout