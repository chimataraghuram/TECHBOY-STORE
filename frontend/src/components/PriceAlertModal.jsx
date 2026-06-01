import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, ArrowRight, Loader2, Target } from 'lucide-react';
import './PriceAlertModal.css';

const PriceAlertModal = ({ isOpen, onClose, product, user, triggerRect }) => {
  // Step 1: Collect Email (if not logged in)
  // Step 2: Configure Alert
  // Step 3: Success
  const [step, setStep] = useState(user ? 2 : 1);
  const [email, setEmail] = useState(user?.email || '');
  const [alertType, setAlertType] = useState('ANY'); // 'ANY' or 'TARGET'
  const [targetPrice, setTargetPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state when opened with a new user/product
  React.useEffect(() => {
    if (isOpen) {
      setStep(user ? 2 : 1);
      setEmail(user?.email || '');
      setAlertType('ANY');
      setTargetPrice('');
      setError('');
    }
  }, [isOpen, user, product]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleGoogleLogin = () => {
    // We mock the google login for now or guide them to standard auth
    // Since Phase 2 says "Continue with Google", we'll just show an error directing them to login via navbar for full experience,
    // OR just use their email.
    alert('Please login via the top right profile icon, or enter your email below.');
  };

  const handleSubmitAlert = async () => {
    if (alertType === 'TARGET' && !targetPrice) {
      setError('Please enter a target price');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const payload = {
        email: email,
        product: product.id,
        product_name: product.name,
        current_price: product.price,
        alert_type: alertType,
        target_price: alertType === 'TARGET' ? parseInt(targetPrice.replace(/\D/g, ''), 10) : null
      };

      const token = localStorage.getItem('techboy_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('http://127.0.0.1:8000/api/alerts/', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to set alert');
      setStep(3);
    } catch (err) {
      setError('Failed to set alert. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  // Calculate dynamic position if triggerRect is provided
  let modalStyle = {};
  if (triggerRect) {
    const modalWidth = 360;
    const modalHeight = 420;
    let left = triggerRect.left - modalWidth - 14;
    let top = triggerRect.top;
    
    if (left < 12) {
      left = triggerRect.right + 14;
    }
    if (left + modalWidth > window.innerWidth) {
      left = window.innerWidth - modalWidth - 12;
    }
    if (left < 12) left = 12;
    if (top + modalHeight > window.innerHeight) {
      top = window.innerHeight - modalHeight - 12;
    }
    if (top < 12) top = 12;

    modalStyle = {
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      width: `${modalWidth}px`,
      margin: 0
    };
  }

  return (
    <AnimatePresence>
      <div className="price-alert-overlay" onClick={onClose}>
        <m.div 
          className="price-alert-modal glass-panel"
          initial={{ opacity: 0, scale: 0.95, y: triggerRect ? 0 : 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: triggerRect ? 0 : 20 }}
          onClick={e => e.stopPropagation()}
          style={modalStyle}
        >
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '24px', pointerEvents: 'none' }}>
            <div className="price-alert-glow" />
          </div>
          
          <button className="price-alert-close" onClick={onClose}>
            <X size={20} />
          </button>

          <div className="price-alert-content">
            {step === 1 && (
              <m.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="price-alert-header">
                  <div className="price-alert-icon">
                    <Bell size={28} />
                  </div>
                  <h3 className="price-alert-title">Stay Updated</h3>
                  <p className="price-alert-desc">Get notified when this phone changes price.</p>
                </div>

                <div className="price-alert-auth-options">
                  <button type="button" className="price-alert-google-btn" onClick={handleGoogleLogin}>
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                  
                  <div className="price-alert-divider">or enter email</div>
                  
                  <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="price-alert-input-group">
                      <input 
                        type="email" 
                        className="price-alert-input" 
                        placeholder="you@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {error && <div className="price-alert-error">{error}</div>}
                    <button type="submit" className="price-alert-btn">
                      Continue <ArrowRight size={18} />
                    </button>
                  </form>
                </div>
              </m.div>
            )}

            {step === 2 && (
              <m.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="price-alert-header">
                  <h3 className="price-alert-title">Configure Alert</h3>
                  <p className="price-alert-desc">How should we notify you at {email}?</p>
                </div>

                <div className="price-alert-product-summary">
                  <img src={product.image} alt={product.name} className="price-alert-product-image" />
                  <div className="price-alert-product-info">
                    <h4>{product.name}</h4>
                    <p>₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="price-alert-options">
                  <div 
                    className={`price-alert-option ${alertType === 'ANY' ? 'selected' : ''}`}
                    onClick={() => setAlertType('ANY')}
                  >
                    <input type="radio" className="price-alert-option-radio" checked={alertType === 'ANY'} readOnly />
                    <div className="price-alert-option-content">
                      <h5>Notify me on any change</h5>
                      <p>We'll email you whenever the price drops or increases.</p>
                    </div>
                  </div>

                  <div 
                    className={`price-alert-option ${alertType === 'TARGET' ? 'selected' : ''}`}
                    onClick={() => setAlertType('TARGET')}
                  >
                    <input type="radio" className="price-alert-option-radio" checked={alertType === 'TARGET'} readOnly />
                    <div className="price-alert-option-content">
                      <h5>Notify me at target price</h5>
                      <p>Set a specific price goal for this device.</p>
                      
                      <AnimatePresence>
                        {alertType === 'TARGET' && (
                          <m.div 
                            className="price-alert-target-input"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onClick={e => e.stopPropagation()}
                          >
                            <label>Target Price</label>
                            <div style={{ position: 'relative' }}>
                              <span className="input-prefix">₹</span>
                              <input 
                                type="number" 
                                className="price-alert-input" 
                                placeholder="e.g. 22999"
                                value={targetPrice}
                                onChange={(e) => setTargetPrice(e.target.value)}
                              />
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {error && <div className="price-alert-error" style={{ marginBottom: '16px' }}>{error}</div>}
                
                <button 
                  className="price-alert-btn" 
                  style={{ width: '100%' }}
                  onClick={handleSubmitAlert}
                  disabled={loading}
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <><Target size={18} /> Create Alert</>}
                </button>
              </m.div>
            )}

            {step === 3 && (
              <m.div
                className="price-alert-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="price-alert-success-icon">
                  <Check size={32} />
                </div>
                <h3>Alert Created Successfully</h3>
                <p>We will notify you at <strong>{email}</strong> when the price {alertType === 'ANY' ? 'changes.' : `reaches ₹${targetPrice}.`}</p>
                <button className="price-alert-btn" style={{ width: '100%', marginTop: '24px' }} onClick={onClose}>
                  Done
                </button>
              </m.div>
            )}
          </div>
        </m.div>
      </div>
    </AnimatePresence>
  );
};

export default PriceAlertModal;
