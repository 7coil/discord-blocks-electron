/* global Blockly */
/*
	MIT License

	Copyright (c) 2018 Moustacheminer Server Services

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

Blockly.Blocks.console_log = {
	init() {
		this.appendValueInput('text')
			.setCheck(null)
			.appendField('log');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(160);
		this.setTooltip('Outputs a message to the Web Console.');
		this.setHelpUrl('https://developer.mozilla.org/en/docs/Web/API/Console/log');
	}
};

Blockly.JavaScript.console_log = (block) => {
	const valueText = Blockly.JavaScript.valueToCode(block, 'text', Blockly.JavaScript.ORDER_ATOMIC);
	// TODO: Assemble JavaScript into code variable.
	const code = `console.log(${valueText});\n`;
	return code;
};

Blockly.Blocks.eval = {
	init() {
		this.appendValueInput('text')
			.setCheck(null)
			.appendField('eval');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(300);
		this.setTooltip('The eval() function evaluates JavaScript code represented as a string.');
		this.setHelpUrl('https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/eval');
	}
};

Blockly.JavaScript.eval = (block) => {
	const valueText = Blockly.JavaScript.valueToCode(block, 'text', Blockly.JavaScript.ORDER_ATOMIC);
	// TODO: Assemble JavaScript into code variable.
	const code = `eval(${valueText});\n`;
	return code;
};

Blockly.Blocks.mss_object = {
	init() {
		this.appendDummyInput()
			.appendField('Create new Object');
		this.setOutput(true, 'Object');
		this.setColour(300);
		this.setTooltip('The Object constructor creates an object wrapper.');
		this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object');
	}
};

Blockly.JavaScript.mss_object = () => {
	const code = '{}';
	return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.mss_object_set = {
	init() {
		this.appendValueInput('object')
			.setCheck('Object')
			.appendField('with');
		this.appendValueInput('token')
			.setCheck(null)
			.appendField('set key')
			.appendField(new Blockly.FieldTextInput('key'), 'key')
			.appendField('as');
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(300);
		this.setTooltip('Set a specific key in an object.');
		this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object');
	}
};

Blockly.JavaScript.mss_object_set = (block) => {
	const valueObject = Blockly.JavaScript.valueToCode(block, 'object', Blockly.JavaScript.ORDER_ATOMIC);
	const textKey = block.getFieldValue('key');
	const valueToken = Blockly.JavaScript.valueToCode(block, 'token', Blockly.JavaScript.ORDER_ATOMIC);
	const code = `${valueObject}['${textKey.replace(/'/g, '\\\'')}'] = ${valueToken};\n`;
	return code;
};

Blockly.Blocks.mss_property_get = {
	init() {
		this.appendValueInput('key')
			.setCheck('String')
			.appendField('get key');
		this.appendValueInput('object')
			.setCheck(null)
			.appendField('of');
		this.setInputsInline(false);
		this.setOutput(true, null);
		this.setColour(300);
		this.setTooltip('');
		this.setHelpUrl('');
	}
};

Blockly.JavaScript.mss_property_get = (block) => {
	const valueKey = Blockly.JavaScript.valueToCode(block, 'key', Blockly.JavaScript.ORDER_ATOMIC);
	const valueObject = Blockly.JavaScript.valueToCode(block, 'object', Blockly.JavaScript.ORDER_ATOMIC);
	const code = `${valueObject}['${valueKey.replace(/'/g, '\\\'')}']`;
	return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.mss_client_post = {
	init() {
		this.appendValueInput('client')
			.setCheck('Client')
			.appendField('With');
		this.appendDummyInput()
			.appendField('post guild count to')
			.appendField(new Blockly.FieldDropdown([['bots.discord.pw', 'bots.discord.pw'], ['discordbots.org', 'discordbots.org']]), 'website')
			.appendField('with')
			.appendField(new Blockly.FieldTextInput('token'), 'token');
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(40);
		this.setTooltip('Post your bot count to either bots.discord.pw or discordbots.org');
		this.setHelpUrl('https://bots.discord.pw/api');
	}
};

Blockly.JavaScript.mss_client_post = (block) => {
	const valueClient = Blockly.JavaScript.valueToCode(block, 'client', Blockly.JavaScript.ORDER_ATOMIC);
	const dropdownWebsite = block.getFieldValue('website');
	const textToken = block.getFieldValue('token');

	const code = `if (${valueClient}.browser) {
	//	console.error('Posting bot statistics is not yet allowed, because of cross site and XMLHttpRequest preflight problems.');
	$.ajax({
		method: 'POST',
		url: \`https://${dropdownWebsite}/api/bots/\${${valueClient}.user.id}/stats\`,
		data: {
			server_count: ${valueClient}.guilds.size
		},
		headers: {
			authorization: '${textToken}'
		},
		success: (data) => {
			console.log(data);
		}
	});
} else {
	const postData = JSON.stringify({
		server_count: ${valueClient}.guilds.size
	});

	const options = {
		hostname: '${dropdownWebsite}',
		path: \`/api/bots/\${${valueClient}.user.id}/stats\`,
		method: 'POST',
		headers: {
			'User-Agent': 'DiscordBot (https://moustacheminer.com/discord-blocks, 2017-09-14) DiscordBlocks',
			'Content-Type': 'application/json',
			'Content-Length': postData.length,
			Authorization: '${textToken}'
		}
	};

	const req = https.request(options, (res) => {
		res.on('data', (data) => {
			console.log(data.toString('utf8'));
		});
	});

	req.on('error', (error) => {
		console.error(error);
	});

	req.write(postData);
	req.end();
}
`;
	return code;
};

Blockly.Blocks.mss_json_stringify = {
	init() {
		this.appendValueInput('json')
			.setCheck('String')
			.appendField('JSON.stringify');
		this.setOutput(true, null);
		this.setColour(300);
		this.setTooltip('The JSON.stringify() method converts a JavaScript value to a JSON string, optionally replacing values if a replacer function is specified, or optionally including only the specified properties if a replacer array is specified.');
		this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify');
	}
};

Blockly.Blocks.mss_json_parse = {
	init() {
		this.appendValueInput('json')
			.setCheck('String')
			.appendField('JSON.parse');
		this.setOutput(true, null);
		this.setColour(300);
		this.setTooltip('The JSON.parse() method parses a JSON string, constructing the JavaScript value or object described by the string. An optional reviver function can be provided to perform a transformation on the resulting object before it is returned.');
		this.setHelpUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse');
	}
};

Blockly.JavaScript.mss_json_stringify = (block) => {
	const valueJson = Blockly.JavaScript.valueToCode(block, 'json', Blockly.JavaScript.ORDER_ATOMIC);
	const code = `JSON.stringify(${valueJson})`;
	return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.mss_json_parse = (block) => {
	const valueJson = Blockly.JavaScript.valueToCode(block, 'json', Blockly.JavaScript.ORDER_ATOMIC);
	const code = `JSON.parse(${valueJson})`;
	return [code, Blockly.JavaScript.ORDER_NONE];
};
