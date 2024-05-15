import { CardContent, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DragEvent, useState } from 'react';
import {
	CloudUpload,
	GithubIcon,
	InfoIcon,
	MenuIcon,
	SettingsIcon,
} from 'lucide-react';
import { FileDropHandler } from '@/components/DropFile';
import { cn } from '@/lib/utils';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface FileData {
	size: number;
	type: string;
	data: ArrayBuffer;
}

export type DirectoryContents =
	| {
			name: string;
			contents: FileData;
			type: 'file';
	}
	| {
			name: string;
			contents: DirectoryContents[];
			type: 'directory';
	};

async function handleDirectory(
	handle: FileSystemDirectoryHandle
): Promise<DirectoryContents[]> {
	const contents: DirectoryContents[] = [];
	for await (const [name, entryHandle] of handle.entries()) {
		if (entryHandle.kind === 'file') {
			const fileData = await handleFile(entryHandle);

			if (isIgnoredFile(name)) {
				continue;
			}

			contents.push({
				name,
				contents: fileData,
				type: 'file',
			});
		} else {
			const subDirectoryContents = await handleDirectory(entryHandle);
			contents.push({
				name,
				contents: subDirectoryContents,
				type: 'directory',
			});
		}
	}
	return contents;
}

async function handleFile(handle: FileSystemFileHandle): Promise<FileData> {
	const file = await handle.getFile();

	return {
		size: file.size,
		type: file.type,
		data: await file.arrayBuffer(),
	};
}

function isIgnoredFile(name: string) {
	const ingoredFiles = ['.DS_Store'];
	return ingoredFiles.includes(name);
}

function HomepageHeader() {
	return (
		<header className="border-b border-border p-2">
			<div className="flex justify-end gap-4">
				<Badge variant="secondary">Installable</Badge>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">
							<MenuIcon className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="bottom" align="end">
						<DropdownMenuItem>
							<InfoIcon className="mr-2 w-4 h-4" />
							<button>About</button>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<SettingsIcon className="mr-2 w-4 h-4" />
							<button>Settings</button>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<GithubIcon className="mr-2 w-4 h-4" />
							<a href="https://github.com" target="_blank">
								GitHub
							</a>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}

export function FileUploadButton(props: {
	onUpload: (files: DirectoryContents[]) => void;
}) {
	const [dragging, setDragging] = useState(false);

	async function handleClick() {
		const directory = await window.showDirectoryPicker({
			mode: 'read',
			id: 'gallery',
		});

		const contents = await handleDirectory(directory);
		props.onUpload(contents);
	}

	async function handleDrop(event: DragEvent<HTMLDivElement>) {
		event.preventDefault();
		const file = event.dataTransfer.items[0];

		if (file.kind === 'file') {
			const fileHandle = await file.getAsFileSystemHandle();

			if (
				fileHandle &&
				fileHandle.kind === 'directory' &&
				fileHandle instanceof FileSystemDirectoryHandle
			) {
				const contents = await handleDirectory(fileHandle);
				props.onUpload(contents);
			} else {
				console.error('Please drop a directory');
			}
		}
	}

	return (
		<div className="h-screen overflow-hidden">
			<HomepageHeader />
			<div
				className={cn(
					dragging ? 'opacity-70' : 'opacity-100',
					'transition-opacity duration-100 flex flex-col justify-center items-center h-full'
				)}
			>
				<FileDropHandler
					onDrop={(e) => handleDrop(e)}
					onDraggingChange={(isDragging) => {
						setDragging(isDragging);
					}}
				>
					<Card className="border-none min-w-[400px] shadow-sm">
						<CardContent
							className={cn(
								'flex flex-col items-center justify-center border-[3px] rounded-lg p-10 space-y-6',
								dragging ? 'border-dashed' : ''
							)}
						>
							<CloudUpload className="w-16 h-16" />
							<Button onClick={handleClick} variant="outline">
								Upload folder
							</Button>
						</CardContent>
					</Card>
				</FileDropHandler>
			</div>
		</div>
	);
}
