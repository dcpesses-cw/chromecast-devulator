/** https://dev.to/alexparra/js-seconds-to-hh-mm-ss-22o6 */
export function generateTimestamp(seconds) {
	const SECONDS_PER_DAY = 86400;
	const HOURS_PER_DAY = 24;
	const days = Math.floor(seconds / SECONDS_PER_DAY);
	const remainderSeconds = seconds % SECONDS_PER_DAY;
	const hms = new Date(remainderSeconds * 1000).toISOString().substring(11, 19);
	return hms.replace(/^(\d+)/, (h) => `${Number(h) + days * HOURS_PER_DAY}`.padStart(2, '0'));
}

export function mountProgressBar(container, { getCurrentTime, setCurrentTime, getDuration, onTimeUpdate }) {
	const range = document.createElement('input');
	range.type = 'range';
	range.min = '0';

	const currentLabel = document.createElement('div');
	const durationLabel = document.createElement('div');

	const timestamps = document.createElement('div');
	timestamps.className = 'timestamps';
	timestamps.append(currentLabel, durationLabel);

	container.append(range, timestamps);

	let preferredTime = getCurrentTime();
	let isInteracting = false;

	const syncFromState = () => {
		if (!isInteracting) {
			preferredTime = getCurrentTime();
			range.value = String(preferredTime);
		}
		range.max = String(getDuration());
		currentLabel.textContent = generateTimestamp(preferredTime);
		durationLabel.textContent = generateTimestamp(getDuration());
	};

	range.addEventListener('input', () => {
		preferredTime = Number(range.value);
		currentLabel.textContent = generateTimestamp(preferredTime);
	});

	range.addEventListener('change', () => {
		setCurrentTime(preferredTime);
		onTimeUpdate(preferredTime);
	});

	range.addEventListener('mousedown', () => {
		isInteracting = true;
	});

	window.addEventListener('mouseup', () => {
		if (!isInteracting) return;
		isInteracting = false;
		setCurrentTime(preferredTime);
	});

	return {
		update() {
			syncFromState();
		}
	};
}
