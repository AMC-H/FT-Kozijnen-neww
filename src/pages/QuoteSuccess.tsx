import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Home, FileText } from 'lucide-react'

const QuoteSuccess: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { submittedCount = 1, customerName = 'Klant' } = location.state || {}

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Offerte Succesvol Ingediend!
            </h1>
            <p className="text-gray-600">
              Bedankt {customerName}, uw {submittedCount} offerte{submittedCount !== 1 ? 's zijn' : ' is'} succesvol ingediend.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-green-900 mb-2">Wat gebeurt er nu?</h3>
            <ul className="text-sm text-green-800 text-left space-y-1">
              <li>• Uw offerte wordt binnen 24 uur beoordeeld</li>
              <li>• U ontvangt een bevestiging per email</li>
              <li>• Een specialist neemt contact met u op</li>
              <li>• U krijgt een gedetailleerde prijsopgave</li>
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
              onClick={() => navigate('/quotes')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <FileText className="h-5 w-5" />
              <span>Bekijk Alle Offertes</span>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t text-sm text-gray-500">
            <p>
              Heeft u vragen? Neem contact op via{' '}
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

export default QuoteSuccess