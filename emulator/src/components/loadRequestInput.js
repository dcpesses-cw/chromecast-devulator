const TAB_UNICODE = '\u2003';

const validateJSONInput = (text) => text;

const insertNodeAtCurrentSelection = (node) => {
	const sel = window.getSelection();
	sel?.getRangeAt(0).insertNode(node);
	sel?.collapseToEnd();
	return node;
};

const insertTextAtCurrentSelection = (text) => {
	const node = document.createElement('span');
	node.innerHTML = text;
	return insertNodeAtCurrentSelection(node);
};

const offsetCaret = (node, offset) => {
	const sel = window.getSelection();
	if (!sel) return;

	const range = new Range();
	range.selectNode(node);
	range.setEnd(node, offset);

	sel.removeAllRanges();
	sel.addRange(range);
	sel.collapseToEnd();
};

export function mountLoadRequestInput(container, { getValue, setValue }) {
	const wrapper = document.createElement('div');
	wrapper.className = 'load-request-input';

	const input = document.createElement('pre');
	input.className = 'load-request-input__input';
	input.contentEditable = 'true';
	input.spellcheck = false;

	const placeholder = document.createElement('div');
	placeholder.className = 'load-request-input__placeholder';
	placeholder.textContent = 'Write your Load Request Here...';

	wrapper.append(input, placeholder);
	container.append(wrapper);

	let lastValue = getValue();
	input.textContent = lastValue;

	const updatePlaceholder = () => {
		placeholder.hidden = Boolean(input.textContent);
	};

	const validateAndSync = () => {
		const sanitizedJSONString = validateJSONInput(input.textContent);
		try {
			const isValid = Boolean(JSON.parse(sanitizedJSONString));
			input.classList.toggle('valid', isValid);
			if (isValid) {
				lastValue = sanitizedJSONString;
				setValue(sanitizedJSONString);
			}
		} catch {
			input.classList.remove('valid');
		}
		updatePlaceholder();
	};

	input.addEventListener('input', validateAndSync);

	input.addEventListener('keydown', (ev) => {
		if (ev.key === 'Tab') {
			ev.preventDefault();
			ev.stopPropagation();
			insertTextAtCurrentSelection(TAB_UNICODE);
		} else if (ev.key === '{') {
			ev.preventDefault();
			const node = insertTextAtCurrentSelection('{');
			insertTextAtCurrentSelection('}');
			offsetCaret(node, 1);
		} else if (ev.key === 'Enter') {
			const sel = window.getSelection();
			if (!sel) return;
			const range = sel.getRangeAt(0);
			if (!range) return;

			let hasPreceedingParen = false;
			let hasSucceedingParen = false;

			const currNode = range.startContainer;
			if (currNode) {
				if (currNode.textContent === '{') hasPreceedingParen = true;
				const nextNode = currNode.nextSibling;
				if (nextNode && nextNode.textContent?.endsWith('')) hasSucceedingParen = true;
			}

			if (hasPreceedingParen && hasSucceedingParen) {
				const nextNode = currNode.nextSibling;
				if (nextNode) {
					nextNode.textContent = '\n' + nextNode.textContent;
				}
			}
		}
	});

	updatePlaceholder();
	validateAndSync();

	return {
		setExternalValue(value) {
			if (value !== lastValue) {
				lastValue = value;
				input.textContent = value;
				validateAndSync();
			}
		},
		getValue: () => lastValue
	};
}
