import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SavedPassengersContext = createContext();

export const useSavedPassengers = () => useContext(SavedPassengersContext);

export const SavedPassengersProvider = ({ children }) => {
    const { token, isAuthenticated } = useAuth();
    const [savedPassengers, setSavedPassengers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchSavedPassengers();
        } else {
            const local = localStorage.getItem('guestSavedPassengers');
            if (local) {
                try {
                    setSavedPassengers(JSON.parse(local));
                } catch (e) {}
            } else {
                setSavedPassengers([]);
            }
        }
    }, [isAuthenticated, token]);

    const fetchSavedPassengers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/saved-passengers', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setSavedPassengers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addPassenger = async (passengerData) => {
        if (isAuthenticated && token) {
            try {
                const res = await fetch('/api/saved-passengers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(passengerData)
                });
                if (res.ok) {
                    const newP = await res.json();
                    setSavedPassengers(prev => [...prev, newP]);
                    return newP;
                }
            } catch (e) { console.error(e); }
        } else {
            // Guest -> local storage (only name, email, phone)
            const localP = {
                id: Date.now().toString(),
                fullName: passengerData.fullName || "",
                email: passengerData.email || "",
                phone: passengerData.phone || passengerData.phoneDigits || "",
                passengerType: passengerData.passengerType || 'ADULT',
            };
            // Check if already exists in guest
            let updated = [...savedPassengers];
            let existingIdx = updated.findIndex(p => p.fullName === localP.fullName && p.phone === localP.phone);
            if (existingIdx >= 0) {
               updated[existingIdx] = {...updated[existingIdx], ...localP}; 
            } else {
               updated.push(localP);
            }
            
            setSavedPassengers(updated);
            localStorage.setItem('guestSavedPassengers', JSON.stringify(updated));
            return localP;
        }
    };

    const removePassenger = async (id) => {
        if (isAuthenticated && token) {
            try {
                const res = await fetch(`/api/saved-passengers/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setSavedPassengers(prev => prev.filter(p => p.id !== id));
                }
            } catch(e) {}
        } else {
            const updated = savedPassengers.filter(p => p.id !== id);
            setSavedPassengers(updated);
            localStorage.setItem('guestSavedPassengers', JSON.stringify(updated));
        }
    }

    return (
        <SavedPassengersContext.Provider value={{ savedPassengers, loading, addPassenger, removePassenger }}>
            {children}
        </SavedPassengersContext.Provider>
    );
};
