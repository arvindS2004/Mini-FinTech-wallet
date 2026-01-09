import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { api } from './api'
import useConfig from './hooks/configure'
import useTransactions from './hooks/transac'
import { Loading, ErrorState, AddMoney } from './components/Actions'
import './App.css'
import TransferMoney from './components/TransferMoney'
import TransactionHistory from './components/TransactionHistory'

function App() {
  
  const { config, loading: loadingConfig } = useConfig()
  const {
  transactions,
  users,
  loading,
  error,
  balance,
  createTransaction,
  updateStatus,
  softDelete,
  refresh
} = useTransactions()

  const [currentView, setCurrentView] = useState(() => {
  return localStorage.getItem('currentView') || 'dashboard'
})

  const [showBalance, setShowBalance] = useState(false)

  
useEffect(() => {
  localStorage.setItem('currentView', currentView)
}, [currentView])

  const process = async (id, success = true, reason) => {
    await new Promise(r => setTimeout(r, 500))
    if (success) await updateStatus(id, 'success')
    else await updateStatus(id, 'failed', reason)
  }

  const handleAdd = async amount => {
    try {
      const tx = await createTransaction({ type: 'credit', amount })

      toast.info('Processing...')
      await process(tx.id, true)
      refresh()
      toast.success('Money added successfully')
    } catch {
      toast.error('Failed to add money')
    }
  }

 const handleTransfer = async ({ recipientId, amount, fee }) => {
  try {
    const transferId = crypto.randomUUID()

    const debitTx = await createTransaction({
      type: 'debit',
      amount,
      recipientId,
      transferId
    })

    const feeTx = await createTransaction({
      type: 'fee',
      amount: fee,
      recipientId,
      transferId
    })

    await new Promise(r => setTimeout(r, 600))

    const fail = Math.random() < 0.2

    if (fail) {
      await updateStatus(debitTx.id, 'failed', 'Transfer failed')
      await updateStatus(feeTx.id, 'failed', 'Fee reversed')
    } else {
      await updateStatus(debitTx.id, 'success')
      await updateStatus(feeTx.id, 'success')
    }
  } catch {
  }
}



  const handleDelete = async (id) => {
    try {
      await softDelete(id)

      toast.success('Transaction deleted from history')
    } catch (err) {
      toast.error('Failed to delete transaction')
    }
  }

  if (loadingConfig || loading) return <Loading />
  if (error) return <ErrorState message="Failed to load data" />

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-corner"></div>
        <h1>Mini Wallet</h1>
      </header>

      <div className="container reveal">
        {currentView === 'dashboard' && (
          <>
            <div className="welcome-section">
              <h2>Welcome User</h2>
              <button 
                className="check-balance-btn"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? 'Hide Balance' : 'Check Balance'}
              </button>
            </div>

            {showBalance && (
              <div className="balance-display">
                <h3>Current Balance</h3>
                <div className="balance-amount">₹ {balance.toFixed(2)}</div>
              </div>
            )}

            <div className="action-cards">
              <div className="card" onClick={() => setCurrentView('addMoney')}>
                <div className="card-icon">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="35" stroke="white" strokeWidth="4"/>
                    <line x1="40" y1="20" x2="40" y2="60" stroke="white" strokeWidth="4"/>
                    <line x1="20" y1="40" x2="60" y2="40" stroke="white" strokeWidth="4"/>
                  </svg>
                </div>
                <h3>Add Money</h3>
              </div>

              <div className="card" onClick={() => setCurrentView('transfer')}>
                <div className="card-icon">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <path d="M20 50 L50 20 M50 20 L50 40 M50 20 L30 20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Transfer</h3>
              </div>
            </div>

            <div className="dashboard-history">
            <center>  <h2 style={{ marginTop: '5rem', marginBottom: '1rem', fontSize:'30px' }}>Transaction History</h2></center>
              <TransactionHistory 
                transactions={transactions.filter(t => !t.deleted).slice(0, 100)} 
                users={users}
                onDelete={handleDelete} 
              />
            </div>
          </>
        )}

        {currentView === 'addMoney' && (
          <div className="page-view">
            <button className="back-btn" onClick={() => setCurrentView('dashboard')}>
              ← Back
            </button>
            <AddMoney onSubmit={handleAdd} />
          </div>
        )}

        {currentView === 'transfer' && (
          <div className="page-view">
            <button className="back-btn" onClick={() => setCurrentView('dashboard')}>
              ← Back
            </button>
            <TransferMoney 
              users={users} 
              config={config} 
              balance={balance}
              onSubmit={handleTransfer} 
            />
          </div>
        )}
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  )
}

export default App