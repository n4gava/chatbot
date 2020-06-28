import { ChatBotFileSystem } from "./fileSystem.types";
import path from "path";
import fs from "fs";

export default class FileSystem implements ChatBotFileSystem.IFileSystem {
	private enconding: BufferEncoding = "utf-8";

	constructor(private folder: string) {}

	public writeFile(filePath: string, data: string): void {
		const fullPath = this.getFullPath(filePath);
		this.createFolderIfDoesNotExists(fullPath);
		fs.writeFileSync(fullPath, data, this.enconding);
	}

	public async writeFileAsync(filePath: string, data: string): Promise<void> {
		const fullPath = this.getFullPath(filePath);
		this.createFolderIfDoesNotExists(fullPath);
		await fs.promises.writeFile(fullPath, data, this.enconding);
	}

	public readFile(filePath: string): string {
		const fullPath = this.getFullPath(filePath);
		if (!this.pathExists(fullPath)) return "";

		return fs.readFileSync(fullPath, this.enconding);
	}

	public async readFileAsync(filePath: string): Promise<string> {
		const fullPath = this.getFullPath(filePath);
		if (!this.pathExists(fullPath)) return "";

		return await fs.promises.readFile(fullPath, this.enconding);
	}

	public deleteFile(filePath: string): void {
		const fullPath = this.getFullPath(filePath);
		fs.unlinkSync(fullPath);
	}

	public async deleteFileAsync(filePath: string): Promise<void> {
		await fs.promises.unlink(filePath);
	}

	public pathExists(filePath: string): boolean {
		const fullPath = this.getFullPath(filePath);
		return fs.existsSync(fullPath);
	}

	private createFolderIfDoesNotExists(fullPath: string) {
		const dirName = path.dirname(fullPath);

		if (!this.pathExists(dirName)) {
			fs.mkdirSync(dirName, { recursive: true });
		}
	}

	private getFullPath(filePath: string) {
		return path.resolve(this.folder, filePath);
	}
}
