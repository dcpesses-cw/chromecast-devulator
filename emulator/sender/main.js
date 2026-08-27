import {
	DEFAULT_MEDIA,
	DEFAULT_QUEUED_MEDIA,
	LOAD_REQUEST_STORAGE_KEYS,
	TemplateLoadRequestEnum
} from '../src/lib/constants.js';
import { icons, createIconButton } from '../src/lib/icons.js';
import {
	messageConnected,
	messageJumpItem,
	messageMediaLoad,
	messageMute,
	messagePause,
	messagePlay,
	messageReady,
	messageSeek,
	messageSkipBack,
	messageSkipForward,
	messageStop,
	messageVolume
} from '../src/lib/messages.js';
import sendMessage from '../src/lib/sendMessage.js';
import { getMediaSessionId, setMediaSessionId } from '../src/lib/store.js';
import { mountLoadRequestInput } from '../src/components/loadRequestInput.js';
import { mountProgressBar } from '../src/components/progressBar.js';

const CAST_WEBSOCKET_URL = 'ws://localhost:8008/v2/ipc';

const state = {
	ws: null,
	volume: 50,
	muted: false,
	isConnected: false,
	currentTime: 0,
	templateLoadRequest: TemplateLoadRequestEnum.BASIC,
	loadRequest: JSON.stringify(DEFAULT_MEDIA, null, 2),
	currentMediaInfo: null
};

const elements = {
	castStatusLabel: document.getElementById('cast-status-label'),
	castButton: document.getElementById('cast-button'),
	openReceiver: document.getElementById('open-receiver'),
	reelIcon: document.getElementById('reel-icon'),
	loadButton: document.getElementById('load-button'),
	mediaTitle: document.getElementById('media-title'),
	mediaSubtitle: document.getElementById('media-subtitle'),
	mediaThumb: document.getElementById('media-thumb'),
	progressBar: document.getElementById('progress-bar'),
	playbackControls: document.getElementById('playback-controls'),
	seekControls: document.getElementById('seek-controls'),
	muteButton: document.getElementById('mute-button'),
	volumeSlider: document.getElementById('volume-slider'),
	templateBasic: document.getElementById('template-basic'),
	templateQueue: document.getElementById('template-queue'),
	templateFromLocalStorage1: document.getElementById('template-from-localstorage1'),
	templateFromLocalStorage2: document.getElementById('template-from-localstorage2'),
	templateFromLocalStorage3: document.getElementById('template-from-localstorage3'),
	saveToLocalStorage1: document.getElementById('save-to-localstorage1'),
	saveToLocalStorage2: document.getElementById('save-to-localstorage2'),
	saveToLocalStorage3: document.getElementById('save-to-localstorage3'),
	loadRequestInput: document.getElementById('load-request-input')
};

const templateLoadOptions = [
	{ label: elements.templateBasic, type: TemplateLoadRequestEnum.BASIC },
	{ label: elements.templateQueue, type: TemplateLoadRequestEnum.BASIC_QUEUE },
	{ label: elements.templateFromLocalStorage1, type: TemplateLoadRequestEnum.LOCAL_STORAGE_1 },
	{ label: elements.templateFromLocalStorage2, type: TemplateLoadRequestEnum.LOCAL_STORAGE_2 },
	{ label: elements.templateFromLocalStorage3, type: TemplateLoadRequestEnum.LOCAL_STORAGE_3 }
];

const saveToLocalStorageButtons = [
	elements.saveToLocalStorage1,
	elements.saveToLocalStorage2,
	elements.saveToLocalStorage3
];

function parseTemplateValue(value) {
	if (value === TemplateLoadRequestEnum.BASIC || value === TemplateLoadRequestEnum.BASIC_QUEUE) {
		return value;
	}

	const slot = Number(value);
	if (slot >= TemplateLoadRequestEnum.LOCAL_STORAGE_1 && slot <= TemplateLoadRequestEnum.LOCAL_STORAGE_3) {
		return slot;
	}

	return TemplateLoadRequestEnum.BASIC;
}

function getStorageKeyForTemplate(type) {
	const slotIndex = type - TemplateLoadRequestEnum.LOCAL_STORAGE_1;
	return LOAD_REQUEST_STORAGE_KEYS[slotIndex] ?? null;
}

function isCustomTemplate(type) {
	return (
		type >= TemplateLoadRequestEnum.LOCAL_STORAGE_1 &&
		type <= TemplateLoadRequestEnum.LOCAL_STORAGE_3
	);
}

function getDuration() {
	return state.currentMediaInfo?.duration || 0;
}

function getMetadata() {
	return state.currentMediaInfo?.metadata || {};
}

function updateConnectionUI() {
	const color = state.isConnected ? 'var(--col-obj-success)' : 'white';
	elements.castStatusLabel.style.color = color;
	elements.castButton.style.setProperty('--cast-connected', color);
}

function updateMediaUI() {
	const { title = '', subtitle = '', images = [] } = getMetadata();
	elements.mediaTitle.innerHTML = title || '&nbsp;';
	elements.mediaSubtitle.innerHTML = subtitle || '&nbsp;';
	elements.mediaThumb.src = images?.[0]?.url || '/idle-icon.png';
	progressBar.update();
}

function updateMuteUI() {
	elements.muteButton.innerHTML = '';
	elements.muteButton.append(
		createIconButton(state.muted ? icons.mute : icons.sound, handleMute)
	);
	elements.volumeSlider.disabled = state.muted;
}

function handleSenderWarmup() {
	sendMessage(state.ws, messageReady());
	queueMicrotask(() => {
		sendMessage(state.ws, messageConnected());
	});
}

function handleMediaLoad() {
	try {
		const mediaInfo = JSON.parse(state.loadRequest);
		console.log(mediaInfo);
		sendMessage(state.ws, messageMediaLoad(mediaInfo));
	} catch (e) {
		console.error(e);
	}
}

function handleMute() {
	state.muted = !state.muted;
	sendMessage(state.ws, messageMute(state.volume, state.muted));
	updateMuteUI();
}

function handleTimeUpdate(time) {
	state.currentTime = time;
	sendMessage(state.ws, messageSeek(state.currentTime));
}

function loadCustomLoadRequestFromLocalStorage(type) {
	const storageKey = getStorageKeyForTemplate(type);
	const saved = localStorage.getItem(storageKey);

	if (!saved) {
		console.warn(`No load request found in localStorage for Custom ${type}`);
		return '{}'; // JSON.stringify(DEFAULT_MEDIA, null, 2);
	}

	try {
		return JSON.stringify(JSON.parse(saved), null, 2);
	} catch (e) {
		console.error(`Saved load request for Custom ${type} is invalid JSON`, e);
		return saved;
	}
}

function saveCustomLoadRequestToLocalStorage(slotIndex) {
	const storageKey = LOAD_REQUEST_STORAGE_KEYS[slotIndex];
	const value = loadRequestInput.getEditorValue();

	try {
		JSON.parse(value);
		localStorage.setItem(storageKey, value);
	} catch (e) {
		console.error(`Cannot save invalid JSON to Custom ${slotIndex + 1}`, e);
	}
}

function handleLoadRequestTemplateChange(type) {
	state.templateLoadRequest = type;
	templateLoadOptions.forEach(({ label, type: templateType }) => {
		label.classList.toggle('active', templateType === type);
	});

	switch (type) {
		case TemplateLoadRequestEnum.BASIC:
			state.loadRequest = JSON.stringify(DEFAULT_MEDIA, null, 2);
			break;
		case TemplateLoadRequestEnum.BASIC_QUEUE:
			state.loadRequest = JSON.stringify(DEFAULT_QUEUED_MEDIA, null, 2);
			break;
		default:
			if (isCustomTemplate(type)) {
				state.loadRequest = loadCustomLoadRequestFromLocalStorage(type);
			}
			break;
	}

	loadRequestInput.setExternalValue(state.loadRequest);
}

function initWebSocket() {
	state.ws = new WebSocket(CAST_WEBSOCKET_URL);

	state.ws.addEventListener('open', () =>
		sendMessage(state.ws, {
			message: 'Sender is connected! ' + navigator.userAgent,
			sender: true
		})
	);

	state.ws.addEventListener('message', (msg) => {
		const data = JSON.parse(msg.data);
		const { type } = data || {};

		if (
			data.namespace === 'urn:x-cast:com.google.cast.system' &&
			data.data.includes('senderconnected')
		) {
			state.isConnected = true;
			updateConnectionUI();
		}

		if (type === 'MEDIA_STATUS') {
			const updatedMediaStatus = data.status?.[0];
			const updatedMediaInfo = updatedMediaStatus?.media;
			if (updatedMediaInfo) {
				state.currentMediaInfo = updatedMediaInfo;
			}

			const sessionId = updatedMediaStatus?.mediaSessionId;
			if (sessionId && sessionId !== getMediaSessionId()) {
				setMediaSessionId(sessionId);
			}

			if (updatedMediaStatus?.currentTime) {
				state.currentTime = updatedMediaStatus.currentTime;
			}

			updateMediaUI();
		}
	});
}

elements.reelIcon.append(createIconButton(icons.reel, () => window.open('/receiver/', '_blank')));
elements.castButton.append(createIconButton(icons.cast, handleSenderWarmup));
elements.loadButton.append(createIconButton(icons.send, handleMediaLoad));

// media controls
[
	[icons.play, () => sendMessage(state.ws, messagePlay())],
	[icons.pause, () => sendMessage(state.ws, messagePause())],
	[icons.stop, () => sendMessage(state.ws, messageStop())],
	[icons.prev, () => sendMessage(state.ws, messageJumpItem(-1))],
	[icons.next, () => sendMessage(state.ws, messageJumpItem(1))]
].forEach(([icon, handler]) => {
	elements.playbackControls.append(createIconButton(icon, handler));
});

[
	[icons.seekBack, () => sendMessage(state.ws, messageSkipBack())],
	[icons.seekForward, () => sendMessage(state.ws, messageSkipForward())]
].forEach(([icon, handler]) => {
	elements.seekControls.append(createIconButton(icon, handler));
});

updateMuteUI();

elements.volumeSlider.addEventListener('input', () => {
	state.volume = Number(elements.volumeSlider.value);
});

elements.volumeSlider.addEventListener('change', () => {
	sendMessage(state.ws, messageVolume(state.volume));
});

document.querySelectorAll('input[name="template"]').forEach((input) => {
	input.addEventListener('change', (ev) => {
		handleLoadRequestTemplateChange(parseTemplateValue(ev.target.value));
	});
});

const loadRequestInput = mountLoadRequestInput(elements.loadRequestInput, {
	getValue: () => state.loadRequest,
	setValue: (value) => {
		state.loadRequest = value;
	}
});

saveToLocalStorageButtons.forEach((button, slotIndex) => {
	button.addEventListener('click', () => saveCustomLoadRequestToLocalStorage(slotIndex));
});

const progressBar = mountProgressBar(elements.progressBar, {
	getCurrentTime: () => state.currentTime,
	setCurrentTime: (time) => {
		state.currentTime = time;
	},
	getDuration,
	onTimeUpdate: handleTimeUpdate
});

updateConnectionUI();
initWebSocket();

window.addEventListener('beforeunload', () => {
	state.ws?.close();
});
