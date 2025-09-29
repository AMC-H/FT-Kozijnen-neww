import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { FileText, Calendar, User, Settings, Trash2, Eye, Send, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Quote, WindowConfig } from '../types'
import PhotoViewer from '../components/PhotoViewer'

const Quotes: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [showKozijnAddedMessage, setShowKozijnAddedMessage] = useState(false)
  const [kozijnAddedData, setKozijnAddedData] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    // Check for success message from adding kozijn
    if (location.state?.success === 'kozijn-added') {
      setShowKozijnAddedMessage(true)
      setKozijnAddedData(location.state)
      window.history.replaceState({}, '', '/quotes')
      setTimeout(() => setShowKozijnAddedMessage(false), 6000)
    }
    
    fetchQuotes()
  }, [user, navigate])

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching quotes:', error)
      } else {
        setQuotes(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteQuote = async (quoteId: string) => {
    if (!confirm('Weet u zeker dat u deze offerte wilt verwijderen?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId)

      if (error) {
        console.error('Error deleting quote:', error)
        alert('Er ging iets mis bij het verwijderen van de offerte')
      } else {
        setQuotes(quotes.filter(quote => quote.id !== quoteId))
        if (selectedQuote?.id === quoteId) {
          setSelectedQuote(null)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Er ging iets mis bij het verwijderen van de offerte')
    }
  }

  const submitQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'submitted' })
        .eq('id', quoteId)

      if (error) {
        console.error('Error submitting quote:', error)
        alert('Er ging iets mis bij het versturen van de offerte')
      } else {
        setQuotes(quotes.map(quote => 
          quote.id === quoteId ? { ...quote, status: 'ingediend' } : quote
        ))
        alert('Offerte succesvol verstuurd naar FT-Kozijnen!')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Er ging iets mis bij het versturen van de offerte')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concept':
        return 'bg-gray-100 text-gray-800'
      case 'submitted':
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
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Offertes laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Kozijn Added Success Message */}
        {showKozijnAddedMessage && kozijnAddedData && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800">
                  ✅ Kozijn Succesvol Toegevoegd!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Het kozijn "{kozijnAddedData.kozijnModel}" ({kozijnAddedData.kozijnCategorie}) is toegevoegd aan uw concept offerte.
                  </p>
                  <div className="mt-3 bg-green-100 rounded p-3">
                    <h4 className="font-medium text-green-900 mb-2">Wat kunt u nu doen?</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Voeg meer kozijnen toe aan uw offerte</li>
                      <li>• Bekijk en bewerk uw huidige kozijnen</li>
                      <li>• Dien uw complete offerte in wanneer u klaar bent</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setShowKozijnAddedMessage(false)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    Sluiten
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mijn Offertes</h1>
            <p className="text-gray-600">Beheer en bekijk uw kozijnoffertes</p>
          </div>
          <button
            onClick={() => navigate('/configurator')}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Kozijn toevoegen</span>
          </button>
        </div>

        {quotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Geen offertes gevonden</h3>
            <p className="text-gray-600 mb-4">U heeft nog geen offertes aangemaakt.</p>
            <button
              onClick={() => navigate('/configurator')}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Eerste kozijn toevoegen</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quotes List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Offerte Overzicht</h2>
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all ${
                    selectedQuote?.id === quote.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedQuote(quote)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Offerte #{quote.id.slice(0, 8)}
                        {Array.isArray(quote.items) && quote.items.length > 1 && (
                          <span className="text-sm font-normal text-gray-600 ml-2">
                            ({quote.items.length} kozijnen)
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(quote.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Settings className="h-4 w-4" />
                          <span>{Array.isArray(quote.items) ? quote.items.length : 1} items</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {getStatusText(quote.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <p>
                        {Array.isArray(quote.items) && quote.items.length > 0 ? (
                          <>
                            Eerste kozijn: {quote.items[0]?.model || 'Onbekend model'}
                            {quote.items.length > 1 && (
                              <span className="text-gray-500"> + {quote.items.length - 1} meer</span>
                            )}
                          </>
                        ) : (
                          'Klik om details te bekijken'
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {quote.status === 'concept' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate('/account')
                          }}
                          className="text-primary-600 hover:text-primary-800"
                          title="Ga naar account om offerte in te dienen"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteQuote(quote.id)
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Verwijder offerte"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote Details */}
            <div className="sticky top-8">
              {selectedQuote ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Offerte Details
                      </h3>
                      <p className="text-gray-600">#{selectedQuote.id.slice(0, 8)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedQuote.status)}`}>
                      {getStatusText(selectedQuote.status)}
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Aangemaakt op:</p>
                        <p className="font-medium">{formatDate(selectedQuote.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Laatst gewijzigd:</p>
                        <p className="font-medium">{formatDate(selectedQuote.updated_at)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Kozijn Configuratie ({Array.isArray(selectedQuote.items) ? selectedQuote.items.length : 1} items)
                    </h4>
                    <div className="space-y-4">
                      {(Array.isArray(selectedQuote.items) ? selectedQuote.items : [selectedQuote.items]).map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-gray-900">
                              {item.model || 'Kozijn'}
                            </h5>
                            <span className="text-sm text-gray-500">
                              {item.formulier?.breedte && item.formulier?.hoogte ? 
                                `${item.formulier.breedte} × ${item.formulier.hoogte} mm` : 
                                'Afmetingen niet opgegeven'
                              }
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">Categorie:</span> {item.categorie || 'Niet opgegeven'}</p>
                            {item.formulier?.materiaal && (
                              <p><span className="font-medium">Materiaal:</span> {item.formulier.materiaal}</p>
                            )}
                            {item.formulier?.kleurBinnen && (
                              <p><span className="font-medium">Kleur binnen:</span> {item.formulier.kleurBinnen}</p>
                            )}
                            {item.formulier?.kleurBuiten && (
                              <p><span className="font-medium">Kleur buiten:</span> {item.formulier.kleurBuiten}</p>
                            )}
                            {item.formulier?.kleurBewegendeDelen && (
                              <p><span className="font-medium">Kleur bewegende delen:</span> {item.formulier.kleurBewegendeDelen}</p>
                            )}
                            {item.formulier?.glasoptie && (
                              <p><span className="font-medium">Glasoptie:</span> {item.formulier.glasoptie}</p>
                            )}
                            {item.formulier?.hor && (
                              <p><span className="font-medium">Hor (insectenscreen):</span> {item.formulier.hor === 'ja' ? 'Ja, gewenst' : 'Nee, niet gewenst'}</p>
                            )}
                            {item.formulier?.draairichting && (
                              <p><span className="font-medium">Draairichting:</span> {item.formulier.draairichting}</p>
                            )}
                            {item.formulier?.dorpel && (
                              <p><span className="font-medium">Dorpel:</span> {item.formulier.dorpel}</p>
                            )}
                            {item.formulier?.hangEnSluitwerk && (
                              <p><span className="font-medium">Hang- en sluitwerk:</span> {item.formulier.hangEnSluitwerk}</p>
                            )}
                            {item.formulier?.aanslag && (
                              <p><span className="font-medium">Aanslag:</span> {item.formulier.aanslag === 'ja' ? 'Ja' : 'Nee'}</p>
                            )}
                            {item.formulier?.profielKeuze && (
                              <p><span className="font-medium">Profiel keuze:</span> {item.formulier.profielKeuze === 'ideal-7000' ? 'Ideal 7000' : 'Ideal 8000'}</p>
                            )}
                            {item.formulier?.opmerkingen && (
                              <p><span className="font-medium">Opmerkingen:</span> {item.formulier.opmerkingen}</p>
                            )}
                            {item.formulier?.photoIds && item.formulier.photoIds.length > 0 && (
                              <div className="mt-3">
                                <p className="font-medium text-gray-900 mb-2">Foto's:</p>
                                <PhotoViewer photoIds={item.formulier.photoIds} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecteer een offerte
                  </h3>
                  <p className="text-gray-600">
                    Klik op een offerte om de details te bekijken
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quotes