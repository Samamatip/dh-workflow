'use client';
import React, { createContext, useContext, useState } from 'react';

// Context
const UndevelopedFunctionalityContext = createContext();

export const useUndevelopedFunctionality = () => useContext(UndevelopedFunctionalityContext);

// Provider
export const UndevelopedFunctionalityProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);

    const showWarning = () => setVisible(true);
    const hideWarning = () => setVisible(false);

    return (
        <UndevelopedFunctionalityContext.Provider value={{ showWarning }}>
            {children}
            {visible && <UndevelopedFunctionalityOverlay onClose={hideWarning} />}
        </UndevelopedFunctionalityContext.Provider>
    );
};

// Overlay Component
const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

const boxStyle = {
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    minWidth: '300px',
    color:'black'
};

const buttonStyle = {
    marginTop: '1rem',
    padding: '0.5rem 1.5rem',
    background: '#0078d4',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
};

function UndevelopedFunctionalityOverlay({ onClose }) {
    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={boxStyle} onClick={e => e.stopPropagation()}>
                <h2 style={{ fontWeight: 'bold' }}>Feature Not Available</h2>
                <p>This functionality has not been developed yet.</p>
                <button onClick={onClose} style={buttonStyle}>Close</button>
            </div>
        </div>
    );
};