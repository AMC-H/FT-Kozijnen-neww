import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const Debug: React.FC = () => {
  const { user } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runDebugTests = async () => {
      const info: any = {
        timestamp: new Date().toISOString(),
        environment: {
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://iyqxhhwwljdbkpzuyvei.supabase.co (fallback)',
          hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
          anonKeyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0,
          expectedUrl: 'https://nsmzfzdvesacindbgkdq.supabase.co',
          urlMatches: import.meta.env.VITE_SUPABASE_URL === 'https://nsmzfzdvesacindbgkdq.supabase.co'
        },
        user: user ? {
          id: user.id,
          email: user.email
        } : null
      }

      // Test 1: Basic Supabase connection
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database connection timeout after 15 seconds')), 15000)
        )
        
        const dbPromise = supabase.from('quotes').select('count', { count: 'exact', head: true })
        
        const { data, error } = await Promise.race([dbPromise, timeoutPromise]) as any
        
        info.databaseConnection = {
          success: !error,
          error: error?.message,
          count: data,
          isNetworkError: error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')
        }
      } catch (error) {
        info.databaseConnection = {
          success: false,
          error: String(error),
          isNetworkError: error instanceof Error && (error.message?.includes('Failed to fetch') || error.message?.includes('timeout'))
        }
      }

      // Test 2: Storage access
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Storage connection timeout after 15 seconds')), 15000)
        )
        
        const storagePromise = supabase.storage.listBuckets()
        
        const { data: buckets, error } = await Promise.race([storagePromise, timeoutPromise]) as any
        info.storageAccess = {
          success: !error,
          error: error?.message,
          buckets: buckets?.map(b => ({
            name: b.name,
            id: b.id,
            public: b.public,
            created_at: b.created_at
          })) || []
        }
      } catch (error) {
        info.storageAccess = {
          success: false,
          error: String(error),
          buckets: []
        }
      }

      // Test 3: Check if kozijnen-photos bucket exists
      if (info.storageAccess.success) {
        const kozijnBucket = info.storageAccess.buckets.find((b: any) => b.name === 'kozijnen-photos')
        info.kozijnBucket = {
          exists: !!kozijnBucket,
          details: kozijnBucket || null
        }

        // Test 4: Try to list files in bucket (if it exists)
        if (kozijnBucket) {
          try {
            const { data: files, error } = await supabase.storage
              .from('kozijnen-photos')
              .list('', { limit: 1 })
            
            info.bucketAccess = {
              success: !error,
              error: error?.message,
              canList: !error
            }
          } catch (error) {
            info.bucketAccess = {
              success: false,
              error: String(error),
              canList: false
            }
          }
        }
      }

      setDebugInfo(info)
      setLoading(false)
    }

    runDebugTests()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Debug tests uitvoeren...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Supabase Debug Informatie</h1>
          
          <div className="space-y-6">
            {/* Environment */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Environment</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(debugInfo.environment, null, 2)}
                </pre>
              </div>
            </div>

            {/* Database Connection */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Database Verbinding 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  debugInfo.databaseConnection?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {debugInfo.databaseConnection?.success ? 'OK' : 'FOUT'}
                </span>
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(debugInfo.databaseConnection, null, 2)}
                </pre>
              </div>
            </div>

            {/* Storage Access */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Storage Toegang 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  debugInfo.storageAccess?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {debugInfo.storageAccess?.success ? 'OK' : 'FOUT'}
                </span>
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(debugInfo.storageAccess, null, 2)}
                </pre>
              </div>
            </div>

            {/* Kozijn Bucket */}
            {debugInfo.kozijnBucket && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Kozijnen-Photos Bucket 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    debugInfo.kozijnBucket?.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {debugInfo.kozijnBucket?.exists ? 'GEVONDEN' : 'NIET GEVONDEN'}
                  </span>
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(debugInfo.kozijnBucket, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Bucket Access */}
            {debugInfo.bucketAccess && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Bucket Toegang 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    debugInfo.bucketAccess?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {debugInfo.bucketAccess?.success ? 'OK' : 'FOUT'}
                  </span>
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(debugInfo.bucketAccess, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Aanbevelingen</h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <ul className="text-sm text-blue-800 space-y-2">
                  {!debugInfo.environment?.urlMatches && (
                    <li>❌ VITE_SUPABASE_URL komt niet overeen met verwachte URL</li>
                  )}
                  {!debugInfo.environment?.hasAnonKey && (
                    <li>❌ VITE_SUPABASE_ANON_KEY ontbreekt in .env bestand</li>
                  )}
                  {!debugInfo.environment?.supabaseUrl && (
                    <li>❌ VITE_SUPABASE_URL ontbreekt in .env bestand</li>
                  )}
                  {debugInfo.databaseConnection?.isNetworkError && (
                    <li>❌ Netwerkverbinding probleem - controleer internetverbinding en CORS instellingen</li>
                  )}
                  {!debugInfo.databaseConnection?.success && !debugInfo.databaseConnection?.isNetworkError && (
                    <li>❌ Database verbinding mislukt - controleer uw Supabase project</li>
                  )}
                  {!debugInfo.storageAccess?.success && (
                    <li>❌ Storage toegang mislukt - activeer Storage in uw Supabase project</li>
                  )}
                  {debugInfo.storageAccess?.success && !debugInfo.kozijnBucket?.exists && (
                    <li>❌ Maak een bucket aan genaamd "kozijnen-photos" in Storage</li>
                  )}
                  {debugInfo.kozijnBucket?.exists && !debugInfo.kozijnBucket?.details?.public && (
                    <li>⚠️ Zet de "kozijnen-photos" bucket op Public</li>
                  )}
                  {debugInfo.bucketAccess?.success && (
                    <li>✅ Alles lijkt correct geconfigureerd!</li>
                  )}
                  {debugInfo.environment?.urlMatches && debugInfo.environment?.hasAnonKey && (
                    <li>✅ Environment variabelen zijn correct geconfigureerd</li>
                  )}
                </ul>
                
                {(debugInfo.databaseConnection?.isNetworkError || debugInfo.storageAccess?.error?.includes('Failed to fetch')) && (
                  <div className="mt-4 p-3 bg-yellow-100 rounded border-l-4 border-yellow-500">
                    <h4 className="font-medium text-yellow-800">Netwerkverbinding Probleem</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      De applicatie kan geen verbinding maken met Supabase. Dit kan komen door:
                    </p>
                    <ol className="text-sm text-yellow-700 mt-2 list-decimal list-inside">
                      <li>Onjuiste URL in .env bestand</li>
                      <li>CORS niet geconfigureerd in Supabase Dashboard</li>
                      <li>Internetverbinding problemen</li>
                      <li>Firewall of proxy blokkering</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Debug