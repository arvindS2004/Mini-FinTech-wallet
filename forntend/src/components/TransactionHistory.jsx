import { useState, useMemo } from "react";
import dayjs from "dayjs";
import "./th.css";
export default function TransactionHistory({
  transactions,
  users = [],
  onDelete,
}) {
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (status && t.status !== status) return false;
      if (from && dayjs(t.createdAt).isBefore(dayjs(from), "day")) return false;
      if (to && dayjs(t.createdAt).isAfter(dayjs(to), "day")) return false;
      return true;
    });
  }, [transactions, status, from, to]);

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "WARNING: Deleting this transaction will only remove it from history. " +
        "Your balance will NOT change. Continue?"
    );

    if (confirmed) {
      onDelete(id);
    }
  };

  const userMap = useMemo(() => {
    const map = {};
    users.forEach((u) => {
      map[u.id] = u.name;
    });
    return map;
  }, [users]);

  const grouped = useMemo(() => {
  const result = []
  const feeMap = {}

  filtered.forEach(t => {
    if (t.type === 'fee' && t.transferId) {
      feeMap[t.transferId] = t
    }
  })

  filtered.forEach(t => {
    if (t.type === 'debit') {
      result.push({
        ...t,
        fee: feeMap[t.transferId]
      })
    }
    if (t.type === 'credit') {
      result.push(t)
    }
  })

  return result
}, [filtered])



  return (
    <div>
      

      <div className="filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>

        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="From date"
        />

        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To date"
        />
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">!</span>
          <span>No transactions found</span>
        </div>
      )}
      

     {grouped.map(t => (
  <div key={t.id} className={`tx tx-${t.status}`}>

    <span className="tx-type">

      {t.type === 'credit' && (
        <svg width="14" height="14" viewBox="0 0 24 24" className="credit-arrow">
          <path d="M7 7 L17 17 M17 17 L17 11 M17 17 L11 17" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {t.type === 'debit' && (
        <svg width="14" height="14" viewBox="0 0 24 24" className="nw-arrow">
          <path d="M17 17 L7 7 M7 7 L7 13 M7 7 L13 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {t.type === 'credit' && 'Credit'}
      {t.type === 'debit' && `Transfer to ${userMap[t.recipientId] || 'User'}`}

    </span>

    <span>{t.amount.toFixed(2)}</span>

    <span className={`status-badge ${t.status}`}>
      {t.status}
    </span>

    <span>{dayjs(t.createdAt).format("YYYY-MM-DD HH:mm")}</span>

    <button onClick={() => handleDelete(t.id)}>Delete</button>

    {t.fee && (
      <div className="tx-fee-row">
        <span className="tx-fee-label">Fee</span>
        <span>{t.fee.amount.toFixed(2)}</span>
        {/* <span className={`status-badge ${t.fee.status}`}>
          {t.fee.status}
        </span> */}
      </div>
    )}
  </div>
))}


    </div>
  );
}
