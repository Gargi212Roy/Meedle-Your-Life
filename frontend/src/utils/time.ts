export const getRelativeTime = (date: string | Date): string => {
	const now = Date.now();
	const past = new Date(date).getTime();
	const diff = Math.floor((now - past) / 1000);

	if (diff < 60) return `${diff}s ago`;
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
	if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

	return new Date(date).toLocaleDateString();
};
