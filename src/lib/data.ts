import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import titles from '../../data/titles.json';

const absolutePath = resolve(join(process.cwd(), 'data'));

export function readMarkdown() {
	try {
		const files = readdirSync(absolutePath);
		const markdownContentArray: string[] = [];

		files.forEach((file) => {
			if (extname(file) === '.md') {
				const filePath = join(absolutePath, file);
				const content = readFileSync(filePath, 'utf8');

				markdownContentArray.push(content);
			}
		});

		return markdownContentArray;
	} catch (error) {
		console.error('Error reading Markdown files:', (error as Error)?.message);

		return [];
	}
}

export function readData(): Array<string> {
	return titles;
}
