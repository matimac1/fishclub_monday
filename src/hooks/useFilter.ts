// src/hooks/useFilter.ts

import { useState, useMemo } from 'react';

// T es el tipo de dato del array (ej: Team, Species)
// K es una de las claves de ese tipo (ej: 'name', 'club')
// Se ha ajustado para que el id sea un string, como en Firestore.
export const useFilter = <T extends { id: string }>( 
  initialData: T[],
  filterKey: keyof T
) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (searchTerm.length < 2) {
      return initialData;
    }

    return initialData.filter((item) => {
      const value = String(item[filterKey]).toLowerCase();
      return value.includes(searchTerm.toLowerCase());
    });
  }, [initialData, searchTerm, filterKey]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
  };
};
