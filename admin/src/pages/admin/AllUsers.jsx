import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, User as UserIcon, Clock, ChevronRight, 
  Shield, Mail, Filter, MoreVertical, Trash2
} from 'lucide-react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AllUsers = () => {
  const { backendUrl, token } = useAppContext();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Users (Admin API)
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        // Updated endpoint to a general user list API
        const response = await axios.get(`${backendUrl}/api/all-users`, {
          headers: { token }
        });

        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Fetch Users Error:", error);
        toast.error("Failed to load user list");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAllUsers();
  }, [backendUrl, token]);

  // 2. Filter Logic (Search by Name or Email)
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* --- Header & Stats --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0b0f1a] p-8 rounded-[2.5rem] border border-white/5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">User Directory</h1>
          <p className="text-slate-500 text-xs font-bold mt-1">Total Registered: {users.length} Students</p>
        </div>
        
        <div className="flex gap-3">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                    type="text"
                    placeholder="Search name or email..."
                    className="bg-white/5 border border-white/10 pl-12 pr-6 py-3 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all w-full md:w-80 text-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
                <Filter size={20} />
            </button>
        </div>
      </div>

      {/* --- User Table --- */}
      <div className="bg-[#0b0f1a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">User Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Level</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Joined Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.02] transition-all group">
                  {/* User Profile & Email */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-indigo-400 font-black relative">
                        {user.name.charAt(0)}
                        {user.isOnline && (
                             <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0b0f1a] rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{user.name}</p>
                        <p className="text-slate-500 text-xs flex items-center gap-1">
                            <Mail size={12} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        user.role === 'admin' 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      <Shield size={12} />
                      {user.role}
                    </div>
                  </td>

                  {/* Joined Date */}
                  <td className="px-8 py-5">
                    <div className="text-slate-400 text-xs font-medium flex items-center gap-2">
                        <Clock size={14} className="text-slate-600" />
                        {new Date(user.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            <MoreVertical size={18} />
                        </button>
                        <button 
                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            onClick={() => toast.error("Delete function restricted")}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-20 text-center">
            <UserIcon size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No matching users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers