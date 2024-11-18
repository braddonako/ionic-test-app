export const formatSalary = (value: string) => {
    if (!value) return '';
    const number = parseInt(value);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(number);
  };