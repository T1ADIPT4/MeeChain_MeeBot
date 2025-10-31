import React from 'react';
import { useRouter } from 'next/router';

interface NavButtonProps {
    to: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const NavButton: React.FC<NavButtonProps> = ({ to, children, style }) => {
    const router = useRouter();
    return (
        <button
            style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: '#1976d2',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                margin: 8,
                ...style,
            }}
            onClick={() => router.push(to)}
        >
            {children}
        </button>
    );
};

export default NavButton;
