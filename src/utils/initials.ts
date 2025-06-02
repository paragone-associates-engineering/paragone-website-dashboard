export function getInitials(fullName: string): string {
  const names = fullName.trim().split(' ');
  const firstInitial = names[0]?.[0] || '';
  const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';
  return (firstInitial + lastInitial).toUpperCase();
}
