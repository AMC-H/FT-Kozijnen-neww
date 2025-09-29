import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Star, Package, Shield, Truck, Check, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface ProductDetail {
  id: string
  name: string
  category: 'ramen' | 'deuren' | 'schuifsystemen'
  price: number
  original_price?: number
  stock_quantity: number
  image_url: string
  description: string
  specifications: {
    width: number
    height: number
    material: string
    color: string
    glass_type: string
    u_value: string
    security: string
    ventilation: string
    sealing: string
    lock: string
    handles: string
    certification: string
  }
  rating: number
  review_count: number
  discount_percentage?: number
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState<{[key: string]: number}>({})

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  useEffect(() => {
    if (user?.id) {
      const savedCart = localStorage.getItem(`cart_${user.id}`)
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart))
        } catch (error) {
          console.error('Error loading cart:', error)
        }
      }
    }
  }, [user?.id])

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('stock_items')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        return
      }

      if (data) {
        const transformedProduct: ProductDetail = {
          id: data.id,
          name: data.name,
          category: data.category,
          price: parseFloat(data.price),
          original_price: data.original_price ? parseFloat(data.original_price) : undefined,
          stock_quantity: data.stock_quantity,
          image_url: data.image_url,
          description: data.description,
          specifications: {
            ...data.specifications,
            glass_type: data.specifications?.glass_type || 'HR++ glas (argon, 24 mm 4-16-4)'
          },
          rating: parseFloat(data.rating || '0'),
          review_count: data.review_count || 0,
          discount_percentage: data.discount_percentage || undefined
        }
        setProduct(transformedProduct)
      }
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = () => {
    if (!user?.id) {
      navigate('/login')
      return
    }

    if (!product) return

    const newCart = {
      ...cart,
      [product.id]: (cart[product.id] || 0) + quantity
    }
    
    setCart(newCart)
    
    try {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart))
      alert(`${quantity}x ${product.name} toegevoegd aan winkelwagen!`)
    } catch (error) {
      console.error('Error saving cart:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price)
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'ramen': return 'Ramen'
      case 'deuren': return 'Deuren'
      case 'schuifsystemen': return 'Schuifsystemen'
      default: return category
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Product laden...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product niet gevonden</h1>
          <button
            onClick={() => navigate('/shop')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Terug naar shop
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Terug naar shop</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
              {product.discount_percentage && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  -{product.discount_percentage}%
                </div>
              )}
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10 flex items-center space-x-1">
                <Package className="h-4 w-4" />
                <span>{product.stock_quantity} op voorraad</span>
              </div>
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                {getCategoryName(product.category)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.review_count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
              {product.discount_percentage && (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  Bespaar {formatPrice(product.original_price! - product.price)}
                </span>
              )}
            </div>

            {/* Key Specifications */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Belangrijkste specificaties</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Afmetingen:</span>
                  <span className="ml-2 font-medium">{Math.round(product.specifications.width / 10)} × {Math.round(product.specifications.height / 10)} cm</span>
                </div>
                <div>
                  <span className="text-gray-600">Materiaal:</span>
                  <span className="ml-2 font-medium">{product.specifications.material}</span>
                </div>
                <div>
                  <span className="text-gray-600">Kleur:</span>
                  <span className="ml-2 font-medium">{product.specifications.color}</span>
                </div>
                <div>
                  <span className="text-gray-600">Glas:</span>
                  <span className="ml-2 font-medium">{product.specifications.glass_type || 'HR++ glas (argon, 24 mm 4-16-4)'}</span>
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Aantal:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[...Array(Math.min(10, product.stock_quantity))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                {user ? (
                  <button
                    onClick={addToCart}
                    disabled={product.stock_quantity === 0}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 font-semibold"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>{product.stock_quantity === 0 ? 'Uitverkocht' : 'Toevoegen aan winkelwagen'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 font-semibold"
                  >
                    <span>Inloggen om te bestellen</span>
                  </button>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Kwaliteitsgarantie</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="h-5 w-5 text-primary-600" />
                <span>Gratis levering vanaf €500</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Check className="h-5 w-5 text-green-600" />
                <span>Professionele montage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description & Specifications */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Productbeschrijving</h2>
            <div className="prose prose-gray max-w-none">
              <div className="text-gray-700 leading-relaxed">
                {product.description.split(';').map((spec, index) => (
                  <div key={index} className="mb-2">
                    {spec.trim()}
                    {index < product.description.split(';').length - 1 && spec.trim() && ';'}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Technische specificaties</h2>
            <div className="space-y-4">
              {Object.entries(product.specifications).map(([key, value]) => {
                if (!value) return null
                
                const labels: Record<string, string> = {
                  width: 'Breedte',
                  height: 'Hoogte',
                  material: 'Materiaal',
                  color: 'Kleur',
                  glass_type: 'Glas',
                  u_value: 'U-waarde',
                  security: 'Beveiliging',
                  ventilation: 'Ventilatie',
                  sealing: 'Afdichting',
                  lock: 'Slot',
                  handles: 'Handgrepen',
                  certification: 'Certificering'
                }
                
                return (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-900">
                      {labels[key] || key}:
                    </span>
                    <span className="text-gray-700">
                      {key === 'width' || key === 'height' ? `${Math.round(value / 10)} cm` : 
                       key === 'glass_type' && !value ? 'HR++ glas (argon, 24 mm 4-16-4)' : 
                       String(value)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-primary-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-primary-900 mb-4">Vragen over dit product?</h3>
          <p className="text-primary-800 mb-6">
            Onze specialisten helpen u graag bij het maken van de juiste keuze.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+31639430243"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Bel ons: +31 639 430 243
            </a>
            <a
              href="mailto:info@ftkozijnen.nl"
              className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
            >
              Email ons
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail