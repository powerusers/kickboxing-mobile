import { useState, useEffect, useCallback } from "react";

// --- Data Store ---
const generateId = () => Math.random().toString(36).substr(2, 9);

const initialStudents = [
  { id: "s1", name: "Arjun Mehta", email: "arjun@mail.com", phone: "9876543210", belt: "Yellow", age: 22, weight: "68kg", joinDate: "2024-06-15", status: "approved", avatar: "AM", fee: { amount: 2500, status: "completed", dueDate: "2025-03-01", history: [{ month: "Jan 2025", status: "completed", paidOn: "2025-01-05" }, { month: "Feb 2025", status: "completed", paidOn: "2025-02-03" }] }, competitions: ["c1"], wins: 3, losses: 1, rank: 2 },
  { id: "s2", name: "Priya Sharma", email: "priya@mail.com", phone: "9876543211", belt: "Green", age: 19, weight: "55kg", joinDate: "2024-09-01", status: "approved", avatar: "PS", fee: { amount: 2500, status: "pending", dueDate: "2025-03-01", history: [{ month: "Jan 2025", status: "completed", paidOn: "2025-01-10" }, { month: "Feb 2025", status: "pending", paidOn: null }] }, competitions: ["c1", "c2"], wins: 5, losses: 0, rank: 1 },
  { id: "s3", name: "Rahul Verma", email: "rahul@mail.com", phone: "9876543212", belt: "White", age: 25, weight: "75kg", joinDate: "2025-01-10", status: "pending", avatar: "RV", fee: { amount: 2500, status: "pending", dueDate: "2025-03-01", history: [] }, competitions: [], wins: 0, losses: 0, rank: 0 },
  { id: "s4", name: "Sneha Patil", email: "sneha@mail.com", phone: "9876543213", belt: "Orange", age: 21, weight: "60kg", joinDate: "2024-08-20", status: "approved", avatar: "SP", fee: { amount: 2500, status: "overdue", dueDate: "2025-02-01", history: [{ month: "Jan 2025", status: "overdue", paidOn: null }, { month: "Feb 2025", status: "overdue", paidOn: null }] }, competitions: ["c2"], wins: 2, losses: 2, rank: 4 },
  { id: "s5", name: "Vikram Singh", email: "vikram@mail.com", phone: "9876543214", belt: "Yellow", age: 28, weight: "82kg", joinDate: "2024-07-05", status: "approved", avatar: "VS", fee: { amount: 2500, status: "completed", dueDate: "2025-03-01", history: [{ month: "Jan 2025", status: "completed", paidOn: "2025-01-02" }, { month: "Feb 2025", status: "completed", paidOn: "2025-02-01" }] }, competitions: ["c1"], wins: 4, losses: 1, rank: 3 },
];

const initialCompetitions = [
  { id: "c1", name: "Academy Championship 2025", date: "2025-03-15", venue: "City Sports Arena", category: "All Belts", status: "open", maxParticipants: 32, registeredStudents: ["s1", "s2", "s5"], results: [], description: "Annual academy-wide championship open to all belt levels." },
  { id: "c2", name: "Inter-Academy Sparring", date: "2025-02-10", venue: "District Sports Complex", category: "Green Belt+", status: "completed", maxParticipants: 16, registeredStudents: ["s2", "s4"], results: [{ position: 1, studentId: "s2", studentName: "Priya Sharma" }, { position: 2, studentId: "s4", studentName: "Sneha Patil" }], description: "Friendly inter-academy sparring event." },
  { id: "c3", name: "State Kickboxing Open", date: "2025-05-20", venue: "State Stadium", category: "Yellow Belt+", status: "upcoming", maxParticipants: 64, registeredStudents: [], results: [], description: "State level open competition. Registration opens soon." },
];

const initialNotifications = [
  { id: "n1", to: "all", message: "Academy Championship 2025 registrations are now open!", date: "2025-02-15", read: false },
  { id: "n2", to: "s4", message: "Your fee payment is overdue. Please clear dues.", date: "2025-02-18", read: false },
  { id: "n3", to: "all", message: "Congratulations to Priya Sharma for winning Inter-Academy Sparring!", date: "2025-02-11", read: true },
];

// --- Icons ---
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
    money: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    profile: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    rank: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    fist: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v3"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    award: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18.5 2.5 2.5 2.5L12 14l-4 1 1-4 9-9z"/></svg>,
    arrowLeft: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  };
  return icons[name] || null;
};

// --- Belt Colors ---
const beltColors = {
  White: { bg: "#f5f5f5", text: "#333", border: "#ddd" },
  Yellow: { bg: "#FFF3CD", text: "#856404", border: "#FFD93D" },
  Orange: { bg: "#FFE0CC", text: "#C44900", border: "#FF8C42" },
  Green: { bg: "#D4EDDA", text: "#155724", border: "#48BF84" },
  Blue: { bg: "#CCE5FF", text: "#004085", border: "#4D96FF" },
  Brown: { bg: "#E8D5C4", text: "#5C3317", border: "#A0522D" },
  Black: { bg: "#333", text: "#fff", border: "#000" },
};

const feeBadge = {
  completed: { bg: "#D4EDDA", text: "#155724", label: "Paid" },
  pending: { bg: "#FFF3CD", text: "#856404", label: "Pending" },
  overdue: { bg: "#F8D7DA", text: "#721C24", label: "Overdue" },
};

// --- CSS ---
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --bg-dark: #0A0A0F;
  --bg-card: #13131A;
  --bg-card-hover: #1A1A24;
  --bg-input: #1A1A24;
  --border: #2A2A35;
  --border-light: #333340;
  --text-primary: #EAEAEF;
  --text-secondary: #8888A0;
  --text-muted: #55556A;
  --accent: #FF3D3D;
  --accent-glow: rgba(255, 61, 61, 0.15);
  --accent-hover: #FF5252;
  --accent-gold: #FFD93D;
  --accent-green: #48BF84;
  --accent-blue: #4D96FF;
  --accent-orange: #FF8C42;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 4px 24px rgba(0,0,0,0.3);
}

* { margin:0; padding:0; box-sizing:border-box; }

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg-dark);
  color: var(--text-primary);
  min-height: 100vh;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: transform 0.3s ease;
}

.sidebar-brand {
  padding: 24px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--accent), #FF6B35);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 4px 16px var(--accent-glow);
}

.brand-text h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  letter-spacing: 2px;
  color: var(--text-primary);
  line-height: 1;
}

.brand-text span {
  font-size: 11px;
  color: var(--text-secondary);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.nav-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-muted);
  padding: 16px 12px 8px;
  font-weight: 600;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.nav-item:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--accent-glow);
  color: var(--accent);
}

.nav-item.active svg { stroke: var(--accent); }

.nav-badge {
  margin-left: auto;
  background: var(--accent);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid var(--border);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.user-meta { flex: 1; min-width: 0; }
.user-meta h4 { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-meta span { font-size: 11px; color: var(--text-muted); text-transform: capitalize; }

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 0;
  min-height: 100vh;
}

.page-header {
  padding: 28px 36px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-card);
  position: sticky;
  top: 0;
  z-index: 50;
}

.page-header h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  letter-spacing: 2px;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 13px;
  margin-top: 4px;
}

.page-body {
  padding: 28px 36px;
}

/* Cards */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: all 0.2s;
}

.stat-card:hover {
  border-color: var(--border-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.stat-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 32px;
  letter-spacing: 1px;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Table */
.data-table-wrap {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 24px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.table-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.table-scroll { overflow-x: auto; }

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px 16px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

td {
  padding: 14px 16px;
  font-size: 14px;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

tr:last-child td { border-bottom: none; }

tr:hover td { background: var(--bg-card-hover); }

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  gap: 4px;
}

.belt-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: 'DM Sans', sans-serif;
}

.btn-primary {
  background: var(--accent);
  color: white;
  box-shadow: 0 2px 12px var(--accent-glow);
}

.btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }

.btn-secondary {
  background: var(--bg-input);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover { border-color: var(--border-light); }

.btn-sm { padding: 6px 12px; font-size: 12px; }

.btn-icon {
  width: 34px;
  height: 34px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover { border-color: var(--accent); color: var(--accent); }

.btn-approve { background: #155724; color: #D4EDDA; }
.btn-approve:hover { background: #1e7e34; }
.btn-reject { background: #721C24; color: #F8D7DA; }
.btn-reject:hover { background: #a71d2a; }

/* Forms */
.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.2s;
  outline: none;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--accent);
}

.form-select { cursor: pointer; }
.form-select option { background: var(--bg-card); }
.form-textarea { min-height: 80px; resize: vertical; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: var(--shadow);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.modal-header h3 { font-size: 18px; font-weight: 600; }

.modal-body { padding: 24px; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}

/* Notifications */
.notif-list { display: flex; flex-direction: column; gap: 8px; }

.notif-item {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  align-items: flex-start;
}

.notif-item.unread { border-left: 3px solid var(--accent); }

.notif-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  margin-top: 6px;
  flex-shrink: 0;
}

.notif-content { flex: 1; }
.notif-content p { font-size: 14px; line-height: 1.5; }
.notif-content span { font-size: 12px; color: var(--text-muted); }

/* Competition card */
.comp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.comp-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: all 0.2s;
}

.comp-card:hover { border-color: var(--border-light); transform: translateY(-2px); box-shadow: var(--shadow); }

.comp-card-banner {
  height: 6px;
  width: 100%;
}

.comp-card-body {
  padding: 20px;
}

.comp-card-body h4 { font-size: 16px; font-weight: 700; margin-bottom: 6px; }

.comp-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 12px 0;
}

.comp-meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.comp-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1px solid var(--border);
}

.comp-status {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Rank board */
.rank-list { display: flex; flex-direction: column; gap: 8px; }

.rank-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.rank-item:hover { border-color: var(--border-light); }

.rank-pos {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 20px;
  flex-shrink: 0;
}

.rank-info { flex: 1; }
.rank-info h4 { font-size: 14px; font-weight: 600; }
.rank-info span { font-size: 12px; color: var(--text-secondary); }

.rank-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
}

.rank-stats span { color: var(--text-secondary); }
.rank-stats strong { color: var(--text-primary); }

/* Profile */
.profile-header {
  display: flex;
  gap: 24px;
  align-items: center;
  padding: 28px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 24px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 32px;
  color: white;
  flex-shrink: 0;
}

.profile-details h3 { font-size: 24px; font-weight: 700; }
.profile-details p { color: var(--text-secondary); font-size: 14px; margin-top: 4px; }

.profile-stats-row {
  display: flex;
  gap: 24px;
  margin-top: 12px;
}

.profile-stat {
  text-align: center;
}

.profile-stat-val {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
}

.profile-stat-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.info-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
}

.info-card label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 6px;
}

.info-card p { font-size: 15px; font-weight: 500; }

/* Login */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-dark);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-bg-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.15;
}

.login-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  position: relative;
  z-index: 1;
  box-shadow: var(--shadow);
}

.login-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.login-brand h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  letter-spacing: 3px;
}

.login-card h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 6px;
}

.login-card p {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 28px;
}

.login-form { text-align: left; }

.role-toggle {
  display: flex;
  background: var(--bg-input);
  border-radius: var(--radius-sm);
  padding: 4px;
  margin-bottom: 24px;
  border: 1px solid var(--border);
}

.role-btn {
  flex: 1;
  padding: 10px;
  text-align: center;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: none;
  color: var(--text-secondary);
  font-family: 'DM Sans', sans-serif;
}

.role-btn.active {
  background: var(--accent);
  color: white;
  box-shadow: 0 2px 8px var(--accent-glow);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--bg-card);
  border: 1px solid var(--accent);
  border-radius: var(--radius);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  z-index: 2000;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  animation: slideUp 0.3s ease;
}

.toast-success { border-color: var(--accent-green); }
.toast-success .toast-icon { color: var(--accent-green); }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--border-light); }

/* Animation */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Responsive */
@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .main-content { margin-left: 0; }
  .page-header, .page-body { padding-left: 20px; padding-right: 20px; }
  .stat-grid { grid-template-columns: 1fr 1fr; }
  .comp-grid { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .profile-header { flex-direction: column; text-align: center; }
  .mobile-menu-btn { display: flex !important; }
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 200;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: var(--text-muted);
}

.empty-state svg { margin-bottom: 12px; opacity: 0.3; }
.empty-state p { font-size: 14px; }

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  padding: 8px 14px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  width: 200px;
}

.search-input:focus { border-color: var(--accent); }
.search-input::placeholder { color: var(--text-muted); }

.detail-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 6px 0;
  border: none;
  background: none;
  font-family: 'DM Sans', sans-serif;
  transition: color 0.2s;
}

.detail-back:hover { color: var(--accent); }

.fee-history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
}

.fee-history-item:last-child { border-bottom: none; }
`;

// --- App ---
export default function KickboxingApp() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState(initialStudents);
  const [competitions, setCompetitions] = useState(initialCompetitions);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedComp, setSelectedComp] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Login state
  const [loginRole, setLoginRole] = useState("student");
  const [loginEmail, setLoginEmail] = useState("");

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const currentStudent = user?.role === "student" ? students.find(s => s.id === user.id) : null;

  // ---------- Login ----------
  if (!user) {
    return (
      <>
        <style>{styles}</style>
        <div className="login-container">
          <div className="login-bg-glow" style={{ background: "var(--accent)", top: "-100px", left: "-100px" }} />
          <div className="login-bg-glow" style={{ background: "var(--accent-gold)", bottom: "-100px", right: "-100px" }} />
          <div className="login-card">
            <div className="login-brand">
              <div className="brand-icon"><Icon name="fist" size={24} /></div>
              <h1>STRIKEFORCE</h1>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to your kickboxing academy portal</p>
            <div className="login-form">
              <div className="role-toggle">
                <button className={`role-btn ${loginRole === "student" ? "active" : ""}`} onClick={() => setLoginRole("student")}>Student</button>
                <button className={`role-btn ${loginRole === "trainer" ? "active" : ""}`} onClick={() => setLoginRole("trainer")}>Trainer</button>
              </div>
              {loginRole === "trainer" ? (
                <>
                  <div className="form-group">
                    <label>Trainer Code</label>
                    <input className="form-input" type="password" placeholder="Enter trainer code" defaultValue="admin" />
                  </div>
                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => { setUser({ role: "trainer", name: "Coach Raj", id: "trainer1" }); setCurrentPage("dashboard"); }}>
                    Sign In as Trainer
                  </button>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Email</label>
                    <input className="form-input" type="email" placeholder="Enter your email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                  </div>
                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => {
                    const found = students.find(s => s.email === loginEmail);
                    if (found) { setUser({ role: "student", name: found.name, id: found.id }); setCurrentPage("dashboard"); }
                    else { showToast("Email not found. Try: arjun@mail.com", "error"); }
                  }}>Sign In as Student</button>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 16, textAlign: "center" }}>
                    New here? <span style={{ color: "var(--accent)", cursor: "pointer" }} onClick={() => setModal("register")}>Register now</span>
                  </p>
                </>
              )}
            </div>
          </div>
          {modal === "register" && <RegisterModal students={students} setStudents={setStudents} close={() => setModal(null)} showToast={showToast} />}
          {toast && <div className={`toast toast-${toast.type}`}><span className="toast-icon"><Icon name="check" size={16} /></span>{toast.msg}</div>}
        </div>
      </>
    );
  }

  const isTrainer = user.role === "trainer";
  const pendingCount = students.filter(s => s.status === "pending").length;
  const overdueCount = students.filter(s => s.fee.status === "overdue" && s.status === "approved").length;
  const unreadNotifs = notifications.filter(n => !n.read && (n.to === "all" || n.to === user.id)).length;

  const navItems = isTrainer ? [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "students", icon: "users", label: "Students", badge: pendingCount || null },
    { id: "competitions", icon: "trophy", label: "Competitions" },
    { id: "fees", icon: "money", label: "Fees", badge: overdueCount || null },
    { id: "rankings", icon: "rank", label: "Rankings" },
    { id: "notifications", icon: "bell", label: "Notifications" },
  ] : [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "competitions", icon: "trophy", label: "Competitions" },
    { id: "rankings", icon: "rank", label: "Rankings" },
    { id: "fees", icon: "money", label: "My Fees" },
    { id: "notifications", icon: "bell", label: "Notifications", badge: unreadNotifs || null },
    { id: "profile", icon: "profile", label: "My Profile" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-brand">
            <div className="brand-icon"><Icon name="fist" size={22} /></div>
            <div className="brand-text"><h1>STRIKEFORCE</h1><span>Academy Portal</span></div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-label">Menu</div>
            {navItems.map(item => (
              <button key={item.id} className={`nav-item ${currentPage === item.id ? "active" : ""}`} onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); setSelectedStudent(null); setSelectedComp(null); }}>
                <Icon name={item.icon} size={18} />
                {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar" style={{ background: isTrainer ? "linear-gradient(135deg, var(--accent), #FF6B35)" : "linear-gradient(135deg, var(--accent-blue), #7B61FF)", color: "white" }}>
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="user-meta">
                <h4>{user.name}</h4>
                <span>{user.role}</span>
              </div>
            </div>
            <button className="nav-item" style={{ marginTop: 4 }} onClick={() => { setUser(null); setLoginEmail(""); setCurrentPage("dashboard"); }}>
              <Icon name="logout" size={18} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="main-content">
          {currentPage === "dashboard" && <DashboardPage isTrainer={isTrainer} students={students} competitions={competitions} currentStudent={currentStudent} setCurrentPage={setCurrentPage} />}
          {currentPage === "students" && isTrainer && <StudentsPage students={students} setStudents={setStudents} selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} showToast={showToast} searchText={searchText} setSearchText={setSearchText} competitions={competitions} />}
          {currentPage === "competitions" && <CompetitionsPage competitions={competitions} setCompetitions={setCompetitions} students={students} setStudents={setStudents} isTrainer={isTrainer} currentStudent={currentStudent} modal={modal} setModal={setModal} showToast={showToast} selectedComp={selectedComp} setSelectedComp={setSelectedComp} />}
          {currentPage === "fees" && <FeesPage isTrainer={isTrainer} students={students} setStudents={setStudents} currentStudent={currentStudent} showToast={showToast} />}
          {currentPage === "rankings" && <RankingsPage students={students} />}
          {currentPage === "notifications" && <NotificationsPage notifications={notifications} setNotifications={setNotifications} userId={user.id} isTrainer={isTrainer} students={students} showToast={showToast} modal={modal} setModal={setModal} />}
          {currentPage === "profile" && !isTrainer && <ProfilePage student={currentStudent} setModal={setModal} />}
        </main>
      </div>
      {modal === "register" && <RegisterModal students={students} setStudents={setStudents} close={() => setModal(null)} showToast={showToast} />}
      {modal === "editProfile" && <EditProfileModal student={currentStudent} students={students} setStudents={setStudents} close={() => setModal(null)} showToast={showToast} />}
      {toast && <div className={`toast toast-${toast.type}`}><span className="toast-icon"><Icon name="check" size={16} /></span>{toast.msg}</div>}
    </>
  );
}

// ---------- Pages ----------

function DashboardPage({ isTrainer, students, competitions, currentStudent, setCurrentPage }) {
  const approved = students.filter(s => s.status === "approved");
  const pending = students.filter(s => s.status === "pending");
  const overdue = approved.filter(s => s.fee.status === "overdue");
  const upcoming = competitions.filter(c => c.status === "open" || c.status === "upcoming");

  if (isTrainer) {
    return (
      <>
        <div className="page-header"><h2>Dashboard</h2><p>Overview of your academy</p></div>
        <div className="page-body">
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}><Icon name="users" /></div>
              <div className="stat-value">{approved.length}</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "rgba(255,217,61,0.12)", color: "var(--accent-gold)" }}><Icon name="clock" /></div>
              <div className="stat-value">{pending.length}</div>
              <div className="stat-label">Pending Requests</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "rgba(72,191,132,0.12)", color: "var(--accent-green)" }}><Icon name="trophy" /></div>
              <div className="stat-value">{upcoming.length}</div>
              <div className="stat-label">Upcoming Events</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "rgba(255,61,61,0.12)", color: "var(--accent)" }}><Icon name="money" /></div>
              <div className="stat-value">{overdue.length}</div>
              <div className="stat-label">Overdue Payments</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="data-table-wrap">
              <div className="table-header"><h3>Recent Registrations</h3></div>
              <div className="table-scroll">
                <table>
                  <thead><tr><th>Name</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {students.slice().sort((a, b) => b.joinDate.localeCompare(a.joinDate)).slice(0, 5).map(s => (
                      <tr key={s.id}>
                        <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 10, background: `linear-gradient(135deg, ${beltColors[s.belt]?.border || "#888"}, ${beltColors[s.belt]?.bg || "#ccc"})`, color: beltColors[s.belt]?.text || "#333" }}>{s.avatar}</div>
                          {s.name}
                        </td>
                        <td><span className="badge" style={{ background: s.status === "approved" ? "rgba(72,191,132,0.15)" : "rgba(255,217,61,0.15)", color: s.status === "approved" ? "var(--accent-green)" : "var(--accent-gold)" }}>{s.status}</span></td>
                        <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>{s.joinDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="data-table-wrap">
              <div className="table-header"><h3>Upcoming Competitions</h3></div>
              <div style={{ padding: 16 }}>
                {upcoming.length === 0 ? <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No upcoming competitions</p> : upcoming.map(c => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.date} · {c.venue}</div>
                    </div>
                    <span className="badge" style={{ background: c.status === "open" ? "rgba(72,191,132,0.15)" : "rgba(77,150,255,0.15)", color: c.status === "open" ? "var(--accent-green)" : "var(--accent-blue)" }}>{c.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Student dashboard
  return (
    <>
      <div className="page-header"><h2>Welcome, {currentStudent?.name?.split(" ")[0] || "Fighter"}</h2><p>Your training dashboard</p></div>
      <div className="page-body">
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: `${beltColors[currentStudent?.belt]?.bg}`, color: beltColors[currentStudent?.belt]?.text }}><Icon name="award" /></div>
            <div className="stat-value">{currentStudent?.belt || "—"}</div>
            <div className="stat-label">Current Belt</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(72,191,132,0.12)", color: "var(--accent-green)" }}><Icon name="trophy" /></div>
            <div className="stat-value">{currentStudent?.wins || 0}W — {currentStudent?.losses || 0}L</div>
            <div className="stat-label">Win / Loss Record</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(255,217,61,0.12)", color: "var(--accent-gold)" }}><Icon name="rank" /></div>
            <div className="stat-value">#{currentStudent?.rank || "—"}</div>
            <div className="stat-label">Academy Rank</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: feeBadge[currentStudent?.fee?.status]?.bg, color: feeBadge[currentStudent?.fee?.status]?.text }}><Icon name="money" /></div>
            <div className="stat-value">{feeBadge[currentStudent?.fee?.status]?.label || "—"}</div>
            <div className="stat-label">Fee Status</div>
          </div>
        </div>

        <div className="data-table-wrap">
          <div className="table-header"><h3>Upcoming Competitions</h3></div>
          <div style={{ padding: 16 }}>
            {upcoming.length === 0 ? <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No upcoming competitions right now.</p> : upcoming.map(c => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.date} · {c.registeredStudents.length}/{c.maxParticipants} registered</div>
                </div>
                {c.registeredStudents.includes(currentStudent?.id) ? (
                  <span className="badge" style={{ background: "rgba(72,191,132,0.15)", color: "var(--accent-green)" }}>✓ Registered</span>
                ) : c.status === "open" ? (
                  <span className="badge" style={{ background: "rgba(77,150,255,0.15)", color: "var(--accent-blue)" }}>Open</span>
                ) : (
                  <span className="badge" style={{ background: "rgba(136,136,160,0.15)", color: "var(--text-muted)" }}>Coming Soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// --- Students Page (Trainer) ---
function StudentsPage({ students, setStudents, selectedStudent, setSelectedStudent, showToast, searchText, setSearchText, competitions }) {
  const pending = students.filter(s => s.status === "pending");
  const approved = students.filter(s => s.status === "approved");
  const filtered = approved.filter(s => s.name.toLowerCase().includes(searchText.toLowerCase()));

  if (selectedStudent) {
    const s = students.find(st => st.id === selectedStudent);
    if (!s) return null;
    const stuComps = competitions.filter(c => c.registeredStudents.includes(s.id));
    return (
      <>
        <div className="page-header"><h2>Student Details</h2></div>
        <div className="page-body">
          <button className="detail-back" onClick={() => setSelectedStudent(null)}><Icon name="arrowLeft" size={16} /> Back to students</button>
          <div className="profile-header">
            <div className="profile-avatar" style={{ background: `linear-gradient(135deg, ${beltColors[s.belt]?.border || "#888"}, ${beltColors[s.belt]?.text || "#333"})` }}>{s.avatar}</div>
            <div className="profile-details">
              <h3>{s.name}</h3>
              <p>{s.email} · {s.phone}</p>
              <div className="profile-stats-row">
                <div className="profile-stat"><div className="profile-stat-val" style={{ color: "var(--accent-green)" }}>{s.wins}</div><div className="profile-stat-label">Wins</div></div>
                <div className="profile-stat"><div className="profile-stat-val" style={{ color: "var(--accent)" }}>{s.losses}</div><div className="profile-stat-label">Losses</div></div>
                <div className="profile-stat"><div className="profile-stat-val">#{s.rank || "—"}</div><div className="profile-stat-label">Rank</div></div>
              </div>
            </div>
          </div>
          <div className="info-grid">
            <div className="info-card"><label>Belt</label><span className="belt-badge" style={{ background: beltColors[s.belt]?.bg, color: beltColors[s.belt]?.text, borderColor: beltColors[s.belt]?.border }}>{s.belt} Belt</span></div>
            <div className="info-card"><label>Age</label><p>{s.age} years</p></div>
            <div className="info-card"><label>Weight</label><p>{s.weight}</p></div>
            <div className="info-card"><label>Joined</label><p>{s.joinDate}</p></div>
            <div className="info-card"><label>Fee Status</label><span className="badge" style={{ background: feeBadge[s.fee.status]?.bg, color: feeBadge[s.fee.status]?.text }}>{feeBadge[s.fee.status]?.label}</span></div>
            <div className="info-card"><label>Competitions</label><p>{stuComps.length} entered</p></div>
          </div>
          {s.fee.history.length > 0 && (
            <div className="data-table-wrap" style={{ marginTop: 20 }}>
              <div className="table-header"><h3>Fee History</h3></div>
              <div>
                {s.fee.history.map((f, i) => (
                  <div key={i} className="fee-history-item">
                    <span style={{ fontSize: 14 }}>{f.month}</span>
                    <span className="badge" style={{ background: feeBadge[f.status]?.bg, color: feeBadge[f.status]?.text }}>{feeBadge[f.status]?.label}</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{f.paidOn || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header"><h2>Students</h2><p>Manage student registrations and profiles</p></div>
      <div className="page-body">
        {pending.length > 0 && (
          <div className="data-table-wrap" style={{ marginBottom: 24 }}>
            <div className="table-header">
              <h3>Pending Registrations ({pending.length})</h3>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Age</th><th>Weight</th><th>Applied</th><th>Actions</th></tr></thead>
                <tbody>
                  {pending.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{s.email}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{s.phone}</td>
                      <td>{s.age}</td>
                      <td>{s.weight}</td>
                      <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{s.joinDate}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-approve" onClick={() => {
                            setStudents(prev => prev.map(st => st.id === s.id ? { ...st, status: "approved" } : st));
                            showToast(`${s.name} approved!`);
                          }}><Icon name="check" size={14} /> Approve</button>
                          <button className="btn btn-sm btn-reject" onClick={() => {
                            setStudents(prev => prev.filter(st => st.id !== s.id));
                            showToast(`${s.name} rejected.`);
                          }}><Icon name="x" size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="data-table-wrap">
          <div className="table-header">
            <h3>Active Students ({approved.length})</h3>
            <div className="search-bar">
              <input className="search-input" placeholder="Search students…" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </div>
          </div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Name</th><th>Belt</th><th>W/L</th><th>Rank</th><th>Fee</th><th>Joined</th><th></th></tr></thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="user-avatar" style={{ width: 30, height: 30, fontSize: 11, background: `linear-gradient(135deg, ${beltColors[s.belt]?.border || "#888"}, ${beltColors[s.belt]?.bg || "#ccc"})`, color: beltColors[s.belt]?.text || "#333" }}>{s.avatar}</div>
                      {s.name}
                    </td>
                    <td><span className="belt-badge" style={{ background: beltColors[s.belt]?.bg, color: beltColors[s.belt]?.text, borderColor: beltColors[s.belt]?.border }}>{s.belt}</span></td>
                    <td>{s.wins}—{s.losses}</td>
                    <td>{s.rank ? `#${s.rank}` : "—"}</td>
                    <td><span className="badge" style={{ background: feeBadge[s.fee.status]?.bg, color: feeBadge[s.fee.status]?.text }}>{feeBadge[s.fee.status]?.label}</span></td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{s.joinDate}</td>
                    <td><button className="btn-icon" onClick={() => setSelectedStudent(s.id)}><Icon name="eye" size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// --- Competitions Page ---
function CompetitionsPage({ competitions, setCompetitions, students, setStudents, isTrainer, currentStudent, modal, setModal, showToast, selectedComp, setSelectedComp }) {
  if (selectedComp) {
    const c = competitions.find(comp => comp.id === selectedComp);
    if (!c) return null;
    const registered = students.filter(s => c.registeredStudents.includes(s.id));
    return (
      <>
        <div className="page-header"><h2>{c.name}</h2></div>
        <div className="page-body">
          <button className="detail-back" onClick={() => setSelectedComp(null)}><Icon name="arrowLeft" size={16} /> Back to competitions</button>
          <div className="info-grid" style={{ marginBottom: 24 }}>
            <div className="info-card"><label>Date</label><p>{c.date}</p></div>
            <div className="info-card"><label>Venue</label><p>{c.venue}</p></div>
            <div className="info-card"><label>Category</label><p>{c.category}</p></div>
            <div className="info-card"><label>Status</label><p style={{ textTransform: "capitalize" }}>{c.status}</p></div>
            <div className="info-card"><label>Participants</label><p>{c.registeredStudents.length} / {c.maxParticipants}</p></div>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>{c.description}</p>

          {c.results.length > 0 && (
            <div className="data-table-wrap" style={{ marginBottom: 24 }}>
              <div className="table-header"><h3>🏆 Results</h3></div>
              <div style={{ padding: 16 }}>
                {c.results.map(r => (
                  <div key={r.position} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontFamily: "'Bebas Neue'", fontSize: 22, width: 30, textAlign: "center", color: r.position === 1 ? "var(--accent-gold)" : r.position === 2 ? "#C0C0C0" : "var(--accent-orange)" }}>#{r.position}</span>
                    <span style={{ fontWeight: 600 }}>{r.studentName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="data-table-wrap">
            <div className="table-header"><h3>Registered Participants ({registered.length})</h3></div>
            {registered.length === 0 ? (
              <div className="empty-state"><p>No participants registered yet.</p></div>
            ) : (
              <div className="table-scroll">
                <table>
                  <thead><tr><th>Name</th><th>Belt</th><th>Weight</th></tr></thead>
                  <tbody>
                    {registered.map(s => (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td><span className="belt-badge" style={{ background: beltColors[s.belt]?.bg, color: beltColors[s.belt]?.text, borderColor: beltColors[s.belt]?.border }}>{s.belt}</span></td>
                        <td>{s.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><h2>Competitions</h2><p>Events, tournaments and sparring matches</p></div>
          {isTrainer && <button className="btn btn-primary" onClick={() => setModal("newComp")}><Icon name="plus" size={16} /> New Competition</button>}
        </div>
      </div>
      <div className="page-body">
        <div className="comp-grid">
          {competitions.map(c => {
            const statusColor = c.status === "open" ? "var(--accent-green)" : c.status === "completed" ? "var(--text-muted)" : "var(--accent-blue)";
            const isRegistered = currentStudent && c.registeredStudents.includes(currentStudent.id);
            return (
              <div key={c.id} className="comp-card">
                <div className="comp-card-banner" style={{ background: `linear-gradient(90deg, ${statusColor}, transparent)` }} />
                <div className="comp-card-body">
                  <h4>{c.name}</h4>
                  <div className="comp-meta">
                    <div className="comp-meta-item"><Icon name="calendar" size={14} /> {c.date}</div>
                    <div className="comp-meta-item"><Icon name="profile" size={14} /> {c.venue}</div>
                    <div className="comp-meta-item"><Icon name="users" size={14} /> {c.registeredStudents.length}/{c.maxParticipants} participants · {c.category}</div>
                  </div>
                </div>
                <div className="comp-footer">
                  <span className="comp-status" style={{ color: statusColor }}>{c.status}</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => setSelectedComp(c.id)}><Icon name="eye" size={14} /> View</button>
                    {!isTrainer && c.status === "open" && !isRegistered && currentStudent?.status === "approved" && (
                      <button className="btn btn-sm btn-primary" onClick={() => {
                        setCompetitions(prev => prev.map(comp => comp.id === c.id ? { ...comp, registeredStudents: [...comp.registeredStudents, currentStudent.id] } : comp));
                        setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, competitions: [...s.competitions, c.id] } : s));
                        showToast(`Registered for ${c.name}!`);
                      }}>Register</button>
                    )}
                    {!isTrainer && isRegistered && <span className="badge" style={{ background: "rgba(72,191,132,0.15)", color: "var(--accent-green)" }}>✓ Registered</span>}
                    {isTrainer && c.status === "upcoming" && (
                      <button className="btn btn-sm btn-primary" onClick={() => {
                        setCompetitions(prev => prev.map(comp => comp.id === c.id ? { ...comp, status: "open" } : comp));
                        showToast(`Registrations opened for ${c.name}!`);
                      }}>Open Registration</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {modal === "newComp" && <NewCompModal competitions={competitions} setCompetitions={setCompetitions} close={() => setModal(null)} showToast={showToast} />}
    </>
  );
}

// --- Fees Page ---
function FeesPage({ isTrainer, students, setStudents, currentStudent, showToast }) {
  const approved = students.filter(s => s.status === "approved");

  if (!isTrainer) {
    if (!currentStudent) return null;
    return (
      <>
        <div className="page-header"><h2>My Fees</h2><p>View your payment history and current status</p></div>
        <div className="page-body">
          <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="stat-card">
              <div className="stat-label" style={{ marginBottom: 8 }}>Current Status</div>
              <span className="badge" style={{ background: feeBadge[currentStudent.fee.status]?.bg, color: feeBadge[currentStudent.fee.status]?.text, fontSize: 14, padding: "6px 14px" }}>{feeBadge[currentStudent.fee.status]?.label}</span>
            </div>
            <div className="stat-card">
              <div className="stat-label" style={{ marginBottom: 8 }}>Monthly Fee</div>
              <div className="stat-value">₹{currentStudent.fee.amount}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label" style={{ marginBottom: 8 }}>Next Due</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{currentStudent.fee.dueDate}</div>
            </div>
          </div>
          <div className="data-table-wrap">
            <div className="table-header"><h3>Payment History</h3></div>
            {currentStudent.fee.history.length === 0 ? (
              <div className="empty-state"><p>No payment records yet.</p></div>
            ) : (
              <div>
                {currentStudent.fee.history.map((f, i) => (
                  <div key={i} className="fee-history-item">
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{f.month}</span>
                    <span className="badge" style={{ background: feeBadge[f.status]?.bg, color: feeBadge[f.status]?.text }}>{feeBadge[f.status]?.label}</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{f.paidOn ? `Paid: ${f.paidOn}` : "Not paid"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>* Fee payments are processed offline. Contact your trainer for payment details.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header"><h2>Fee Management</h2><p>Track and update student payment statuses</p></div>
      <div className="page-body">
        <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="stat-card"><div className="stat-value" style={{ color: "var(--accent-green)" }}>{approved.filter(s => s.fee.status === "completed").length}</div><div className="stat-label">Paid</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: "var(--accent-gold)" }}>{approved.filter(s => s.fee.status === "pending").length}</div><div className="stat-label">Pending</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: "var(--accent)" }}>{approved.filter(s => s.fee.status === "overdue").length}</div><div className="stat-label">Overdue</div></div>
        </div>
        <div className="data-table-wrap">
          <div className="table-header"><h3>All Students</h3></div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Name</th><th>Amount</th><th>Status</th><th>Due Date</th><th>Actions</th></tr></thead>
              <tbody>
                {approved.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>₹{s.fee.amount}</td>
                    <td><span className="badge" style={{ background: feeBadge[s.fee.status]?.bg, color: feeBadge[s.fee.status]?.text }}>{feeBadge[s.fee.status]?.label}</span></td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{s.fee.dueDate}</td>
                    <td>
                      <select className="form-select" style={{ width: 140, padding: "6px 10px", fontSize: 12 }} value={s.fee.status} onChange={e => {
                        const newStatus = e.target.value;
                        setStudents(prev => prev.map(st => st.id === s.id ? { ...st, fee: { ...st.fee, status: newStatus } } : st));
                        showToast(`${s.name}'s fee marked as ${newStatus}`);
                      }}>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// --- Rankings Page ---
function RankingsPage({ students }) {
  const ranked = students.filter(s => s.status === "approved" && s.rank > 0).sort((a, b) => a.rank - b.rank);
  const posColors = ["var(--accent-gold)", "#C0C0C0", "var(--accent-orange)"];

  return (
    <>
      <div className="page-header"><h2>Academy Rankings</h2><p>Overall student rankings based on competition performance</p></div>
      <div className="page-body">
        <div className="rank-list">
          {ranked.map((s, i) => (
            <div key={s.id} className="rank-item">
              <div className="rank-pos" style={{ background: i < 3 ? `${posColors[i]}22` : "var(--bg-input)", color: i < 3 ? posColors[i] : "var(--text-secondary)" }}>
                {i < 3 ? <Icon name="star" size={18} /> : `#${s.rank}`}
              </div>
              <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 12, background: `linear-gradient(135deg, ${beltColors[s.belt]?.border || "#888"}, ${beltColors[s.belt]?.bg || "#ccc"})`, color: beltColors[s.belt]?.text || "#333" }}>{s.avatar}</div>
              <div className="rank-info">
                <h4>{s.name}</h4>
                <span>{s.belt} Belt</span>
              </div>
              <div className="rank-stats">
                <span>W: <strong style={{ color: "var(--accent-green)" }}>{s.wins}</strong></span>
                <span>L: <strong style={{ color: "var(--accent)" }}>{s.losses}</strong></span>
                <span>Win%: <strong>{s.wins + s.losses > 0 ? Math.round((s.wins / (s.wins + s.losses)) * 100) : 0}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// --- Notifications Page ---
function NotificationsPage({ notifications, setNotifications, userId, isTrainer, students, showToast, modal, setModal }) {
  const myNotifs = notifications.filter(n => n.to === "all" || n.to === userId || isTrainer);

  return (
    <>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><h2>Notifications</h2><p>Announcements and reminders</p></div>
          {isTrainer && <button className="btn btn-primary" onClick={() => setModal("sendNotif")}><Icon name="send" size={16} /> Send Reminder</button>}
        </div>
      </div>
      <div className="page-body">
        {myNotifs.length === 0 ? (
          <div className="empty-state"><Icon name="bell" size={40} /><p>No notifications yet.</p></div>
        ) : (
          <div className="notif-list">
            {myNotifs.sort((a, b) => b.date.localeCompare(a.date)).map(n => (
              <div key={n.id} className={`notif-item ${!n.read ? "unread" : ""}`} onClick={() => setNotifications(prev => prev.map(nn => nn.id === n.id ? { ...nn, read: true } : nn))}>
                {!n.read && <div className="notif-dot" />}
                <div className="notif-content">
                  <p>{n.message}</p>
                  <span>{n.date} · {n.to === "all" ? "All students" : students.find(s => s.id === n.to)?.name || "You"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {modal === "sendNotif" && <SendNotifModal notifications={notifications} setNotifications={setNotifications} students={students} close={() => setModal(null)} showToast={showToast} />}
    </>
  );
}

// --- Profile Page (Student) ---
function ProfilePage({ student, setModal }) {
  if (!student) return null;

  return (
    <>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><h2>My Profile</h2><p>Your personal information</p></div>
          <button className="btn btn-secondary" onClick={() => setModal("editProfile")}><Icon name="edit" size={16} /> Edit Profile</button>
        </div>
      </div>
      <div className="page-body">
        <div className="profile-header">
          <div className="profile-avatar" style={{ background: `linear-gradient(135deg, ${beltColors[student.belt]?.border || "#888"}, ${beltColors[student.belt]?.text || "#333"})` }}>{student.avatar}</div>
          <div className="profile-details">
            <h3>{student.name}</h3>
            <p>Member since {student.joinDate}</p>
            <div className="profile-stats-row">
              <div className="profile-stat"><div className="profile-stat-val" style={{ color: "var(--accent-green)" }}>{student.wins}</div><div className="profile-stat-label">Wins</div></div>
              <div className="profile-stat"><div className="profile-stat-val" style={{ color: "var(--accent)" }}>{student.losses}</div><div className="profile-stat-label">Losses</div></div>
              <div className="profile-stat"><div className="profile-stat-val">#{student.rank || "—"}</div><div className="profile-stat-label">Rank</div></div>
            </div>
          </div>
        </div>
        <div className="info-grid">
          <div className="info-card"><label>Email</label><p>{student.email}</p></div>
          <div className="info-card"><label>Phone</label><p>{student.phone}</p></div>
          <div className="info-card"><label>Age</label><p>{student.age} years</p></div>
          <div className="info-card"><label>Weight</label><p>{student.weight}</p></div>
          <div className="info-card"><label>Belt</label><span className="belt-badge" style={{ background: beltColors[student.belt]?.bg, color: beltColors[student.belt]?.text, borderColor: beltColors[student.belt]?.border }}>{student.belt} Belt</span></div>
          <div className="info-card"><label>Fee Status</label><span className="badge" style={{ background: feeBadge[student.fee.status]?.bg, color: feeBadge[student.fee.status]?.text }}>{feeBadge[student.fee.status]?.label}</span></div>
        </div>
      </div>
    </>
  );
}

// ---------- Modals ----------

function RegisterModal({ students, setStudents, close, showToast }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", age: "", weight: "", belt: "White" });
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.name || !form.email || !form.phone) return;
    const newStudent = {
      id: generateId(), name: form.name, email: form.email, phone: form.phone,
      belt: form.belt, age: parseInt(form.age) || 18, weight: form.weight || "—",
      joinDate: new Date().toISOString().split("T")[0], status: "pending",
      avatar: form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      fee: { amount: 2500, status: "pending", dueDate: "", history: [] },
      competitions: [], wins: 0, losses: 0, rank: 0,
    };
    setStudents(prev => [...prev, newStudent]);
    showToast("Registration submitted! Awaiting trainer approval.");
    close();
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>Student Registration</h3><button className="btn-icon" onClick={close}><Icon name="x" size={16} /></button></div>
        <div className="modal-body">
          <div className="form-group"><label>Full Name *</label><input className="form-input" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Enter full name" /></div>
          <div className="form-row">
            <div className="form-group"><label>Email *</label><input className="form-input" type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@email.com" /></div>
            <div className="form-group"><label>Phone *</label><input className="form-input" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="9876543210" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Age</label><input className="form-input" type="number" value={form.age} onChange={e => update("age", e.target.value)} placeholder="18" /></div>
            <div className="form-group"><label>Weight</label><input className="form-input" value={form.weight} onChange={e => update("weight", e.target.value)} placeholder="65kg" /></div>
          </div>
          <div className="form-group">
            <label>Current Belt Level</label>
            <select className="form-select" value={form.belt} onChange={e => update("belt", e.target.value)}>
              {Object.keys(beltColors).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Submit Registration</button>
        </div>
      </div>
    </div>
  );
}

function EditProfileModal({ student, students, setStudents, close, showToast }) {
  const [form, setForm] = useState({ phone: student?.phone || "", age: student?.age || "", weight: student?.weight || "" });
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>Edit Profile</h3><button className="btn-icon" onClick={close}><Icon name="x" size={16} /></button></div>
        <div className="modal-body">
          <div className="form-group"><label>Phone</label><input className="form-input" value={form.phone} onChange={e => update("phone", e.target.value)} /></div>
          <div className="form-row">
            <div className="form-group"><label>Age</label><input className="form-input" type="number" value={form.age} onChange={e => update("age", e.target.value)} /></div>
            <div className="form-group"><label>Weight</label><input className="form-input" value={form.weight} onChange={e => update("weight", e.target.value)} /></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={() => {
            setStudents(prev => prev.map(s => s.id === student.id ? { ...s, phone: form.phone, age: parseInt(form.age) || s.age, weight: form.weight || s.weight } : s));
            showToast("Profile updated!");
            close();
          }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function NewCompModal({ competitions, setCompetitions, close, showToast }) {
  const [form, setForm] = useState({ name: "", date: "", venue: "", category: "All Belts", max: 32, desc: "" });
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>Create Competition</h3><button className="btn-icon" onClick={close}><Icon name="x" size={16} /></button></div>
        <div className="modal-body">
          <div className="form-group"><label>Competition Name *</label><input className="form-input" value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Summer Championship" /></div>
          <div className="form-row">
            <div className="form-group"><label>Date *</label><input className="form-input" type="date" value={form.date} onChange={e => update("date", e.target.value)} /></div>
            <div className="form-group"><label>Venue *</label><input className="form-input" value={form.venue} onChange={e => update("venue", e.target.value)} placeholder="Sports arena" /></div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select className="form-select" value={form.category} onChange={e => update("category", e.target.value)}>
                <option>All Belts</option><option>White Belt</option><option>Yellow Belt+</option><option>Green Belt+</option><option>Blue Belt+</option>
              </select>
            </div>
            <div className="form-group"><label>Max Participants</label><input className="form-input" type="number" value={form.max} onChange={e => update("max", e.target.value)} /></div>
          </div>
          <div className="form-group"><label>Description</label><textarea className="form-textarea" value={form.desc} onChange={e => update("desc", e.target.value)} placeholder="Details about the competition…" /></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={() => {
            if (!form.name || !form.date) return;
            setCompetitions(prev => [...prev, { id: generateId(), name: form.name, date: form.date, venue: form.venue, category: form.category, status: "upcoming", maxParticipants: parseInt(form.max) || 32, registeredStudents: [], results: [], description: form.desc }]);
            showToast(`${form.name} created!`);
            close();
          }}>Create Competition</button>
        </div>
      </div>
    </div>
  );
}

function SendNotifModal({ notifications, setNotifications, students, close, showToast }) {
  const [to, setTo] = useState("all");
  const [msg, setMsg] = useState("");
  const approved = students.filter(s => s.status === "approved");

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>Send Reminder</h3><button className="btn-icon" onClick={close}><Icon name="x" size={16} /></button></div>
        <div className="modal-body">
          <div className="form-group">
            <label>Send To</label>
            <select className="form-select" value={to} onChange={e => setTo(e.target.value)}>
              <option value="all">All Students</option>
              {approved.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea className="form-textarea" value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type your reminder message…" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={() => {
            if (!msg.trim()) return;
            setNotifications(prev => [...prev, { id: generateId(), to, message: msg, date: new Date().toISOString().split("T")[0], read: false }]);
            showToast("Reminder sent!");
            close();
          }}><Icon name="send" size={14} /> Send</button>
        </div>
      </div>
    </div>
  );
}
