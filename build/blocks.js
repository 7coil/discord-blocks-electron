/* eslint-disable import/no-dynamic-require */
const js2xmlparser = require('js2xmlparser');
const fs = require('fs');

const version = '11.2.0';
const colour = {
	construct: 160,
	prop: 230,
	method: 40,
	event: 100
};
const header = `/* global Blockly */
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
/*
	THIS FILE IS AUTOMATICALLY GENERATED BY /build/blocks.js
	DO NOT OVERWRITE AS YOUR CHANGES MAY BE REMOVED

	Instead, update the jsdoc of Discord.js
	https://github.com/hydrabolt/discord.js
*/`;

const docs = require(`./discordjs/${version}.json`);
const url = `https://discord.js.org/#/docs/main/${version}/`;
let code = header;

const xml = {
	category: []
};

const escapeTooltip = string => (string || '').replace(/\n/g, '\\n').replace(/'/g, '\\\'');

// c for class
docs.classes.forEach((c) => {
	// Pollute the useless space!
	const temp = {};
	if (c.access !== 'private') {
		const currclass = {
			'@': {
				name: c.name
			},
			'#': '',
			block: []
		};

		// Constructor
		if (c.construct) {
			temp.with = '';
			temp.blockInputs = '';
			temp.codeInputs = '';
			temp.codeAttributes = '';
			temp.params = c.construct.params.filter(current => !current.name.includes('.'));

			if (temp.params.length) {
				// Add the word "with" for the block
				temp.with = ' with ';
				temp.params.forEach((parameter) => {
					// Inputs for the block definition
					temp.blockInputs += `
		this.appendValueInput('${parameter.name}')
			.setCheck(null);`;

					// Inputs for the code generator
					temp.codeInputs += `
	const ${parameter.name} = Blockly.JavaScript.valueToCode(block, '${parameter.name}', Blockly.JavaScript.ORDER_ATOMIC);`;
				});
				temp.codeAttributes = temp.params.map(parameter => `\${${parameter.name}}`).join();
			}
			code += `
Blockly.Blocks.${c.name}_constructor = {
	init() {
		this.appendDummyInput()
			.appendField('Create a new ${c.name}${temp.with}');${temp.blockInputs}
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(${colour.construct});
		this.setTooltip('${escapeTooltip(c.description)}');
		this.setHelpUrl('${url}class/${c.name}');
	}
};

Blockly.JavaScript.${c.name}_constructor = (block) => {${temp.codeInputs}
	const code = \`new Discord.${c.name}(${temp.codeAttributes})\`;
	return [code, Blockly.JavaScript.ORDER_NONE];
};
`;
			currclass.block.push({
				'@': {
					type: `${c.name}_constructor`
				},
				'#': ''
			});
		}

		// Properties
		if (c.props) {
			c.props.filter(property => property.access !== 'private')
				.forEach((property) => {
					code += `
Blockly.Blocks.${c.name}_${property.name} = {
	init() {
		this.appendValueInput('${c.name}')
			.setCheck(null)
			.appendField('obtain ${property.name} of');
		this.setInputsInline(true);
		this.setOutput(true, null);
		this.setColour(${colour.prop});
		this.setTooltip('${escapeTooltip(property.description)}');
		this.setHelpUrl('${url}class/${c.name}?scrollTo=${property.name}');
	}
};

Blockly.JavaScript.${c.name}_${property.name} = (block) => {
	const ${c.name} = Blockly.JavaScript.valueToCode(block, '${c.name}', Blockly.JavaScript.ORDER_ATOMIC);
	const code = \`\${${c.name}}.${property.name}\`;
	return [code, Blockly.JavaScript.ORDER_NONE];
};
`;
					currclass.block.push({
						'@': {
							type: `${c.name}_${property.name}`
						},
						'#': ''
					});
				});
		}

		// Methods
		if (c.methods) {
			c.methods.filter(property => property.access !== 'private')
				.forEach((method) => {
					temp.blockReturn = `
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);`;
					temp.promise = false;
					temp.codeReturn = 'code';
					temp.codeNewLine = ';\\n';
					temp.with = '';
					temp.blockInputs = '';
					temp.codeInputs = '';
					temp.codeAttributes = '';
					temp.params = method.params ? method.params.filter(current => !current.name.includes('.')) : [];

					if (method.returns) {
						temp.returnoutput = method.returns.types || method.returns;
						if (temp.returnoutput[0][0][0] !== 'Promise') {
							temp.blockReturn = `
		this.setOutput(true, null);`;
							temp.codeReturn = '[code, Blockly.JavaScript.ORDER_NONE]';
							temp.codeNewLine = '';
						} else {
							temp.promise = true;
						}
					}

					if (temp.params.length) {
						// Add the word "with" for the block
						temp.with = ' with';
						temp.params.forEach((parameter) => {
							// Inputs for the block definition
							temp.blockInputs += `
		this.appendValueInput('${parameter.name}')
			.setCheck(null);`;

							// Inputs for the code generator
							temp.codeInputs += `
	const ${parameter.name} = Blockly.JavaScript.valueToCode(block, '${parameter.name}', Blockly.JavaScript.ORDER_ATOMIC);`;
						});
						temp.codeAttributes = temp.params.map(parameter => `\${${parameter.name}}`).join();
					}

					code += `
Blockly.Blocks.${c.name}_${method.name} = {
	init() {
		this.appendValueInput('${c.name}')
			.setCheck(null)
			.appendField('with');
		this.appendDummyInput()
			.appendField('${method.name}${temp.with}');${temp.blockInputs}
		this.setInputsInline(true);${temp.blockReturn}
		this.setColour(${colour.method});
		this.setTooltip('${escapeTooltip(method.description)}');
		this.setHelpUrl('${url}class/${c.name}?scrollTo=${method.name}');
	}
};

Blockly.JavaScript.${c.name}_${method.name} = (block) => {
	const ${c.name} = Blockly.JavaScript.valueToCode(block, '${c.name}', Blockly.JavaScript.ORDER_ATOMIC);${temp.codeInputs}
	const code = \`\${${c.name}}.${method.name}(${temp.codeAttributes})${temp.codeNewLine}\`;
	return ${temp.codeReturn};
};
`;
					currclass.block.push({
						'@': {
							type: `${c.name}_${method.name}`
						},
						'#': ''
					});

					if (temp.promise) {
						if (method.returns) {
							temp.returnoutput = method.returns.types || method.returns;
							temp.returns = temp.returnoutput[0]
								.map(type => type[0])
								.filter(type => type !== 'Promise');
							temp.promisereturns = '';
							temp.returns.forEach((type, index) => {
								temp.promisereturns += `
			.appendField(new Blockly.FieldVariable('${type}'), 'input${index}')`;
								temp.codeInputs += `
	const input${index} = block.getFieldValue('input${index}');`;
							});
							temp.inputattributes = temp.returns.map((type, index) => `\${input${index}}`).join();
						}
						code += `
Blockly.Blocks.${c.name}_${method.name}_promise = {
	init() {
		this.appendValueInput('${c.name}')
			.setCheck(null)
			.appendField('with');
		this.appendDummyInput()
			.appendField('${method.name}${temp.with}');${temp.blockInputs}
		this.appendDummyInput()
			.appendField('then')${temp.promisereturns};
		this.appendStatementInput('then')
			.setCheck(null);
		this.appendDummyInput()
			.appendField('catch');
		this.appendStatementInput('catch')
			.setCheck(null);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(${colour.method});
		this.setTooltip('${escapeTooltip(method.description)}');
		this.setHelpUrl('${url}class/${c.name}?scrollTo=${method.name}');
	}
};

Blockly.JavaScript.${c.name}_${method.name}_promise = (block) => {
	const ${c.name} = Blockly.JavaScript.valueToCode(block, '${c.name}', Blockly.JavaScript.ORDER_ATOMIC);${temp.codeInputs}
	const thenStatements = Blockly.JavaScript.statementToCode(block, 'then');
	const catchStatements = Blockly.JavaScript.statementToCode(block, 'catch');
	const code = \`\${${c.name}}.${method.name}(${temp.codeAttributes})
  .then((${temp.inputattributes}) => {
    \${thenStatements}
  })
  .catch((error) => {
    console.error(error);
    \${catchStatements}
  });\\n\`;
	return ${temp.codeReturn};
};
`;
						currclass.block.push({
							'@': {
								type: `${c.name}_${method.name}_promise`
							},
							'#': ''
						});
					}
				});
		}

		// Events
		if (c.events) {
			c.events.filter(property => property.access !== 'private')
				.forEach((event) => {
					temp.with = '';
					temp.blockInputs = '';
					temp.codeInputs = '';
					temp.codeAttributes = '';
					temp.params = event.params ? event.params.filter(current => !current.name.includes('.')) : [];

					if (temp.params.length) {
						// Add the word "with" for the block
						temp.with = ' with';
						temp.params.forEach((parameter) => {
							// Inputs for the block definition
							temp.blockInputs += `
			.appendField(new Blockly.FieldVariable('${parameter.name}'), '${parameter.name}')`;

							// Inputs for the code generator
							temp.codeInputs += `
	const ${parameter.name} = block.getFieldValue('${parameter.name}');`;
						});
						temp.codeAttributes = temp.params.map(parameter => `\${${parameter.name}}`).join();
					}

					code += `
Blockly.Blocks.${c.name}_${event.name} = {
	init() {
		this.appendValueInput('${c.name}')
			.setCheck(null)
			.appendField('when');
		this.appendDummyInput()
			.appendField('emits ${event.name}')${temp.blockInputs};
		this.appendStatementInput('function')
			.setCheck(null);
		this.setInputsInline(true);
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(${colour.event});
		this.setTooltip('${escapeTooltip(event.description)}');
		this.setHelpUrl('${url}class/${c.name}?scrollTo=${event.name}');
	}
};

Blockly.JavaScript.${c.name}_${event.name} = (block) => {
	const ${c.name} = Blockly.JavaScript.valueToCode(block, '${c.name}', Blockly.JavaScript.ORDER_ATOMIC);${temp.codeInputs}
	const statementsFunction = Blockly.JavaScript.statementToCode(block, 'function');
	const code = \`\${${c.name}}.on('${event.name}', (${temp.codeAttributes}) => {\\n\${statementsFunction}});\\n\`;
	return code;
};
`;
					currclass.block.push({
						'@': {
							type: `${c.name}_${event.name}`
						},
						'#': ''
					});
				});
		}

		xml.category.push(currclass);
	}
});

fs.writeFile('./app/files/xml/toolbox.xml', js2xmlparser.parse('xml', xml, {
	format: {
		doubleQuotes: true,
		indent: '\t',
		newline: '\n',
		pretty: true
	}
}), (err) => {
	if (err) {
		console.dir(err);
	} else {
		console.log('toolbox saved!');
	}
});

fs.writeFileSync('./app/files/js/discordblocks/blocks.js', code);

