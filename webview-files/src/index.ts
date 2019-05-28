import * as azog from 'azog';
require("../node_modules/font-awesome/css/font-awesome.min.css");

const containerHtml = document.createElement('div');
containerHtml.style.width = '400px';
containerHtml.style.height = '200px';
containerHtml.style.border = 'solid 2px red';
containerHtml.style.position = 'relative';
document.body.appendChild(containerHtml);

// Handle the message inside the webview
window.addEventListener('message', event => {
	const message = event.data; // The JSON data our extension sent
	if (message.azogApp) {
		const appJSON = message.azogApp;
		while (containerHtml.lastChild) {
			containerHtml.lastChild.remove();
		}
		try {
			const parser = new azog.Parser(appJSON);
			const component = parser.parse(1);
			azog.HTMLRenderer.render(component, containerHtml);
		} catch (err) {
			// TODO handle error
		}
	}
});
