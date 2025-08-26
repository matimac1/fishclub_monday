// src/utils/dateUtils.ts

export const calculateFullAge = (dobString: string | null | undefined): string => {
  if (!dobString) return '';

  const birthDate = new Date(dobString);
  // Ajustar por la zona horaria para evitar errores de un día
  birthDate.setMinutes(birthDate.getMinutes() + birthDate.getTimezoneOffset());

  const today = new Date();

  if (birthDate > today) return 'Fecha futura no válida';

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} años, ${months} meses y ${days} días`;
};

export const getAgeInYears = (dobString: string | null | undefined): number | null => {
    if (!dobString) return null;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}