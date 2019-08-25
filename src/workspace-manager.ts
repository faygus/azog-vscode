import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import { arrayFromEnum } from './utils/enum';

export enum FileType {
	VIEW,
	VIEW_MODEL_ITF,
	VIEW_MODEL_MOCK,
	PIPE
}

export const WORKSPACE_FOLDERS = {
	[FileType.VIEW]: 'views',
	[FileType.VIEW_MODEL_ITF]: 'view-models.itf',
	[FileType.VIEW_MODEL_MOCK]: 'view-models.mock',
	[FileType.PIPE]: 'pipes',
};

export class WorkspaceManager {

	private _rootPath?: string;

	/**
 	* create the folder structure
 	* - views : contains the views
 	* - view-models.itf : contains the interfaces of the view-models
 	* - view-models.mock : contains the mock values for each view-models
 	*/
	initWorkspace(rootPath: string): void {
		this._rootPath = rootPath;
		const folderNames = Object.values(WORKSPACE_FOLDERS);
		for (const folderName of folderNames) {
			const dir = path.join(rootPath, folderName);
			createFolderIfNotExist(dir);
		}
	}

	pathIsView(filePath: string): boolean {
		const dirName = path.basename(path.dirname(filePath));
		return dirName === WORKSPACE_FOLDERS[FileType.VIEW];
	}

	pathIsViewModelInterface(filePath: string): boolean {
		const dirName = path.basename(path.dirname(filePath));
		return dirName === WORKSPACE_FOLDERS[FileType.VIEW_MODEL_ITF];
	}

	getViewModelInterfacePath(viewId: string): string {
		return path.join(this._rootPath!, WORKSPACE_FOLDERS[FileType.VIEW_MODEL_ITF], viewId);
	}

	getViewModelMockPath(viewId: string): string {
		return path.join(this._rootPath!, WORKSPACE_FOLDERS[FileType.VIEW_MODEL_MOCK], viewId + '.json');
	}

	getFileInfos(filePath: string): IFileInfos {
		const fileNameWithExtension = path.basename(filePath);
		const dirName = path.basename(path.dirname(filePath));
		const fileName = path.parse(fileNameWithExtension).name;
		const fileType = <FileType>Object.keys(WORKSPACE_FOLDERS).map(a => Number(a)).find(a => {
			const fileType = <FileType>a;
			return WORKSPACE_FOLDERS[fileType] === dirName;
		});
		const viewId = Number(fileName);
		const content = fs.readFileSync(filePath, 'utf8');
		switch (fileType) {
			case FileType.VIEW:
				return new FileInfos({ viewId }, fileType, content);
			case FileType.VIEW_MODEL_ITF:
				return new FileInfos({ viewId }, fileType, content);
			case FileType.VIEW_MODEL_MOCK:
				return new FileInfos({ viewId }, fileType, content);
			case FileType.PIPE:
				const id = Number(fileName);
				return new FileInfos({ id }, fileType, content);
		}
	}
}

function createFolderIfNotExist(dir: string): void {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
}

function writeAzogFile(): void {
	// const rootPath = context.extensionPath;
	const rootPath = vscode.workspace.rootPath;
	if (!rootPath) {
		console.error('no workspace opened');
		return;
	}
	const filePath = path.join(rootPath, '.azog');
	const fileContent = 'i am the file content';
	fs.writeFile(filePath, fileContent, err => {
		if (err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	});
}

type IFileInfos = FileInfos<FileType.VIEW> |
	FileInfos<FileType.VIEW_MODEL_ITF> |
	FileInfos<FileType.VIEW_MODEL_MOCK> |
	FileInfos<FileType.PIPE>;

interface IFileInfosDetailMappingTypes {
	[FileType.VIEW]: { viewId: number };
	[FileType.VIEW_MODEL_ITF]: { viewId: number };
	[FileType.VIEW_MODEL_MOCK]: { viewId: number };
	[FileType.PIPE]: { id: number };
}

class FileInfos<T extends keyof IFileInfosDetailMappingTypes> {
	constructor(public detail: IFileInfosDetailMappingTypes[T], public type: T, public content: string) {

	}
}

export const workspaceManager = new WorkspaceManager();
