import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Package, Truck, MapPin, Home, ShoppingCart } from 'lucide-react'

const OrderSuccess: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { orderNumber, total, deliveryMethod, items } = location.state || {}

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price)
  }

  if (!orderNumber) {
    navigate('/shop')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bestelling Geplaatst! 🎉
            </h1>
            <p className="text-gray-600">
              Bedankt voor uw bestelling bij FT-Kozijnen
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Bestelling Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Bestelnummer:</strong> {orderNumber}</p>
              <p><strong>Totaalbedrag:</strong> {formatPrice(total)}</p>
              <p><strong>Aantal items:</strong> {items?.length || 0}</p>
              <p><strong>Bezorgmethode:</strong> {deliveryMethod === 'pickup' ? 'Ophalen' : 'Thuisbezorging'}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              {deliveryMethod === 'pickup' ? (
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              ) : (
                <Truck className="h-5 w-5 text-blue-600 mr-2" />
              )}
              <h3 className="font-medium text-blue-900">Wat gebeurt er nu?</h3>
            </div>
            <ul className="text-sm text-blue-800 text-left space-y-1">
              <li>• U ontvangt een bevestiging per email</li>
              <li>• Wij bereiden uw bestelling voor</li>
              {deliveryMethod === 'pickup' ? (
                <>
                  <li>• U krijgt bericht wanneer uw bestelling klaar is</li>
                  <li>• Ophalen bij: Industrieweg 17 Opslag 6, Hulst</li>
                </>
              ) : (
                <>
                  <li>• Wij plannen de bezorging in</li>
                  <li>• U krijgt een track & trace code</li>
                </>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/account')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Terug naar Account</span>
            </button>
            
            <button
              onClick={() => navigate('/shop')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Verder Winkelen</span>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t text-sm text-gray-500">
            <p>
              Vragen over uw bestelling?{' '}
              <a href="tel:+31639430243" className="text-primary-600 hover:underline">
                +31 639 430 243
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess