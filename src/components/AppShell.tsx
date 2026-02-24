import React from 'react';
import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface AppShellProps {
    children: ReactNode;
}

const NAV_ITEMS = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/assessment', label: 'Assessment', icon: '🔬' },
    { path: '/results', label: 'Results', icon: '📊' },
    { path: '/consejos', label: 'Tips', icon: '💡' },
];

const AppShell: React.FC<AppShellProps> = ({ children }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="app-shell">
            {/* Header */}
            <header className="app-header">
                <div className="header-logo">
                    <div className="header-logo-icon">👁️</div>
                    <span className="header-logo-text">AnemIA Scan</span>
                </div>
                {!isHome && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: 'auto', fontWeight: 600 }}>
                        Screening only — Not a medical diagnosis
                    </span>
                )}
            </header>

            {/* Page Content */}
            <main className="page-content">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `bottom-nav-item${isActive ? ' active' : ''}`
                        }
                    >
                        <span className="bottom-nav-icon">{item.icon}</span>
                        <span className="bottom-nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AppShell;
