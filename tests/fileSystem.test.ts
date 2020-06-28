import test from "tape";
import FileSystem from "../src/chatBot.fileSystem/fileSystem";
import fs from "fs";

test("should_write_file_and_read_file", (t) => {
	try {
		// arrange
		const fileSystem = new FileSystem("tmp");
		const filePath: string = "test.txt";
		const fileData: string = "test";

		// act
		fileSystem.writeFile(filePath, fileData);

		// assert
		t.true(fileSystem.pathExists(filePath));
		t.equal(fileSystem.readFile(filePath), fileData);
	} finally {
		fs.rmdirSync("tmp", { recursive: true });
	}

	t.end();
});

test("should_create_recursive_folder_and_write_file", (t) => {
	try {
		// arrange
		const fileSystem = new FileSystem("tmp\\test\\folder1\\folder2");
		const filePath: string = "test.txt";
		const fileData: string = "test";

		// act
		fileSystem.writeFile(filePath, fileData);

		// assert
		t.true(fileSystem.pathExists(filePath));
		t.equal(fileSystem.readFile(filePath), fileData);
	} finally {
		fs.rmdirSync("tmp", { recursive: true });
	}

	t.end();
});

test("should_delete_file", (t) => {
	try {
		// arrange
		const fileSystem = new FileSystem("tmp");
		const filePath: string = "test.txt";
		const fileData: string = "test";
		fileSystem.writeFile(filePath, fileData);

		// act
		fileSystem.deleteFile(filePath);

		// assert
		t.false(fileSystem.pathExists(filePath));
	} finally {
		fs.rmdirSync("tmp", { recursive: true });
	}

	t.end();
});

test("should_return_empty_string_when_read_file_that_does_not_exists", (t) => {
	try {
		// arrange
		const fileSystem = new FileSystem("tmp");
		const filePath: string = "filethatdoesnotexists.txt";

		// act
		const result = fileSystem.readFile(filePath);

		// assert
		t.false(fileSystem.pathExists(filePath));
		t.equal(result, "");
	} finally {
		fs.rmdirSync("tmp", { recursive: true });
	}

	t.end();
});

test("should_write_file_and_read_file_async", async (t) => {
	try {
		// arrange
		const fileSystem = new FileSystem("tmp");
		const filePath: string = "test.txt";
		const fileData: string = "test";

		// act
		await fileSystem.writeFileAsync(filePath, fileData);

		// assert
		t.true(fileSystem.pathExists(filePath));
		t.equal(await fileSystem.readFileAsync(filePath), fileData);
	} finally {
		fs.rmdirSync("tmp", { recursive: true });
	}

	t.end();
});
