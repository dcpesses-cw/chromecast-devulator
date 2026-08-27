export const IPC_EMULATION_NAMESPACE = 'urn:x-cast:cast-emulation';

const sendMessage = (ws, message) => {
	if (typeof window === 'undefined') return;
	if (ws?.readyState !== WebSocket.OPEN) return;

	const ipcData = JSON.stringify({
		namespace: IPC_EMULATION_NAMESPACE,
		data: JSON.stringify(message)
	});

	ws.send(new Blob([ipcData]));
};

export default sendMessage;
