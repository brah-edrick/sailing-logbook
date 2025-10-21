export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};
