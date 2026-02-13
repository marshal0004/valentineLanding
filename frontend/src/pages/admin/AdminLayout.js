import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Settings, QrCode, Eye, Heart } from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
  { path: '/admin/qr', label: 'QR Code', icon: QrCode },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a' }}>
      {/* Sidebar */}
      <aside className="w-64 min-h-screen p-6 flex flex-col gap-2 border-r"
        style={{ borderColor: 'rgba(255,45,85,0.15)', background: '#0d0508' }}>
        
        <div className="flex items-center gap-2 mb-8 px-2">
          <Heart className="w-6 h-6 text-[#ff2d55]" fill="#ff2d55" />
          <h1 className="font-great-vibes text-2xl text-[#f4e0e0]">Admin</h1>
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-cormorant
                ${
                  isActive
                    ? 'bg-[rgba(255,45,85,0.15)] text-[#ff2d55] border border-[rgba(255,45,85,0.3)]'
                    : 'text-[#c9a0a0] hover:bg-[rgba(255,45,85,0.08)] hover:text-[#f4e0e0]'
                }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        <div className="mt-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-cormorant text-[#c9a0a0] hover:bg-[rgba(255,45,85,0.08)] hover:text-[#f4e0e0] transition-all"
          >
            <Eye className="w-5 h-5" />
            Preview Public Page
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
