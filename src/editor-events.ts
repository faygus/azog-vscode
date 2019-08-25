import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as vscode from 'vscode';

const delay = 100;

/**
 * Si l'on ferme l'éditeur actif, on recoit onDidChangeActiveTextEditor avec une valeur null,
 * puis onDidChangeVisibleTextEditors avec la liste des éditeurs visibles mise à jour,
 * puis onDidChangeActiveTextEditor avec le nouvel éditeur actif.
 * Ce comportement est problématique car si l'éditeur actif est null, on ferme la webview.
 * On fait donc en sorte d'envoyer la mise à jour de l'éditeur actif de manière décallée
 */
export class TextEditorEvents {
	private _activeTextEditorChanged$: Subject<vscode.TextEditor | undefined> = new Subject();
	private _visibleTextEditorsChanged$: Subject<vscode.TextEditor[]> = new Subject();

	constructor() {
		vscode.window.onDidChangeActiveTextEditor(editor => {
			this._activeTextEditorChanged$.next(editor);
		});
		vscode.window.onDidChangeVisibleTextEditors(editors => {
			this._visibleTextEditorsChanged$.next(editors);
		});
	}

	get activeTextEditorChanged$(): Observable<vscode.TextEditor | undefined> {
		return this._activeTextEditorChanged$.asObservable().pipe(
			debounceTime(delay) // we send active activeTextEditorChanged before visibleTextEditorsChanged
		);
	}

	get visibleTextEditorsChanged$(): Observable<vscode.TextEditor[]> {
		return this._visibleTextEditorsChanged$.asObservable().pipe(
			debounceTime(delay + 100)
		);
	}
}


export const textEditorEvents = new TextEditorEvents();