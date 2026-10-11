import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // Navigation & View States
  // views: 'products', 'deals', 'cart', 'checkout', 'success', 'orders', 'product-detail', 'account'
  const [view, setView] = useState('products')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  // User & Auth States
  const [user, setUser] = useState({
    name: 'Muthurathi',
    email: 'muthurathi@techmart.in',
    phone: '+91 98765 43210',
    primeUser: true,
    savedAddress: 'No. 42, Innovation Street, Anna Nagar, Chennai - 600040',
    savedUpi: 'muthurathi@okaxis'
  })
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })

  // Shopping Cart & Orders
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([
    {
      orderId: 'TM849201',
      date: '2026-10-05',
      status: 'Delivered on Oct 7',
      total: 24990,
      paymentMethod: 'UPI (Google Pay)',
      items: [
        {
          name: 'Sony WH-1000XM5 Wireless Headphones',
          price: 24990,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
        }
      ],
      address: 'No 42, Anna Nagar, Chennai, 600040'
    }
  ])
  const [lastOrder, setLastOrder] = useState(null)

  // Payment & Form States
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    phone: user ? user.phone : '',
    address: user ? user.savedAddress : '',
    pincode: '600040',
    upiApp: 'Google Pay',
    upiId: user ? user.savedUpi : '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  })

  // Full Expanded Products Catalog (35+ Items Across All Requested Categories)
  const defaultProducts = [
    // --- PHONES ---
    {
      _id: 'p1',
      name: 'Apple iPhone 15 Pro (128 GB) - Natural Titanium',
      price: 124900,
      originalPrice: 134900,
      category: 'Phones',
      color: 'Natural Titanium',
      rating: 4.9,
      deal: 'Great Indian Festival',
      specs: ['A17 Pro Chip', '48MP Main Camera', 'Titanium Design with Action Button', 'USB-C Support'],
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
    },
    {
      _id: 'p2',
      name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB, 256GB)',
      price: 119999,
      originalPrice: 129999,
      category: 'Phones',
      color: 'Titanium Gray',
      rating: 4.8,
      deal: '15% Instant Discount',
      specs: ['Snapdragon 8 Gen 3', '200MP Quad Camera with AI', 'Built-in S-Pen', '5000 mAh Battery'],
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'
    },
    {
      _id: 'p3',
      name: 'OnePlus 12 5G (Silky Black, 16GB RAM, 512GB Storage)',
      price: 64999,
      originalPrice: 69999,
      category: 'Phones',
      color: 'Silky Black',
      rating: 4.7,
      deal: 'Bestseller',
      specs: ['Snapdragon 8 Gen 3', 'Hasselblad 4th Gen Camera', '100W SUPERVOOC Fast Charge'],
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'
    },

    // --- LAPTOPS ---
    {
      _id: 'l1',
      name: 'Apple MacBook Air M2 Chip Laptop (13.6-inch, 8GB RAM, 256GB SSD)',
      price: 89900,
      originalPrice: 99900,
      category: 'Laptops',
      color: 'Space Gray',
      rating: 4.9,
      deal: 'Top Brand Deal',
      specs: ['Apple M2 Chip 8-core CPU', '13.6" Liquid Retina Display', '18 Hours Battery Life', '1080p FaceTime HD Camera'],
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
    },
    {
      _id: 'l2',
      name: 'ASUS ROG Strix G16 Gaming Laptop (Intel i7 13th Gen, RTX 4060, 16GB)',
      price: 114990,
      originalPrice: 132990,
      category: 'Laptops',
      color: 'Eclipse Gray',
      rating: 4.7,
      deal: 'Gaming Deal',
      specs: ['16" FHD+ 165Hz Display', 'NVIDIA GeForce RTX 4060 8GB Graphics', 'ROG Intelligent Cooling', 'RGB Backlit Keyboard'],
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'
    },

    // --- TABLETS ---
    {
      _id: 't1',
      name: 'Apple iPad Air (5th Gen) 10.9-inch Wi-Fi 64GB',
      price: 54900,
      originalPrice: 59900,
      category: 'Tablets',
      color: 'Space Gray',
      rating: 4.8,
      deal: '10% Instant Bank Discount',
      specs: ['Apple M1 Chip', '12MP Ultra Wide Front Camera with Center Stage', 'Works with Apple Pencil 2nd Gen'],
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'
    },

    // --- HEADPHONES & EARBUDS ---
    {
      _id: 'h1',
      name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
      price: 24990,
      originalPrice: 29990,
      category: 'Headphones',
      color: 'Silver Gray',
      rating: 4.8,
      deal: 'Deal of the Day',
      specs: ['Auto NC Optimizer Noise Cancellation', '30 Hours Battery Life', 'Crystal Clear Hands-Free Calling'],
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
    },
    {
      _id: 'eb1',
      name: 'Apple AirPods Pro (2nd Gen) with MagSafe Case (USB-C)',
      price: 21900,
      originalPrice: 24900,
      category: 'Earbuds',
      color: 'White',
      rating: 4.9,
      deal: 'Popular Pick',
      specs: ['H2 Chip Sound Quality', 'Active Noise Cancellation & Transparency Mode', '30 Hours Total Listening Time'],
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500'
    },
    {
      _id: 'eb2',
      name: 'Sony WF-1000XM5 Truly Wireless Noise Canceling Earbuds',
      price: 19990,
      originalPrice: 24990,
      category: 'Earbuds',
      color: 'Black',
      rating: 4.7,
      deal: 'Save ₹5000',
      specs: ['Integrated Processor V2', 'Hi-Res Audio Wireless', 'Multipoint Bluetooth Connection'],
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'
    },

    // --- TELEVISIONS (TV) ---
    {
      _id: 'tv1',
      name: 'Sony BRAVIA 55-inch 4K Ultra HD Smart LED Google TV',
      price: 57990,
      originalPrice: 79900,
      category: 'TV',
      color: 'Black',
      rating: 4.8,
      deal: 'Festive Offer 27% OFF',
      specs: ['4K Processor X1', 'Dolby Audio & Open Baffle Speaker', 'Google TV with Voice Search'],
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'
    },
    {
      _id: 'tv2',
      name: 'LG 65-inch 4K Smart OLED EVO TV (120Hz Gaming TV)',
      price: 144990,
      originalPrice: 189900,
      category: 'TV',
      color: 'Dark Silver',
      rating: 4.9,
      deal: 'Flagship OLED',
      specs: ['alpha9 AI Processor Gen6', '100% Color Volume OLED', 'NVIDIA G-Sync & FreeSync Compatible'],
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500'
    },

    // --- HOME THEATER & SPEAKERS ---
    {
      _id: 'ht1',
      name: 'JBL Bar 500 5.1 Channel Soundbar with Wireless Subwoofer',
      price: 44999,
      originalPrice: 59999,
      category: 'Home Theater',
      color: 'Black',
      rating: 4.7,
      deal: '25% OFF',
      specs: ['590W Total Output Power', 'Multibeam 3D Surround Sound', '10-inch Wireless Subwoofer'],
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500'
    },
    {
      _id: 'sp1',
      name: 'JBL Flip 6 Portable Waterproof Bluetooth Speaker',
      price: 9999,
      originalPrice: 13999,
      category: 'Speakers',
      color: 'Ocean Blue',
      rating: 4.6,
      deal: 'Top Rated',
      specs: ['IP67 Waterproof & Dustproof', '12 Hours Playtime', 'PartyBoost Link Multiple Speakers'],
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'
    },

    // --- KITCHEN APPLIANCES ---
    {
      _id: 'k1',
      name: 'Philips Digital Air Fryer HD9252/90 (90% Less Oil Cooking)',
      price: 7999,
      originalPrice: 11995,
      category: 'Kitchen',
      color: 'Black',
      rating: 4.7,
      deal: '33% OFF',
      specs: ['Rapid Air Technology', '7 Touch Screen Presets', 'Keep Warm Function', 'Easy Clean Basket'],
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'
    },
    {
      _id: 'k2',
      name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker (6 Litre)',
      price: 8990,
      originalPrice: 12990,
      category: 'Kitchen',
      color: 'Stainless Steel',
      rating: 4.8,
      deal: 'Bestseller',
      specs: ['7 Functions: Pressure Cooker, Slow Cooker, Rice Cooker, Steamer', '13 One-Touch Smart Programs'],
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500'
    },

    // --- HOME APPLIANCES ---
    {
      _id: 'hm1',
      name: 'Dyson V12 Detect Slim Cordless Vacuum Cleaner',
      price: 49900,
      originalPrice: 55900,
      category: 'Home',
      color: 'Gold/Iron',
      rating: 4.8,
      deal: 'Premium Home Essential',
      specs: ['Laser Reveals Invisible Dust', 'LCD Screen Particle Count', '60 Minutes Fade-Free Power'],
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500'
    },

    // --- MOBILE GADGETS ---
    {
      _id: 'mg1',
      name: 'MagSafe 3-in-1 Fast Wireless Charging Station Stand',
      price: 2499,
      originalPrice: 4999,
      category: 'Mobile Gadgets',
      color: 'Black',
      rating: 4.5,
      deal: '50% OFF',
      specs: ['Simultaneous Charging for iPhone, Apple Watch & AirPods', '15W Fast Wireless Output'],
      image: 'https://images.unsplash.com/photo-1622445268465-843d16279f18?w=500'
    },

    // --- LAPTOP GADGETS ---
    {
      _id: 'lg1',
      name: 'Ergonomic Adjustable Aluminum Laptop Stand for Desk',
      price: 1299,
      originalPrice: 2499,
      category: 'Laptop Gadgets',
      color: 'Silver',
      rating: 4.7,
      deal: 'Essential Accessory',
      specs: ['Heat Dissipation Vent', 'Supports Laptops up to 17 inches', 'Non-Slip Silicone Pads'],
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'
    },

    // --- MAKEUP THINGS ---
    {
      _id: 'mk1',
      name: 'Maybelline Fit Me Matte + Poreless Liquid Foundation (30ml)',
      price: 549,
      originalPrice: 699,
      category: 'Makeup',
      color: 'Warm Nude 128',
      rating: 4.6,
      deal: '21% OFF',
      specs: ['Natural Matte Finish', 'SPF 22 Protection', 'Controls Shine & Blurs Pores'],
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500'
    },
    {
      _id: 'mk2',
      name: 'M.A.C Retro Matte Lipstick (Ruby Woo - Iconic Red)',
      price: 1950,
      originalPrice: 2100,
      category: 'Makeup',
      color: 'Ruby Woo Red',
      rating: 4.9,
      deal: 'Trending Beauty',
      specs: ['Intense Matte Finish', 'Long Wearing 12 Hours', 'Featherproof & Fade-Resistant'],
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500'
    },

    // --- HEALTHCARE PRODUCTS ---
    {
      _id: 'hc1',
      name: 'Omron Automatic Blood Pressure Monitor with IntelliSense',
      price: 2199,
      originalPrice: 3280,
      category: 'Healthcare',
      color: 'White',
      rating: 4.8,
      deal: '33% OFF',
      specs: ['One Touch Measurement', 'Irregular Heartbeat Detection', 'Memory for Last Reading'],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500'
    },
    {
      _id: 'hc2',
      name: 'Accu-Chek Instant Blood Glucose Meter with 50 Test Strips',
      price: 1399,
      originalPrice: 1899,
      category: 'Healthcare',
      color: 'Black',
      rating: 4.7,
      deal: '26% OFF',
      specs: ['Result in Under 4 Seconds', 'No Setup Required', 'Target Range Indicator Light'],
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500'
    }
  ]

  const [products, setProducts] = useState(defaultProducts)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products')
        if (data && data.length > 0) {
          setProducts(data)
        }
      } catch (error) {
        console.log('Using local catalog products data')
      }
    }
    fetchProducts()
  }, [])

  // Handlers
  // 1. ADD TO CART & AUTO-REDIRECT TO CART PAGE
  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product])
    setView('cart') // Direct Automatic Navigation to Cart Page!
  }

  const handleRemoveFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const handleOpenProductDetail = (product) => {
    setSelectedProduct(product)
    setView('product-detail')
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (!loginData.email) {
      alert('Please enter email!')
      return
    }
    const nameFromEmail = loginData.email.split('@')[0]
    const createdUser = {
      name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
      email: loginData.email,
      phone: '+91 98765 00000',
      primeUser: true,
      savedAddress: 'No. 12, Tech Park, Chennai - 600001',
      savedUpi: `${nameFromEmail}@upi`
    }
    setUser(createdUser)
    setShowLoginModal(false)
    alert(`Welcome back, ${createdUser.name}! 👋`)
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      alert('⚠️ Please fill in all delivery address details!')
      return
    }

    if (paymentMethod === 'upi' && !formData.upiId) {
      alert('⚠️ Please enter your UPI ID!')
      return
    }

    if (paymentMethod === 'card' && (!formData.cardNumber || !formData.cardCvv)) {
      alert('⚠️ Please fill in complete Card details!')
      return
    }

    const newOrder = {
      orderId: 'TM' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString().split('T')[0],
      status: 'Order Confirmed (Arriving Tomorrow)',
      total: totalPrice,
      paymentMethod: paymentMethod === 'upi' ? `UPI (${formData.upiApp} - ${formData.upiId})` : paymentMethod === 'card' ? `Card (ending ****${formData.cardNumber.slice(-4)})` : 'Cash on Delivery (COD)',
      items: [...cart],
      address: `${formData.address}, ${formData.pincode} | Phone: ${formData.phone}`
    }

    setOrders([newOrder, ...orders])
    setLastOrder(newOrder)
    setCart([])
    setView('success')
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  // Category List
  const allCategories = [
    'All', 'Phones', 'Laptops', 'Tablets', 'Headphones', 'Earbuds', 
    'TV', 'Home Theater', 'Speakers', 'Kitchen', 'Home', 
    'Mobile Gadgets', 'Laptop Gadgets', 'Makeup', 'Healthcare'
  ]

  // Filter products by category & search term
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Similar Products Suggestion logic
  const similarProducts = selectedProduct 
    ? products.filter(p => p.category === selectedProduct.category && p._id !== selectedProduct._id)
    : []

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#eaeded', minHeight: '100vh', margin: 0, padding: 0 }}>
      
      {/* 1. AMAZON STYLE MAIN HEADER */}
      <header style={{ backgroundColor: '#131921', color: '#fff', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
        
        {/* TechMart Logo */}
        <div 
          onClick={() => { setView('products'); setSelectedCategory('All'); }} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '24px', fontWeight: 'bold' }}
        >
          <span style={{ color: '#fff' }}>Tech</span>
          <span style={{ color: '#ff9900' }}>Mart</span>
          <span style={{ fontSize: '11px', color: '#ccc', marginLeft: '2px' }}>.in</span>
        </div>

        {/* Deliver To Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '13px' }}>
          <span style={{ fontSize: '18px' }}>📍</span>
          <div>
            <div style={{ fontSize: '11px', color: '#ccc' }}>Deliver to</div>
            <div style={{ fontWeight: 'bold' }}>India</div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', flex: 1, maxWidth: '650px', borderRadius: '4px', overflow: 'hidden' }}>
          <select 
            value={selectedCategory} 
            onChange={(e) => { setSelectedCategory(e.target.value); setView('products'); }}
            style={{ backgroundColor: '#f3f3f3', border: 'none', padding: '0 10px', fontSize: '12px', borderRight: '1px solid #ddd', cursor: 'pointer' }}
          >
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Search TechMart for Mobiles, TVs, Kitchen, Makeup..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setView('products'); }}
            style={{ flex: 1, padding: '10px 12px', border: 'none', outline: 'none', fontSize: '14px' }}
          />
          <button style={{ backgroundColor: '#febd69', border: 'none', padding: '0 18px', cursor: 'pointer', fontSize: '18px' }}>
            🔍
          </button>
        </div>

        {/* Right Header Options */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px' }}>
          
          {/* Account & Profile */}
          <div 
            onClick={() => user ? setView('account') : setShowLoginModal(true)} 
            style={{ cursor: 'pointer' }}
          >
            <div style={{ fontSize: '11px', color: '#ccc' }}>Hello, {user ? user.name : 'sign in'}</div>
            <div style={{ fontWeight: 'bold' }}>{user ? 'Account & Profile' : 'Account & Lists ▾'}</div>
          </div>

          {/* Returns & Orders */}
          <div 
            onClick={() => setView('orders')} 
            style={{ cursor: 'pointer' }}
          >
            <div style={{ fontSize: '11px', color: '#ccc' }}>Returns</div>
            <div style={{ fontWeight: 'bold' }}>& Orders</div>
          </div>

          {/* Cart Badge */}
          <div 
            onClick={() => setView('cart')} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', position: 'relative' }}
          >
            <div style={{ fontSize: '26px' }}>🛒</div>
            <span style={{
              position: 'absolute',
              top: '-4px',
              left: '12px',
              backgroundColor: '#ff9900',
              color: '#111',
              borderRadius: '50%',
              padding: '2px 7px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {cart.length}
            </span>
            <span style={{ fontWeight: 'bold', marginTop: '10px' }}>Cart</span>
          </div>
        </div>
      </header>

      {/* 2. SUB NAVIGATION BAR & CATEGORY BAR */}
      <div style={{ backgroundColor: '#232f3e', color: '#fff', padding: '8px 20px', display: 'flex', gap: '20px', fontSize: '13px', alignItems: 'center', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <span onClick={() => { setView('products'); setSelectedCategory('All'); }} style={{ fontWeight: 'bold', cursor: 'pointer' }}>☰ All</span>
        <span onClick={() => setView('deals')} style={{ cursor: 'pointer', color: '#ff9900', fontWeight: 'bold' }}>⚡ Today's Deals</span>
        {allCategories.filter(c => c !== 'All').map(cat => (
          <span 
            key={cat} 
            onClick={() => { setSelectedCategory(cat); setView('products'); }} 
            style={{ cursor: 'pointer', fontWeight: selectedCategory === cat ? 'bold' : 'normal', color: selectedCategory === cat ? '#ff9900' : '#fff' }}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* 3. SIGN IN / LOGIN MODAL */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', width: '350px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#0f1111' }}>Sign in to TechMart</h2>
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Email or mobile phone number</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #a6a6a6', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="At least 6 characters"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #a6a6a6', boxSizing: 'border-box' }}
                />
              </div>
              <button 
                type="submit"
                style={{ backgroundColor: '#ffd814', border: '1px solid #fcd200', width: '100%', padding: '10px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Continue
              </button>
            </form>
            <button 
              onClick={() => setShowLoginModal(false)}
              style={{ background: 'none', border: 'none', color: '#007185', fontSize: '13px', cursor: 'pointer', marginTop: '15px', width: '100%', textDecoration: 'underline' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 4. MAIN CONTENT CONTAINER */}
      <div style={{ padding: '20px', maxWidth: '1300px', margin: '0 auto' }}>

        {/* --- A. DEDICATED ACCOUNT & PROFILE PAGE --- */}
        {view === 'account' && (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', maxWidth: '900px', margin: '0 auto', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <div style={{ borderBottom: '2px solid #ff9900', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: '0 0 5px 0', color: '#0f1111' }}>Your Account & Profile Details</h2>
                <p style={{ margin: 0, color: '#565959', fontSize: '14px' }}>Manage your profile, delivery addresses & payment preferences</p>
              </div>
              <span style={{ backgroundColor: '#232f3e', color: '#ff9900', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px' }}>
                👑 TechMart Prime Member
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Profile Card */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: '#fafafa' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#111827' }}>👤 Personal Information</h3>
                <p style={{ margin: '6px 0', fontSize: '14px' }}><b>Full Name:</b> {user.name}</p>
                <p style={{ margin: '6px 0', fontSize: '14px' }}><b>Email:</b> {user.email}</p>
                <p style={{ margin: '6px 0', fontSize: '14px' }}><b>Mobile Phone:</b> {user.phone}</p>
                <p style={{ margin: '6px 0', fontSize: '14px' }}><b>Language:</b> English / Tamil (IN)</p>
              </div>

              {/* Delivery Address Card */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: '#fafafa' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#111827' }}>📍 Default Delivery Address</h3>
                <p style={{ margin: '6px 0', fontSize: '14px', lineHeight: '1.5' }}>{user.savedAddress}</p>
                <button style={{ backgroundColor: '#e5e7eb', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', marginTop: '10px' }}>
                  Edit Address
                </button>
              </div>

              {/* Saved Payment Methods */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: '#fafafa' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#111827' }}>💳 Saved Payment Options</h3>
                <p style={{ margin: '6px 0', fontSize: '14px' }}><b>UPI ID:</b> {user.savedUpi}</p>
                <p style={{ margin: '6px 0', fontSize: '14px' }}><b>Saved Card:</b> HDFC Visa Credit Card (**** 4892)</p>
              </div>

              {/* Quick Actions */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: '#fafafa' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#111827' }}>📦 Quick Shortcuts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => setView('orders')} style={{ backgroundColor: '#ffd814', border: '1px solid #fcd200', padding: '8px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                    View Your Orders & Returns ({orders.length})
                  </button>
                  <button onClick={() => setUser(null)} style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '8px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- B. PRODUCT DETAIL PAGE WITH SIMILAR PRODUCTS --- */}
        {view === 'product-detail' && selectedProduct && (
          <div>
            {/* Back Button */}
            <button 
              onClick={() => setView('products')} 
              style={{ backgroundColor: 'none', border: 'none', color: '#007185', cursor: 'pointer', fontSize: '14px', marginBottom: '15px', fontWeight: 'bold' }}
            >
              ◄ Back to Products catalog
            </button>

            {/* Main Product Specs Card */}
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', display: 'flex', gap: '30px', flexWrap: 'wrap', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              
              {/* Product Image */}
              <div style={{ flex: '1', minWidth: '300px', textAlign: 'center', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', maxHeight: '350px', objectFit: 'contain' }} />
              </div>

              {/* Product Info */}
              <div style={{ flex: '2', minWidth: '320px' }}>
                <span style={{ backgroundColor: '#cc0c39', color: '#fff', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px' }}>
                  {selectedProduct.deal || 'TechMart Deal'}
                </span>

                <h1 style={{ fontSize: '22px', margin: '10px 0', color: '#0f1111' }}>{selectedProduct.name}</h1>
                
                <div style={{ fontSize: '14px', color: '#ffa41c', marginBottom: '10px' }}>
                  ⭐⭐⭐⭐★ <span style={{ color: '#007185', marginLeft: '6px' }}>{selectedProduct.rating || 4.8} rating | 1,240 answered questions</span>
                </div>

                <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '15px 0', margin: '15px 0' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#b12704' }}>
                    ₹{selectedProduct.price}
                    <span style={{ fontSize: '14px', color: '#565959', textDecoration: 'line-through', marginLeft: '12px' }}>
                      ₹{selectedProduct.originalPrice || selectedProduct.price + 3000}
                    </span>
                  </div>
                  <p style={{ color: '#007600', fontWeight: 'bold', margin: '5px 0 0 0', fontSize: '14px' }}>In Stock. FREE Delivery Tomorrow</p>
                </div>

                {/* Key Specifications */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', color: '#111' }}>Product Specifications & Highlights:</h4>
                  <ul style={{ paddingLeft: '20px', margin: '0 0 20px 0', fontSize: '14px', color: '#333' }}>
                    {selectedProduct.specs ? selectedProduct.specs.map((spec, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>{spec}</li>
                    )) : (
                      <>
                        <li>Category: <b>{selectedProduct.category}</b></li>
                        <li>Color: <b>{selectedProduct.color || 'Standard'}</b></li>
                        <li>1 Year Manufacturer Warranty</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '15px', maxWidth: '400px' }}>
                  <button 
                    onClick={() => handleAddToCart(selectedProduct)}
                    style={{ flex: 1, backgroundColor: '#ffd814', border: '1px solid #fcd200', padding: '12px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
                  >
                    Add to Cart 🛒
                  </button>
                  <button 
                    onClick={() => { setCart([...cart, selectedProduct]); setView('checkout'); }}
                    style={{ flex: 1, backgroundColor: '#ffa41c', border: '1px solid #ff8f00', padding: '12px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
                  >
                    Buy Now ⚡
                  </button>
                </div>
              </div>
            </div>

            {/* --- SIMILAR PRODUCTS SECTION --- */}
            {similarProducts.length > 0 && (
              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#0f1111', borderBottom: '2px solid #ff9900', paddingBottom: '8px' }}>
                  Similar Products You Might Like ({selectedProduct.category})
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
                  {similarProducts.map((item) => (
                    <div 
                      key={item._id}
                      onClick={() => handleOpenProductDetail(item)}
                      style={{ border: '1px solid #eee', borderRadius: '8px', padding: '12px', cursor: 'pointer', backgroundColor: '#fafafa' }}
                    >
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '130px', objectFit: 'contain' }} />
                      <h5 style={{ margin: '8px 0 4px 0', fontSize: '13px', color: '#0f1111' }}>{item.name}</h5>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#b12704' }}>₹{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- C. TODAY'S DEALS & OFFERS VIEW --- */}
        {view === 'deals' && (
          <div>
            <div style={{ backgroundColor: '#b12704', color: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
              <h1 style={{ margin: '0 0 8px 0' }}>⚡ TechMart Great Indian Festival Deals!</h1>
              <p style={{ margin: 0, fontSize: '16px' }}>Up to 70% OFF on Mobiles, Laptops, Smart TVs, Kitchen & Beauty Gadgets!</p>
            </div>

            <h3 style={{ marginBottom: '15px', color: '#0f1111' }}>Deals of the Day</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {products.map((product) => (
                <div key={product._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ backgroundColor: '#cc0c39', color: '#fff', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px' }}>
                      {product.deal || 'Deal'}
                    </span>
                    <div 
                      onClick={() => handleOpenProductDetail(product)}
                      style={{ textAlign: 'center', padding: '10px', margin: '10px 0', cursor: 'pointer' }}
                    >
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '170px', objectFit: 'contain' }} />
                    </div>
                    <h4 
                      onClick={() => handleOpenProductDetail(product)}
                      style={{ fontSize: '15px', margin: '8px 0', color: '#0f1111', cursor: 'pointer' }}
                    >
                      {product.name}
                    </h4>
                    <div style={{ margin: '8px 0' }}>
                      <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#b12704' }}>₹{product.price}</span>
                      <span style={{ fontSize: '13px', color: '#565959', textDecoration: 'line-through', marginLeft: '8px' }}>₹{product.originalPrice || product.price + 2000}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    style={{ backgroundColor: '#ffd814', border: '1px solid #fcd200', padding: '10px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- D. MAIN PRODUCTS CATALOG VIEW --- */}
        {view === 'products' && (
          <div>
            {/* Promo Banner */}
            <div style={{ backgroundColor: '#232f3e', color: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: '0 0 5px 0', color: '#ff9900' }}>Great Tech Festival - Live Now!</h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#ddd' }}>Shop Mobiles, Laptops, Smart TVs, Kitchen, Home & Beauty Essentials</p>
              </div>
              <button 
                onClick={() => setView('deals')}
                style={{ backgroundColor: '#ffd814', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                View All Deals
              </button>
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid #ccc',
                    backgroundColor: selectedCategory === cat ? '#131921' : '#fff',
                    color: selectedCategory === cat ? '#fff' : '#111',
                    fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h3 style={{ marginBottom: '15px', color: '#0f1111' }}>
              Showing {selectedCategory} Products ({filteredProducts.length})
            </h3>

            {/* Product Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}
                >
                  <div>
                    {/* Click Image to Open Product Details Page */}
                    <div 
                      onClick={() => handleOpenProductDetail(product)}
                      style={{ textAlign: 'center', backgroundColor: '#f7f7f7', borderRadius: '6px', padding: '10px', marginBottom: '12px', cursor: 'pointer' }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '180px', objectFit: 'contain' }}
                      />
                    </div>

                    <h4 
                      onClick={() => handleOpenProductDetail(product)}
                      style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#0f1111', minHeight: '40px', cursor: 'pointer' }}
                    >
                      {product.name}
                    </h4>

                    <div style={{ fontSize: '13px', color: '#ffa41c', marginBottom: '8px' }}>
                      ⭐⭐⭐⭐★ <span style={{ color: '#007185', marginLeft: '4px' }}>{product.rating || 4.5}</span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#00a8e1', fontWeight: 'bold', marginBottom: '8px' }}>
                      prime <span style={{ color: '#565959', fontWeight: 'normal' }}>FREE Delivery Tomorrow</span>
                    </div>

                    <div style={{ margin: '8px 0' }}>
                      <span style={{ fontSize: '12px', verticalAlign: 'top', position: 'relative', top: '2px' }}>₹</span>
                      <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f1111' }}>{product.price}</span>
                      <span style={{ fontSize: '12px', color: '#565959', marginLeft: '8px', textDecoration: 'line-through' }}>₹{product.originalPrice || product.price + 1500}</span>
                    </div>

                    <p style={{ fontSize: '12px', color: '#565959', margin: '4px 0' }}>Category: <b>{product.category}</b></p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    style={{
                      backgroundColor: '#ffd814',
                      color: '#0f1111',
                      border: '1px solid #fcd200',
                      padding: '10px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      width: '100%',
                      marginTop: '10px'
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- E. RETURNS & ORDERS VIEW --- */}
        {view === 'orders' && (
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '2px solid #ff9900', paddingBottom: '10px', margin: '0 0 20px 0' }}>
              Your Orders & Purchase History
            </h2>

            {orders.length === 0 ? (
              <p>No past orders found.</p>
            ) : (
              orders.map((order) => (
                <div key={order.orderId} style={{ border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#f0f2f2', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#565959' }}>
                    <div>
                      <div>ORDER PLACED</div>
                      <div style={{ fontWeight: 'bold', color: '#111' }}>{order.date}</div>
                    </div>
                    <div>
                      <div>TOTAL</div>
                      <div style={{ fontWeight: 'bold', color: '#b12704' }}>₹{order.total}</div>
                    </div>
                    <div>
                      <div>SHIP TO</div>
                      <div style={{ fontWeight: 'bold', color: '#111' }}>{order.address.split('|')[0]}</div>
                    </div>
                    <div>
                      <div>ORDER # {order.orderId}</div>
                      <div style={{ color: '#007185', fontWeight: 'bold' }}>{order.paymentMethod}</div>
                    </div>
                  </div>

                  <div style={{ padding: '20px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#007600' }}>{order.status}</h4>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
                        <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'contain', border: '1px solid #eee' }} />
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{item.name}</div>
                          <div style={{ fontSize: '13px', color: '#b12704' }}>₹{item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- F. SHOPPING CART VIEW --- */}
        {view === 'cart' && (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', margin: '0 0 20px 0' }}>Shopping Cart</h2>

              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <h3>Your Cart is empty</h3>
                  <button onClick={() => setView('products')} style={{ backgroundColor: '#ffd814', border: '1px solid #fcd200', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{item.name}</h3>
                      <p style={{ margin: '4px 0', fontSize: '12px', color: '#007600' }}>In Stock</p>
                      <button onClick={() => handleRemoveFromCart(index)} style={{ background: 'none', border: 'none', color: '#007185', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', padding: 0 }}>
                        Delete item
                      </button>
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{item.price}</span>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ width: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                <div style={{ fontSize: '13px', color: '#007600', marginBottom: '10px' }}>✅ Eligible for FREE Delivery</div>
                <h3 style={{ margin: '10px 0' }}>
                  Subtotal ({cart.length} items): <br/>
                  <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#b12704' }}>₹{totalPrice}</span>
                </h3>
                <button onClick={() => setView('checkout')} style={{ backgroundColor: '#ffd814', border: '1px solid #fcd200', width: '100%', padding: '12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }}>
                  Proceed to Buy
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- G. CHECKOUT & PAYMENT PAGE --- */}
        {view === 'checkout' && (
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '2px solid #ff9900', paddingBottom: '10px', margin: '0 0 20px 0' }}>
              Select Delivery Address & Payment Method
            </h2>

            <form onSubmit={handlePlaceOrder}>
              {/* Delivery Address Section */}
              <div style={{ marginBottom: '25px', backgroundColor: '#fafafa', padding: '15px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 12px 0' }}>1. Delivery Address 📍</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input type="text" name="name" placeholder="Full Name *" required value={formData.name} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                  <input type="text" name="phone" placeholder="Mobile Number *" required value={formData.phone} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                  <input type="text" name="address" placeholder="Flat / House No. / Street *" required value={formData.address} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', gridColumn: 'span 2' }} />
                  <input type="text" name="pincode" placeholder="Pincode *" required value={formData.pincode} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
              </div>

              {/* Payment Methods Section */}
              <div style={{ marginBottom: '25px', backgroundColor: '#fafafa', padding: '15px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 12px 0' }}>2. Payment Options 💳</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  
                  {/* UPI Option */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: paymentMethod === 'upi' ? '#fffbeb' : '#fff' }}>
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                    <div>
                      <b>UPI Payment (GPay / PhonePe / Paytm)</b>
                      <div style={{ fontSize: '12px', color: '#666' }}>Pay instantly using any UPI app</div>
                    </div>
                  </label>
                  {paymentMethod === 'upi' && (
                    <div style={{ marginLeft: '25px', display: 'flex', gap: '10px', flexDirection: 'column', width: '320px' }}>
                      <select name="upiApp" value={formData.upiApp} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="Google Pay">Google Pay</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Paytm">Paytm</option>
                        <option value="BHIM UPI">BHIM UPI</option>
                      </select>
                      <input type="text" name="upiId" placeholder="Enter UPI ID (e.g. mobile@upi)" value={formData.upiId} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                  )}

                  {/* Card Option */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: paymentMethod === 'card' ? '#fffbeb' : '#fff' }}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                    <div>
                      <b>Credit / Debit Card</b>
                      <div style={{ fontSize: '12px', color: '#666' }}>Visa, MasterCard, RuPay supported</div>
                    </div>
                  </label>
                  {paymentMethod === 'card' && (
                    <div style={{ marginLeft: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '400px' }}>
                      <input type="text" name="cardNumber" placeholder="16 Digit Card Number" value={formData.cardNumber} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', gridColumn: 'span 2' }} />
                      <input type="text" name="cardName" placeholder="Cardholder Name" value={formData.cardName} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', gridColumn: 'span 2' }} />
                      <input type="text" name="cardExpiry" placeholder="MM/YY" value={formData.cardExpiry} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                      <input type="password" name="cardCvv" placeholder="CVV" maxLength={3} value={formData.cardCvv} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                  )}

                  {/* Cash on Delivery Option */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: paymentMethod === 'cod' ? '#fffbeb' : '#fff' }}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                    <div>
                      <b>Cash on Delivery (COD)</b>
                      <div style={{ fontSize: '12px', color: '#666' }}>Pay cash at doorstep when order arrives</div>
                    </div>
                  </label>

                </div>
              </div>

              {/* Total & Submit */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                <div>
                  <span style={{ fontSize: '14px', color: '#555' }}>Total Amount:</span>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#b12704' }}>₹{totalPrice}</div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setView('cart')} style={{ backgroundColor: '#e5e7eb', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' }}>
                    Back to Cart
                  </button>
                  <button type="submit" style={{ backgroundColor: '#ffd814', border: '1px solid #fcd200', padding: '12px 25px', borderRadius: '20px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Place Your Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* --- H. ORDER SUCCESS SCREEN --- */}
        {view === 'success' && lastOrder && (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', maxWidth: '600px', margin: '20px auto', textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>🎉</div>
            <h2 style={{ color: '#007600', margin: '0 0 10px 0' }}>Order Confirmed & Placed!</h2>
            <p style={{ color: '#555', fontSize: '14px' }}>Order ID: <b>#{lastOrder.orderId}</b></p>

            <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '6px', textAlign: 'left', margin: '20px 0', border: '1px solid #eee' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#111' }}>Order Summary:</h4>
              <p style={{ margin: '4px 0', fontSize: '13px' }}><b>Delivery Address:</b> {lastOrder.address}</p>
              <p style={{ margin: '4px 0', fontSize: '13px' }}><b>Payment Method:</b> {lastOrder.paymentMethod}</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#b12704', fontWeight: 'bold' }}>Total Paid: ₹{lastOrder.total}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setView('orders')} style={{ backgroundColor: '#232f3e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' }}>
                View All Orders
              </button>
              <button onClick={() => setView('products')} style={{ backgroundColor: '#ffd814', border: '1px solid #fcd200', padding: '10px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App