import { getMediaSessionId } from './store.js';

export const messageReady = () => ({
	namespace: 'urn:x-cast:com.google.cast.system',
	senderId: 'SystemSender',
	data: {
		type: 'ready',
		activeNamespaces: [
			'urn:x-cast-com:google.cast.debugoverlay',
			'urn:x-cast-com:google.cast.cac',
			'urn:x-cast-com:google.cast.media',
			'urn:x-cast-com:google.cast.inject'
		],
		messagesVersion: '1.0',
		sdkCapabilities: {
			show_media_controls_group_supported: true,
			group_capabilities_supported: true,
			playback_device_status_supported: true
		}
	}
});

export const messageConnected = () => ({
	namespace: 'urn:x-cast:com.google.cast.system',
	senderId: 'sender-0',
	data: {
		type: 'senderconnected',
		senderId: 'sender-0'
	}
});

export const messagePlay = () => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'PLAY',
		mediaSessionId: getMediaSessionId(),
		requestId: Date.now()
	}
});

export const messagePause = () => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'PAUSE',
		mediaSessionId: getMediaSessionId(),
		requestId: Date.now()
	}
});

export const messageStop = () => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'STOP',
		mediaSessionId: getMediaSessionId(),
		requestId: Date.now()
	}
});

export const messageMute = (volume, muted) => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'SET_VOLUME',
		volume: {
			level: volume / 100,
			muted
		},
		mediaSessionId: getMediaSessionId(),
		requestId: Date.now()
	}
});

export const messageSkipBack = (timeSec = 10) => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'SEEK',
		resumeState: 'PLAYBACK_START',
		currentTime: 0,
		relativeTime: timeSec * -1.0,
		requestId: Date.now(),
		mediaSessionId: getMediaSessionId()
	}
});

export const messageSkipForward = (timeSec = 10) => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'SEEK',
		resumeState: 'PLAYBACK_START',
		currentTime: 0,
		relativeTime: timeSec,
		requestId: Date.now(),
		mediaSessionId: getMediaSessionId()
	}
});

export const messageSeek = (timeSec) => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'SEEK',
		resumeState: 'PLAYBACK_START',
		currentTime: timeSec,
		requestId: Date.now(),
		mediaSessionId: getMediaSessionId()
	}
});

export const messageVolume = (volume) => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'SET_VOLUME',
		volume: {
			level: volume / 100,
			muted: false
		},
		mediaSessionId: getMediaSessionId(),
		requestId: Date.now()
	}
});

export const messageJumpItem = (jump = 1) => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'QUEUE_UPDATE',
		jump,
		requestId: Date.now(),
		mediaSessionId: getMediaSessionId()
	}
});

export const messageMediaLoad = (media) => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: media
});
