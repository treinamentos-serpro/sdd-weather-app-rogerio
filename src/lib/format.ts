export function formatForecastDay(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00Z`);

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
    weekday: 'short',
  }).format(parsedDate);
}
