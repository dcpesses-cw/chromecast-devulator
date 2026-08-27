export const TemplateLoadRequestEnum = {
	BASIC: 'basic',
	BASIC_QUEUE: 'basic-queue',
	LOCAL_STORAGE_1: 1,
	LOCAL_STORAGE_2: 2,
	LOCAL_STORAGE_3: 3
};

export const LOAD_REQUEST_STORAGE_KEYS = [
	'chromecast-emulator-load-request-1',
	'chromecast-emulator-load-request-2',
	'chromecast-emulator-load-request-3'
];

export const DEFAULT_QUEUED_MEDIA = {
	type: 'LOAD',
	requestId: Date.now(),
	media: {
		contentUrl:
			'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4',
		streamType: 'BUFFERED',
		metadata: {
			metadataType: 1,
			title: 'Item 1',
			subtitle: 'Big Buck Bunny'
		}
	},
	queueData: {
		name: 'Queue Name',
		repeatMode: 'REPEAT_OFF',
		items: [
			{
				startTime: 0,
				media: {
					contentType: 'video/mp4',
					contentUrl:
						'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4',
					streamType: 'BUFFERED',
					metadata: {
						metadataType: 1,
						title: 'Item 1',
						subtitle: 'Big Buck Bunny'
					}
				}
			},
			{
				autoplay: true,
				startTime: 0,
				preloadTime: 20,
				media: {
					contentType: 'video/mp4',
					contentUrl:
						'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
					streamType: 'BUFFERED',
					metadata: {
						metadataType: 1,
						title: 'Item 2',
						subtitle: 'Tears of Steel'
					}
				}
			},
			{
				autoplay: true,
				startTime: 0,
				preloadTime: 10,
				media: {
					contentType: 'video/mp4',
					contentUrl:
						'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
					streamType: 'BUFFERED',
					metadata: {
						metadataType: 1,
						title: 'Item 3',
						subtitle: 'Bipbop Adventure'
					}
				}
			}
		]
	}
};

export const DEFAULT_MEDIA = {
	type: 'LOAD',
	requestId: Date.now(),
	media: {
		contentId: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
		metadata: {
			title: 'Big Buck Bunny',
			subtitle: 'Gettin Real Tired of Big Buck Bunny',
			images: [{ url: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png' }]
		},
		contentType: 'video/mp4',
		streamType: 'BUFFERED',
		mediaCategory: 'VIDEO'
	}
};
