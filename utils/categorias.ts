import type { Categoria, Sexo } from '../types';

export const getCategory = (age: number | '', sex: Sexo): Categoria => {
    if (age === '') return '';
    const numericAge = Number(age);

    if (numericAge <= 12) return 'Infantil';
    if (numericAge >= 13 && numericAge <= 17) return 'Juvenil';
    if (numericAge >= 18) {
        if (sex === 'Femenino') return 'Damas';
        if (sex === 'Masculino') {
            if (numericAge <= 54) return 'Adultos (Masculino)';
            if (numericAge >= 55 && numericAge <= 64) return 'Senior';
            if (numericAge >= 65) return 'Máster';
        }
    }
    return '';
};
