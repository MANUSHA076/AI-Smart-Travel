'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import React from 'react';
import { Users, Edit2, Trash2, Shield, Search, Download, Plus, X, CheckCircle, AlertTriangle, MoreVertical } from 'lucide-react';

interface User {
  id: number; name: string; email: string;
  role: 'Admin' | 'User'; status: 'Active' | 'Inactive'; lastLogin: string;
}
interface Toast { id: string; message: string; type: 'success' | 'error' }

const INITIAL_USERS: User[] = [
  { id: 1, name: 'Manusha Silva', email: 'manusha@smarttravel.com', role: 'Admin', status: 'Active', lastLogin: '2025-01-12 09:41' },
  { id: 6, name: 'Nethmi Dissanayake', email: 'nethmi@smarttravel.com', role: 'User', status: 'Active', lastLogin: '2025-01-08 17:03' },
  { id: 7, name: 'Chamika Senanayake', email: 'chamika@smarttravel.com', role: 'Admin', status: 'Inactive', lastLogin: '2024-12-28 10:11' },
  { id: 8, name: 'Piyumi Rathnayake', email: 'piyumi@smarttravel.com', role: 'User', status: 'Active', lastLogin: '2025-01-07 09:55' },
];

const Overlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
    <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"><X size={16} /></button>
      {children}
    </div>
  </div>
);

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-600', 'bg-teal-100 text-teal-600',
  'bg-violet-100 text-violet-600', 'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-600', 'bg-sky-100 text-sky-600',
];
const PER_PAGE = 8;
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Admin' | 'User'>('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [, startTransition] = useTransition();
  const [modal, setModal] = useState<null | 'add' | 'edit' | 'delete'>(null);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'User' as User['role'], status: 'Active' as User['status'] });

  useEffect(() => {
    startTransition(() => {
      const saved = localStorage.getItem('um-users');
      if (saved) {
        try { setUsers(JSON.parse(saved)); } catch { }
      }
      setHydrated(true);
    });
  }, [startTransition]);

  useEffect(() => { if (hydrated) localStorage.setItem('um-users', JSON.stringify(users)); }, [users, hydrated]);

  const toast = (message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };

  const filtered = useMemo(() => {
    let r = [...users];
    if (search) { const s = search.toLowerCase(); r = r.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)); }
    if (roleFilter !== 'All') r = r.filter(u => u.role === roleFilter);
    return r;
  }, [users, search, roleFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const allSelected = paged.length > 0 && paged.every(u => selected.includes(u.id));

  const toggleSelect = (id: number) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const toggleSelectAll = () => {
    const ids = paged.map(u => u.id);
    setSelected(p => allSelected ? p.filter(id => !ids.includes(id)) : [...new Set([...p, ...ids])]);
  };

  const openAdd = () => { setForm({ name: '', email: '', role: 'User', status: 'Active' }); setEditTarget(null); setModal('add'); };
  const openEdit = (u: User) => { setForm({ name: u.name, email: u.email, role: u.role, status: u.status }); setEditTarget(u); setModal('edit'); };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast('Invalid email', 'error'); return; }
    if (users.some(u => u.email.toLowerCase() === form.email.toLowerCase() && u.id !== editTarget?.id)) { toast('Email already exists', 'error'); return; }
    if (modal === 'add') {
      setUsers(p => [...p, { id: Math.max(0, ...p.map(u => u.id)) + 1, ...form, name: form.name.trim(), email: form.email.trim(), lastLogin: new Date().toISOString().slice(0, 16).replace('T', ' ') }]);
      toast(`"${form.name}" added`);
    } else if (editTarget) {
      setUsers(p => p.map(u => u.id === editTarget.id ? { ...u, ...form } : u));
      toast(`"${form.name}" updated`);
    }
    setModal(null); setPage(1);
  };

  const deleteUser = () => {
    if (!deleteTarget) return;
    setUsers(p => p.filter(u => u.id !== deleteTarget.id));
    setSelected(p => p.filter(id => id !== deleteTarget.id));
    toast(`"${deleteTarget.name}" deleted`);
    setModal(null); setDeleteTarget(null); setPage(1);
  };

  const toggleRole = (id: number) => setUsers(p => p.map(u => { if (u.id !== id) return u; const r = u.role === 'Admin' ? 'User' : 'Admin'; toast(`${u.name} → ${r}`); return { ...u, role: r }; }));
  const toggleStatus = (id: number) => setUsers(p => p.map(u => { if (u.id !== id) return u; const s = u.status === 'Active' ? 'Inactive' : 'Active'; toast(`${u.name} → ${s}`); return { ...u, status: s }; }));
  const bulkDelete = () => { setUsers(p => p.filter(u => !selected.includes(u.id))); toast(`${selected.length} users deleted`); setSelected([]); setPage(1); };
  const bulkPromote = () => { setUsers(p => p.map(u => selected.includes(u.id) ? { ...u, role: 'Admin' as const } : u)); toast(`${selected.length} promoted`); setSelected([]); };

  const exportCSV = () => {
    if (!filtered.length) { toast('No users to export', 'error'); return; }
    const rows = [['ID', 'Name', 'Email', 'Role', 'Status', 'Last Login'], ...filtered.map(u => [u.id, `"${u.name}"`, u.email, u.role, u.status, u.lastLogin])];
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' })), download: 'users.csv' });
    a.click(); toast(`${filtered.length} users exported`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">User Management</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage roles and account access</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button onClick={exportCSV} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-all">
              <Download size={15} /> <span className="hidden xs:inline">Export</span>
            </button>
            <button onClick={openAdd} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 transition-all">
              <Plus size={16} /> Add User
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name or email…"
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {(['All', 'Admin', 'User'] as const).map(r => (
              <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
                className={cn('whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all border',
                  roleFilter === r ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50')}>
                {r === 'All' ? 'All Roles' : `${r}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selected.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-xl bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-10 duration-300">
            <span className="text-sm font-medium">{selected.length} selected</span>
            <div className="flex items-center gap-3">
              <button onClick={bulkPromote} className="hidden sm:block text-xs font-semibold px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg">Promote to Admin</button>
              <button onClick={bulkDelete} className="text-xs font-semibold px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg">Delete</button>
              <button onClick={() => setSelected([])} className="text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
            </div>
          </div>
        )}

        {/* Table / List Container */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Desktop/Tablet Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="pl-6 py-4 w-10">
                    <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="accent-indigo-600 w-4 h-4 cursor-pointer rounded" />
                  </th>
                  <th className="py-4 px-3">User</th>
                  <th className="py-4 px-3">Email</th>
                  <th className="py-4 px-3">Role</th>
                  <th className="py-4 px-3">Status</th>
                  <th className="py-4 px-3">Last Login</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {paged.length > 0 ? paged.map(u => (
                  <tr key={u.id} className={cn('group transition-colors', selected.includes(u.id) ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50')}>
                    <td className="pl-6 py-4">
                      <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleSelect(u.id)} className="accent-indigo-600 w-4 h-4 cursor-pointer rounded" />
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-semibold text-xs', AVATAR_COLORS[u.name.charCodeAt(0) % AVATAR_COLORS.length])}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 truncate max-w-[150px]">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-slate-500 truncate max-w-[180px]">{u.email}</td>
                    <td className="py-4 px-3">
                      <button onClick={() => toggleRole(u.id)} className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all', u.role === 'Admin' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600')}>
                        {u.role === 'Admin' ? <Shield size={10} /> : <Users size={10} />} {u.role}
                      </button>
                    </td>
                    <td className="py-4 px-3">
                      <button onClick={() => toggleStatus(u.id)} className={cn('px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider', u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600')}>
                        {u.status}
                      </button>
                    </td>
                    <td className="py-4 px-3 font-mono text-[11px] text-slate-400">{u.lastLogin}</td>
                    <td className="py-4 pr-6">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(u)} className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 hover:text-indigo-600 transition-all"><Edit2 size={14} /></button>
                        <button onClick={() => { setDeleteTarget(u); setModal('delete'); }} className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-red-200 text-slate-400 hover:text-red-600 transition-all"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="py-20 text-center text-slate-400 text-sm">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {paged.length > 0 ? paged.map(u => (
              <div key={u.id} className={cn('p-4 flex flex-col gap-4', selected.includes(u.id) ? 'bg-indigo-50/40' : 'active:bg-slate-50')}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleSelect(u.id)} className="accent-indigo-600 w-5 h-5 rounded" />
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold', AVATAR_COLORS[u.name.charCodeAt(0) % AVATAR_COLORS.length])}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(u)} className="p-2 text-slate-400"><Edit2 size={16} /></button>
                    <button onClick={() => { setDeleteTarget(u); setModal('delete'); }} className="p-2 text-slate-400"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex gap-2">
                    <span className={cn('px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase', u.role === 'Admin' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600')}>{u.role}</span>
                    <span className={cn('px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase', u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600')}>{u.status}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Last: {u.lastLogin.split(' ')[0]}</span>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center text-slate-400">No users found.</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <span className="text-xs text-slate-500 hidden xs:inline">Page {page} of {totalPages}</span>
              <div className="flex items-center gap-1 w-full justify-between xs:w-auto">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-slate-200 disabled:opacity-30 bg-white text-xs font-semibold hover:bg-slate-50 transition-all">Prev</button>
                <div className="flex md:hidden text-xs font-bold text-slate-600">{page} / {totalPages}</div>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-xl border border-slate-200 disabled:opacity-30 bg-white text-xs font-semibold hover:bg-slate-50 transition-all">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals & Toasts (Keep same as original but ensure mobile responsive) */}
      {(modal === 'add' || modal === 'edit') && (
        <Overlay onClose={() => setModal(null)}>
          <h2 className="text-xl font-bold text-slate-900 mb-1">{modal === 'add' ? 'Add New User' : 'Edit User'}</h2>
          <p className="text-xs text-slate-500 mb-6">Fill out the information below</p>
          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Nimal Perera"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="name@company.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as User['role'] })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400">
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as User['status'] })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-100 transition-all">
              {modal === 'add' ? 'Create User' : 'Save Changes'}
            </button>
          </form>
        </Overlay>
      )}

      {modal === 'delete' && (
        <Overlay onClose={() => setModal(null)}>
          <div className="text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="text-red-500" size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Delete User?</h2>
            <p className="text-sm text-slate-500 mt-2">
              Are you sure you want to delete <span className="font-bold text-slate-700">{deleteTarget?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">Cancel</button>
              <button onClick={deleteUser} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-100">Delete</button>
            </div>
          </div>
        </Overlay>
      )}

      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[70] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={cn('flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-bold shadow-xl animate-in slide-in-from-right-10',
            t.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700')}>
            {t.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}