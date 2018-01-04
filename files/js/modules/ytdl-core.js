/* global Blockly */
/*
	Blockly modules for node-ytdl-core
	https://github.com/fent/node-ytdl-core
*/

Blockly.Blocks.mss_ytdl = {
	init() {
		this.appendValueInput('video')
			.setCheck(null)
			.appendField('Download YouTube video');
		this.appendValueInput('options')
			.setCheck(null)
			.appendField('with optional settings');
		this.setOutput(true, null);
		this.setColour(300);
		this.setTooltip('Attempts to download a video from the given url. Returns a readable stream.');
		this.setHelpUrl('https://github.com/fent/node-ytdl-core#ytdlurl-options');
	}
};

Blockly.JavaScript.mss_ytdl = (block) => {
	const valueVideo = Blockly.JavaScript.valueToCode(block, 'video', Blockly.JavaScript.ORDER_ATOMIC);
	const valueOptions = Blockly.JavaScript.valueToCode(block, 'options', Blockly.JavaScript.ORDER_ATOMIC);
	const code = `ytdl(${valueVideo},${valueOptions})`;
	return [code, Blockly.JavaScript.ORDER_NONE];
};
