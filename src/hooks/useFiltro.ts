// src/hooks/useFiltro.ts

import { useState, useMemo } from 'react';

// Definimos un tipo para asegurar que los acompañantes tengan un campo 'name'
type SearchableItem = { name?: string; [key: string]: any; };

export function useFiltro<T>(
  datos: T[],
  camposBusqueda: (keyof T)[]
) {
  const [busqueda, setBusqueda] = useState('');

  const datosFiltrados = useMemo(() => {
    if (busqueda.length < 2) {
      return datos;
    }
    const busquedaMinuscula = busqueda.toLowerCase();

    return datos.filter((item) => {
      // Devuelve true si CUALQUIERA de los campos coincide
      return camposBusqueda.some(campo => {
        const valor = item?.[campo];
        
        // Si el campo es un array (como 'companions')
        if (Array.isArray(valor)) {
          return (valor as SearchableItem[]).some(subItem => 
            subItem?.name?.toLowerCase().includes(busquedaMinuscula)
          );
        }
        
        // Si es un campo normal (string o número)
        return valor ? String(valor).toLowerCase().includes(busquedaMinuscula) : false;
      });
    });
  }, [datos, busqueda, camposBusqueda]);

  return { busqueda, setBusqueda, datosFiltrados };
}