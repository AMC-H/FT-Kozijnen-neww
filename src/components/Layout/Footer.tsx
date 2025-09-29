import React from 'react'
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react'

interface FooterProps {
  isHoutenKozijnenPage?: boolean
}

const Footer: React.FC<FooterProps> = ({ isHoutenKozijnenPage = false }) => {
  const bgColor = 'bg-primary-450'
  const textColor = 'text-white'
  const secondaryTextColor = 'text-white'
  const hoverTextColor = 'hover:text-gray-200'
  const borderColor = 'border-white border-opacity-30'

  return (
    <footer className={`${bgColor} ${textColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/Zonder titel (Logo).png" 
                alt="FT-Kozijnen Logo" 
                className="h-20 w-auto"
              />
            </div>
            <p className={secondaryTextColor}>
              Specialist in hoogwaardige kozijnen, ramen en deuren. 
              Al meer dan 20 jaar uw partner voor duurzame woningverbetering.
            </p>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>Navigatie</h3>
            <ul className={`space-y-2 ${secondaryTextColor}`}>
              <li><a href="/" className={`${hoverTextColor} transition-colors`}>Home</a></li>
              <li><a href="/about" className={`${hoverTextColor} transition-colors`}>Over ons</a></li>
              <li><a href="/configurator" className={`${hoverTextColor} transition-colors`}>Configurator</a></li>
              <li><a href="/contact" className={`${hoverTextColor} transition-colors`}>Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>Producten</h3>
            <ul className={`space-y-2 ${secondaryTextColor}`}>
              <li>Ramen</li>
              <li>Deuren</li>
              <li>Schuifpuien</li>
              <li>Tuindeuren</li>
              <li>Dakkapellen</li>
              <li>Screens</li>
            </ul>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>Contact</h3>
            <div className={`space-y-2 ${secondaryTextColor}`}>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+31 639 430 243</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@ftkozijnen.nl</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Industrieweg 17 Opslag 6, 4561 GH Hulst</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`mt-8 text-center`}>
          <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>Volg ons</h3>
          <div className={`flex flex-wrap justify-center space-x-4 ${secondaryTextColor}`}>
            <a 
              href="https://www.instagram.com/ftkozijnen/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center space-x-2 ${hoverTextColor} transition-colors`}
            >
              <Instagram className="h-4 w-4" />
              <span>Instagram</span>
            </a>
            <a 
              href="https://www.facebook.com/FTKozijnen" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center space-x-2 ${hoverTextColor} transition-colors`}
            >
              <Facebook className="h-4 w-4" />
              <span>Facebook</span>
            </a>
            <a 
              href="https://www.tiktok.com/@ft_kozijnen_b.v" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center space-x-2 ${hoverTextColor} transition-colors`}
            >
              <Youtube className="h-4 w-4" />
              <span>TikTok</span>
            </a>
          </div>
        </div>
        
        <div className={`border-t ${borderColor} mt-8 pt-8 text-center ${secondaryTextColor}`}>
          <p>&copy; 2024 FT-Kozijnen B.V. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer