export namespace ChatBotFileSystem {
	export interface IFileSystem {
		writeFile(filePath: string, data: string): void;

		writeFileAsync(filePath: string, data: string): Promise<void>;

		readFile(filePath: string): string;

		readFileAsync(filePath: string): Promise<string>;

		pathExists(filePath: string): boolean;
	}
}
