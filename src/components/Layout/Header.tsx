import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Settings, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'

const Header: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/logo_transparent.png" 
                alt="FT-Kozijnen Logo" 
                className="h-16 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-primary-600 transition-colors">
              Shop
            </Link>
            <Link to="/configurator" className="text-gray-700 hover:text-primary-600 transition-colors">
              Configurator
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Account
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welkom, {user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Uitloggen</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Inloggen
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Registreren
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                Home
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-primary-600 transition-colors">
                Shop
              </Link>
              <Link to="/configurator" className="text-gray-700 hover:text-primary-600 transition-colors">
                Configurator
              </Link>
              {user && (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Account
                  </Link>
                </>
              )}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors w-fit"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Uitloggen</span>
                </button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Inloggen
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors w-fit"
                  >
                    Registreren
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header