const receiverRoot = document.getElementById('receiver-root');

let castContext = null;

const updateLoadRequest = (loadRequest) => {
	loadRequest.autoplay = true;
	return loadRequest;
};

const waitForCastAvailable = () => {
	if (cast?.framework) {
		startReceiver();
		return;
	}
	setTimeout(waitForCastAvailable, 100);
};

const startReceiver = () => {
	castContext = cast.framework.CastReceiverContext.getInstance();
	const options = new cast.framework.CastReceiverOptions();
	options.shakaVersion = '4.9.2';
	options.useShakaForHls = true;
	castContext.start(options);

	castContext
		.getPlayerManager()
		.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, updateLoadRequest);

	castContext
		.getPlayerManager()
		.addEventListener(cast.framework.events.EventType.TIME_UPDATE, () => {
			castContext.getPlayerManager().broadcastStatus(true);
		});

	receiverRoot.innerHTML = '<cast-media-player></cast-media-player>';
};

waitForCastAvailable();

window.addEventListener('beforeunload', () => {
	castContext?.stop();
});
