import React, { useState, useEffect } from 'react';
import { 
  Shield, Smartphone, Wallet, RefreshCw, CheckCircle, 
  Copy, Lock, ArrowRight, Globe, Layers, DollarSign, 
  HelpCircle, AlertCircle, LogOut, Check, ChevronRight, Menu, X, Zap
} from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('landing'); // landing, dashboard, deposit, admin
  const [authMode, setAuthMode] = useState('login'); // login, register
  
  // User Profile State
  const [user, setUser] = useState({
    email: 'user@sms-synclive.com',
    balance: 1500.00
  });

  // Admin State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);

  // Deposit State
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('Moniepoint MFB');
  const [senderName, setSenderName] = useState('');
  const [reference, setReference] = useState('');
  const [depositSuccess, setDepositSuccess] = useState(false);

  // Active Orders / Numbers State
  const [selectedService, setSelectedService] = useState('WhatsApp');
  const [selectedCountry, setSelectedCountry] = useState('Nigeria (+234)');
  const [activeActivation, setActiveActivation] = useState(null);
  const [timer, setTimer] = useState(900); // 15 mins
  const [copied, setCopied] = useState(false);

  // Pending Deposits (Admin Ledger)
  const [pendingDeposits, setPendingDeposits] = useState([
    { id: 1, email: 'client1@gmail.com', amount: 5000, bank: 'Moniepoint MFB', sender: 'Oluwaseun Ade', ref: '99882211', time: '10:45 AM' },
    { id: 2, email: 'chinedu.dev@yahoo.com', amount: 2000, bank: 'OPay', sender: 'Chinedu Okafor', ref: '44332211', time: '11:15 AM' }
  ]);

  useEffect(() => {
    let interval;
    if (activeActivation && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeActivation, timer]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuyNumber = () => {
    if (user.balance < 500) {
      alert("Insufficient balance! Please fund your wallet via bank transfer.");
      setActiveTab('deposit');
      return;
    }
    setUser(prev => ({ ...prev, balance: prev.balance - 500 }));
    setActiveActivation({
      id: Math.floor(Math.random() * 100000),
      number: '+234 912 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(100 + Math.random() * 900),
      service: selectedService,
      code: null,
      status: 'Waiting for SMS...'
    });
    setTimer(900);
  };

  const simulateOtpArrival = () => {
    if (!activeActivation) return;
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveActivation(prev => ({
      ...prev,
      code: randomOtp,
      status: 'SMS Received!'
    }));
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!depositAmount || !senderName || !reference) {
      alert("Please fill in all payment confirmation fields.");
      return;
    }
    setDepositSuccess(true);
    setTimeout(() => {
      setDepositSuccess(false);
      setDepositAmount('');
      setSenderName('');
      setReference('');
    }, 4000);
  };

  const verifyOwnerPin = (e) => {
    e.preventDefault();
    if (adminPinInput === '889900') {
      setIsAdminUnlocked(true);
      setShowPinModal(false);
      setActiveTab('admin');
      setAdminPinInput('');
    } else {
      alert("Invalid Security PIN!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* HEADER / NAVIGATION */}
      <header className="border-b border-slate-800 bg-[#0B0F17]/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab(isLoggedIn ? 'dashboard' : 'landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Smartphone className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">SMS-SYNCLIVE</span>
            <span className="block text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Secure Verification Engine</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <button 
                onClick={() => { setAuthMode('login'); setActiveTab('dashboard'); }}
                className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthMode('register'); setActiveTab('dashboard'); setIsLoggedIn(true); }}
                className="text-sm font-semibold bg-cyan-500 text-black hover:bg-cyan-400 px-5 py-2 rounded-xl transition shadow-lg shadow-cyan-500/20"
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <div 
                onClick={() => setActiveTab('deposit')}
                className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center space-x-2 cursor-pointer hover:border-cyan-500/50 transition"
              >
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-mono font-bold text-cyan-300">₦{user.balance.toLocaleString()}</span>
                <span className="bg-cyan-500/10 text-cyan-400 text-xs px-2 py-0.5 rounded-md font-semibold">+ Top Up</span>
              </div>

              <button 
                onClick={() => setShowPinModal(true)}
                className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-slate-400 hover:text-cyan-400 transition"
                title="Owner Admin Console"
              >
                <Lock className="w-4 h-4" />
              </button>

              <button 
                onClick={() => { setIsLoggedIn(false); setActiveTab('landing'); }}
                className="text-slate-400 hover:text-red-400 p-2 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN VIEW CONTROLLER */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* 1. LANDING PAGE */}
        {!isLoggedIn && activeTab === 'landing' && (
          <div className="space-y-20 py-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full text-cyan-400 text-xs font-mono">
                <Shield className="w-3.5 h-3.5" />
                <span>Next-Gen Private OTP & SMS Routing Hub</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Instant Virtual Numbers for <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Global Verifications</span>
              </h1>
              <p className="text-slate-400 text-lg">
                Bypass geo-restrictions and secure your accounts on WhatsApp, Telegram, OpenAI, Fiverr, and 500+ platforms instantly with live SMS delivery.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button 
                  onClick={() => { setIsLoggedIn(true); setActiveTab('dashboard'); }}
                  className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold px-8 py-4 rounded-xl text-base flex items-center space-x-2 transition shadow-xl shadow-cyan-500/20"
                >
                  <span>Launch Client Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 pt-10">
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Lightning Fast Delivery</h3>
                <p className="text-slate-400 text-sm">Real-time upstream polling ensures your verification codes arrive within seconds.</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">100% Private & Secure</h3>
                <p className="text-slate-400 text-sm">Strict anonymity protocols. Numbers expire securely after use with automated refunds.</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Easy Local Funding</h3>
                <p className="text-slate-400 text-sm">Instant wallet crediting via OPay & Moniepoint transfer with dedicated automated approval.</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. AUTHENTICATION MODAL / VIEW */}
        {!isLoggedIn && activeTab === 'dashboard' && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl mt-10 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-sm text-slate-400">Access your private virtual number dashboard</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-mono uppercase">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user.email} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-mono uppercase">Password</label>
                <input 
                  type="password" 
                  defaultValue="••••••••" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button 
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3.5 rounded-xl transition shadow-lg shadow-cyan-500/20"
              >
                {authMode === 'login' ? 'Sign In to Portal' : 'Register Account'}
              </button>
            </div>

            <div className="text-center">
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-xs text-cyan-400 hover:underline"
              >
                {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        )}

        {/* 3. CLIENT DASHBOARD */}
        {isLoggedIn && activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex border-b border-slate-800 space-x-6">
              <button className="pb-3 border-b-2 border-cyan-500 text-cyan-400 font-semibold text-sm flex items-center space-x-2">
                <Smartphone className="w-4 h-4" />
                <span>Order Virtual Number</span>
              </button>
              <button onClick={() => setActiveTab('deposit')} className="pb-3 border-b-2 border-transparent text-slate-400 hover:text-slate-200 font-semibold text-sm flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span>Fund Wallet (OPay / Moniepoint)</span>
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Column: Number Order Configurator */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <span>Select Service & Country</span>
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-mono uppercase">Target Service</label>
                    <select 
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none focus:border-cyan-500"
                    >
                      <option>WhatsApp</option>
                      <option>Telegram</option>
                      <option>OpenAI / ChatGPT</option>
                      <option>Fiverr</option>
                      <option>TikTok</option>
                      <option>1xBet</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-mono uppercase">Country Code</label>
                    <select 
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none focus:border-cyan-500"
                    >
                      <option>Nigeria (+234)</option>
                      <option>United States (+1)</option>
                      <option>United Kingdom (+44)</option>
                      <option>Canada (+1)</option>
                      <option>Ghana (+233)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Activation Cost</span>
                    <span className="text-xl font-mono font-bold text-cyan-400">₦500.00</span>
                  </div>
                  <button 
                    onClick={handleBuyNumber}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 flex items-center space-x-2"
                  >
                    <span>Get Number Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Active Activation Live Inbox */}
                {activeActivation && (
                  <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-mono uppercase text-cyan-400 flex items-center space-x-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Active Session: {activeActivation.service}</span>
                      </span>
                      <span className="text-xs font-mono bg-slate-900 px-3 py-1 rounded-full text-slate-300">
                        Expires in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Assigned Virtual Number</span>
                        <span className="text-2xl font-mono font-bold tracking-wider text-white">{activeActivation.number}</span>
                      </div>
                      <button 
                        onClick={() => handleCopy(activeActivation.number)}
                        className="bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
                      >
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center space-y-2">
                      <span className="text-xs text-slate-400 uppercase tracking-widest block">Incoming Verification Code (OTP)</span>
                      <div className="text-3xl font-mono font-black tracking-widest text-cyan-300">
                        {activeActivation.code ? activeActivation.code : 'Waiting for SMS...'}
                      </div>
                      {!activeActivation.code && (
                        <button 
                          onClick={simulateOtpArrival}
                          className="text-xs text-cyan-400 hover:underline pt-1 block mx-auto font-mono"
                        >
                          [Simulate Incoming SMS Test]
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Account Stats & Guidelines */}
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Account Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm border-b border-slate-800/60 pb-2">
                      <span className="text-slate-400">Logged User</span>
                      <span className="font-mono text-slate-200">{user.email}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-slate-800/60 pb-2">
                      <span className="text-slate-400">Wallet Balance</span>
                      <span className="font-mono text-cyan-400 font-bold">₦{user.balance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Total Numbers Used</span>
                      <span className="font-mono text-slate-200">12</span>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 space-y-3">
                  <h4 className="text-sm font-bold text-cyan-400 flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>Quick Tip</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    If an SMS code does not arrive within 3 minutes, cancel the activation. Your funds will be automatically refunded to your wallet balance instantly.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 4. OPAY & MONIEPOINT DEPOSIT FUNDING TAB */}
        {activeTab === 'deposit' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
              <div>
                <h3 className="text-2xl font-bold">Fund Wallet via Bank Transfer</h3>
                <p className="text-sm text-slate-400 mt-1">Transfer to either of the official accounts below under the name <span className="text-cyan-400 font-bold">Oluwapelumi Olawale</span>, then submit your payment details.</p>
              </div>

              {/* Account Selection Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* OPay Card */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold block">OPay Bank</span>
                  <div className="text-lg font-mono font-black text-white">9032073988</div>
                  <button 
                    onClick={() => handleCopy('9032073988')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
                  >
                    <Copy className="w-3 h-3 text-cyan-400" />
                    <span>Copy OPay</span>
                  </button>
                </div>

                {/* Moniepoint Card */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">Moniepoint MFB</span>
                  <div className="text-lg font-mono font-black text-white">8102425736</div>
                  <button 
                    onClick={() => handleCopy('8102425736')}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-1.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Moniepoint</span>
                  </button>
                </div>
              </div>

              <div className="text-xs text-center text-slate-400">
                Account Name for both banks: <span className="text-slate-200 font-bold">Oluwapelumi Olawale</span>
              </div>

              {/* Deposit Proof Form */}
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-mono uppercase">Select Bank Paid To</label>
                  <select 
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option>Moniepoint MFB (8102425736)</option>
                    <option>OPay (9032073988)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-mono uppercase">Amount Paid (₦)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 5000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-mono uppercase">Sender Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Oluwaseun Ade"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-mono uppercase">Transaction Reference / RRN</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 99882211"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3.5 rounded-xl transition shadow-lg shadow-cyan-500/20"
                >
                  I Have Made Transfer (Submit Proof)
                </button>
              </form>

              {depositSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-400 text-center text-sm font-semibold flex items-center justify-center space-x-2 animate-fadeIn">
                  <CheckCircle className="w-5 h-5" />
                  <span>Deposit proof submitted successfully! Awaiting owner confirmation.</span>
                </div>
              )}

              <div className="text-center">
                <button 
                  onClick={() => setActiveTab(isLoggedIn ? 'dashboard' : 'landing')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. HIDDEN OWNER ADMIN CONSOLE (PIN: 889900) */}
        {activeTab === 'admin' && isAdminUnlocked && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-2xl font-bold flex items-center space-x-2">
                  <Lock className="w-6 h-6 text-cyan-400" />
                  <span>Owner Admin Control Panel</span>
                </h3>
                <p className="text-sm text-slate-400">Manage client deposits and bank configurations</p>
              </div>
              <button 
                onClick={() => { setIsAdminUnlocked(false); setActiveTab('dashboard'); }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                Lock Admin Console
              </button>
            </div>

            {/* Pending Deposits Ledger */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-lg font-bold">Pending Bank Deposits (OPay & Moniepoint)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono uppercase">
                      <th className="pb-3">Client Email</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Bank</th>
                      <th className="pb-3">Sender Name</th>
                      <th className="pb-3">Reference</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {pendingDeposits.map((dep) => (
                      <tr key={dep.id}>
                        <td className="py-3 font-mono text-slate-300">{dep.email}</td>
                        <td className="py-3 font-mono text-cyan-400 font-bold">₦{dep.amount.toLocaleString()}</td>
                        <td className="py-3 text-slate-300 font-semibold">{dep.bank}</td>
                        <td className="py-3">{dep.sender}</td>
                        <td className="py-3 font-mono text-slate-400">{dep.ref}</td>
                        <td className="py-3 text-right space-x-2">
                          <button 
                            onClick={() => {
                              setUser(prev => ({ ...prev, balance: prev.balance + dep.amount }));
                              setPendingDeposits(prev => prev.filter(d => d.id !== dep.id));
                              alert(`Approved ₦${dep.amount} for ${dep.email}!`);
                            }}
                            className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black px-3 py-1.5 rounded-lg text-xs font-bold transition"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => setPendingDeposits(prev => prev.filter(d => d.id !== dep.id))}
                            className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                          >
                            Decline
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pendingDeposits.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-slate-500">No pending deposit proofs right now.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* OWNER PIN MODAL POPUP */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="text-center space-y-1">
              <Lock className="w-8 h-8 text-cyan-400 mx-auto" />
              <h3 className="text-lg font-bold">Enter Owner Security PIN</h3>
              <p className="text-xs text-slate-400">Restricted access for platform administrators</p>
            </div>

            <form onSubmit={verifyOwnerPin} className="space-y-4">
              <input 
                type="password" 
                maxLength="6"
                placeholder="Enter 6-digit PIN"
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest focus:outline-none focus:border-cyan-500"
                autoFocus
                required
              />
              <div className="flex space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowPinModal(false)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-sm font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-cyan-500 hover:bg-cyan-400 text-black py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
