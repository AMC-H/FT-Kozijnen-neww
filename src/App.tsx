import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Configurator from './pages/Configurator'
import Quotes from './pages/Quotes'
import Account from './pages/Dashboard'
import FinalizeQuote from './pages/FinalizeQuote'
import QuoteSuccess from './pages/QuoteSuccess'
import Shop from './pages/Shop'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Contact from './pages/Contact'
import HoutenKozijnen from './pages/HoutenKozijnen'
import KunststofKozijnen from './pages/KunststofKozijnen'
import AluminiumKozijnen from './pages/AluminiumKozijnen'
import Buitendeuren from './pages/Buitendeuren'
import Debug from './pages/Debug'
import EkolineConfigurator from './pages/EkolineConfigurator'
import EkoVitreSelector from './pages/configurator/ekovitre/Selector'
import ClassicLineSelector from './pages/configurator/classicline/Selector'
import DespiroConfigurator from './pages/DespiroConfigurator' // <-- ET/Despiro route hersteld
import BuitendeurenSelector from './pages/configurator/buitendeuren/Selector'

function AppContent() {
  const location = useLocation()
  const isHoutenKozijnenPage = location.pathname === '/houten-kozijnen'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/houten-kozijnen" element={<HoutenKozijnen />} />
          <Route path="/kunststof-kozijnen" element={<KunststofKozijnen />} />
          <Route path="/aluminium-kozijnen" element={<AluminiumKozijnen />} />
          <Route path="/buitendeuren" element={<Buitendeuren />} />
          <Route path="/debug" element={<Debug />} />

          <Route 
            path="/configurator/ekoline" 
            element={
              <ProtectedRoute>
                <EkolineConfigurator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/configurator/ekovitre" 
            element={
              <ProtectedRoute>
                <EkoVitreSelector />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/configurator/classicline" 
            element={
              <ProtectedRoute>
                <ClassicLineSelector />
              </ProtectedRoute>
            } 
          />
          {/* Hersteld: DespiroConfigurator (voorheen ET) */}
          <Route 
            path="/configurator/et" 
            element={
              <ProtectedRoute>
                <DespiroConfigurator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/configurator/buitendeuren" 
            element={
              <ProtectedRoute>
                <BuitendeurenSelector />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/configurator" 
            element={
              <ProtectedRoute>
                <Configurator />
              </ProtectedRoute>
            } 
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-success" 
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/finalize-quote" 
            element={
              <ProtectedRoute>
                <FinalizeQuote />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quote-success" 
            element={
              <ProtectedRoute>
                <QuoteSuccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quotes" 
            element={
              <ProtectedRoute>
                <Quotes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/account" 
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer isHoutenKozijnenPage={isHoutenKozijnenPage} />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App