import * as vscode from 'vscode';
import * as path from 'path';

export function updateDiagnostics(document: vscode.TextDocument,
	collection: vscode.DiagnosticCollection): void {

	/*if (document && path.basename(document.uri.fsPath) === 'sample-demo.rs') {
		collection.set(document.uri, [{
			code: '',
			message: 'cannot assign twice to immutable variable `x`',
			range: new vscode.Range(new vscode.Position(3, 4), new vscode.Position(3, 10)),
			severity: vscode.DiagnosticSeverity.Error,
			source: 'toto',
			relatedInformation: [
				new vscode.DiagnosticRelatedInformation(
					new vscode.Location(document.uri,
						new vscode.Position(1, 4)
					),
					'first assignment to `x`'
				)
			]
		}]);
	} else {
		collection.clear();
	}*/
}
