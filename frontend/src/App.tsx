import { useState, useEffect } from 'react'
import axios from 'axios'
import { useCartStore } from './CartStore'
import { retrieveLaunchParams } from '@telegram-apps/sdk'

function App() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { items, addItem, getTotal } = useCartStore()
  
  // الحصول على بيانات المستخدم من تيليغرام
  const launchParams = retrieveLaunchParams()
  const user = launchParams.initData?.user

  useEffect(() => {
    // جلب المنتجات
    axios.get('http://localhost:8000/api/products')
      .then(res => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("خطأ في الاتصال:", err)
        setLoading(false)
      })
  }, [])

  const handleAddToCart = (product: any) => {
    addItem(product)
    
    // إظهار تنبيه باستخدام Telegram WebApp
    if (launchParams.initData) {
      // عند التشغيل في تيليغرام
      alert(`تم إضافة ${product.name} إلى السلة! 🛒`)
    } else {
      // عند التشغيل محلياً
      alert(`تم إضافة ${product.name} إلى السلة! 🛒`)
    }
  }

  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      maxWidth: '800px', 
      margin: '2rem auto',
      padding: '0 1rem'
    }}>
      {/* معلومات المستخدم */}
      {user && (
        <div style={{
          background: '#f5f5f5',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {user.photoUrl && (
            <img 
              src={user.photoUrl} 
              alt={user.firstName} 
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
          )}
          <div>
            <h3 style={{ margin: 0, color: '#1a73e8' }}>
              مرحباً، {user.firstName} {user.lastName || ''}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
              @{user.username || 'لا يوجد معرف'}
            </p>
          </div>
        </div>
      )}

      {/* شريط السلة */}
      {items.length > 0 && (
        <div style={{
          background: '#4285f4',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>🛒 سلة التسوق:</strong> {items.length} منتج
          </div>
          <div>
            <strong>المجموع:</strong> {getTotal()} ₽
          </div>
          <button 
            onClick={() => {
              if (launchParams.initData) {
                alert('سيتم إرسال الطلب قريباً!')
              } else {
                alert('سيتم إرسال الطلب قريباً!')
              }
            }}
            style={{
              background: '#34a853',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            إتمام الطلب
          </button>
        </div>
      )}

      {/* العنوان */}
      <h1 style={{ textAlign: 'center', color: '#1a73e8', marginBottom: '2rem' }}>
        🛍️ متجر تيليغرام
      </h1>
      
      {/* المنتجات */}
      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>جاري التحميل...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>لا توجد منتجات</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {products.map(p => (
            <div key={p.id} style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '1.2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontSize: '2rem' }}>{p.image}</span>
              <div style={{ flex: 1, marginLeft: '1rem' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{p.name}</h2>
                <p style={{ color: '#e53935', fontWeight: 'bold', margin: 0 }}>
                  {p.price} ₽
                </p>
              </div>
              <button 
                onClick={() => handleAddToCart(p)}
                style={{
                  background: '#4285f4',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#3367d6'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#4285f4'}
              >
                أضف للسلة
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App