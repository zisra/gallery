import { useEffect, useState } from 'react';
import { DirectoryContents } from '@/components/FileUploadButton';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CogIcon, HomeIcon, MouseIcon, ShuffleIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from '@/components/ui/dialog';
import { MediaDisplay } from '@/components/MediaDisplay';
import { useTheme, type Theme } from '@/components/ThemeProvider';

interface SettingsOptions {
	autoscrollSpeed?: number;
	flattenFiles?: boolean;
	theme?: 'light' | 'dark' | 'system';
}

const defaultSettings: Required<SettingsOptions> = {
	autoscrollSpeed: 50,
	flattenFiles: false,
	theme: 'system',
};

function OptionsMenu(props: {
	onColumnsChange: (columns: number) => void;
	onShuffle: () => void;
	onAutoscrollChange: (enabled: boolean) => void;
	onSettingsChange: (settings: SettingsOptions) => void;
	previousSettings: SettingsOptions;
	onNavigateHome: () => void;
}) {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 p-4 dark:bg-background/90 dark:backdrop-blur bg-primary-foreground">
			<div className="flex justify-between">
				<div className="flex gap-4">
					<Button
						variant="outline"
						onClick={() => {
							props.onNavigateHome();
						}}
					>
						<HomeIcon className="h-4 w-4" />
					</Button>
				</div>
				<div className="flex gap-4">
					<Select
						onValueChange={(c) => {
							props.onColumnsChange(parseInt(c));
						}}
					>
						<SelectTrigger className="w-44">
							<SelectValue defaultValue="3" placeholder="Choose columns" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="2">2 columns</SelectItem>
							<SelectItem value="3">3 columns</SelectItem>
							<SelectItem value="4">4 columns</SelectItem>
						</SelectContent>
					</Select>
					<Toggle
						onPressedChange={(c) => {
							props.onAutoscrollChange(c);
						}}
					>
						<MouseIcon className="h-4 w-4" />
					</Toggle>
					<Button
						variant="outline"
						size="icon"
						onClick={() => props.onShuffle()}
					>
						<ShuffleIcon className="h-4 w-4" />
					</Button>
					<SettingsModal
						onSettingsChange={(settings) => {
							props.onSettingsChange(settings);
						}}
						previousSettings={props.previousSettings}
					/>
				</div>
			</div>
		</header>
	);
}

function SettingsModal(props: {
	onSettingsChange: (settings: SettingsOptions) => void;
	previousSettings: SettingsOptions;
}) {
	const [settings, setSettings] = useState<SettingsOptions>({});
	const { setTheme } = useTheme();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<CogIcon className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>Customize your app preferences</DialogDescription>
				</DialogHeader>
				<div className="grid gap-6 py-4">
					<div className="grid gap-2">
						<Label>Autoscroll Speed</Label>
						<div className="flex items-center gap-2">
							<Slider
								/* value={[
									props.previousSettings.autoscrollSpeed ||
										defaultSettings.autoscrollSpeed,
								]} */
								defaultValue={[50]}
								max={100}
								onValueChange={(c) => {
									setSettings({
										autoscrollSpeed: c[0],
									});
								}}
							/>
							<span className="text-sm text-gray-500 dark:text-gray-400">
								%
							</span>
						</div>
					</div>
					<div className="flex items-center justify-between gap-4">
						<div className="grid gap-1.5">
							<Label>Flatten Files</Label>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Automatically flatten file structure
							</p>
						</div>
						<Switch
							/* value={(
								props.previousSettings.flattenFiles ||
								defaultSettings.flattenFiles
							).toString()} */
							onCheckedChange={(c) => {
								setSettings({
									flattenFiles: c,
								});
							}}
						/>
					</div>
					<div className="flex items-center justify-between gap-4">
						<div className="grid gap-1.5">
							<Label>Theme</Label>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Switch between light and dark mode
							</p>
						</div>
						<Select
							defaultValue="system"
							onValueChange={(c) => {
								setTheme(c as Theme);
							}}
							/* value={props.previousSettings.theme || defaultSettings.theme} */
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select theme" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="light">Light</SelectItem>
								<SelectItem value="dark">Dark</SelectItem>
								<SelectItem value="system">System</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							onClick={() => {
								setSettings(defaultSettings);
							}}
							variant="outline"
						>
							Clear
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button
							onClick={() => {
								props.onSettingsChange(settings);
							}}
						>
							Done
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function Gallery(props: {
	files: DirectoryContents[];
	onNavigateHome: () => void;
	onShowCarousel: (index: number) => void;
}) {
	const [columns, setColumns] = useState(3);
	const [files, setFiles] = useState<DirectoryContents[]>(props.files);
	const [autoscroll, setAutoscroll] = useState(false);
	const [settings, setSettings] = useState<SettingsOptions>(defaultSettings);

	useEffect(() => {
		if (autoscroll) {
			const interval = setInterval(() => {
				window.scrollBy(
					0,
					(settings.autoscrollSpeed ?? defaultSettings.autoscrollSpeed) / 20
				);
				console.log('scrolling');
			}, 10);
			if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
				console.log('Bottom of page');
			}

			return () => clearInterval(interval);
		}
	}, [autoscroll, settings.autoscrollSpeed]);

	return (
		<>
			<OptionsMenu
				onColumnsChange={(value) => {
					setColumns(value);
				}}
				onShuffle={() => {
					const shuffled = [...props.files].sort(() => Math.random() - 0.5);
					setFiles(shuffled);
					scrollTo({ top: 0 });
				}}
				onAutoscrollChange={(enabled) => {
					setAutoscroll(enabled);
				}}
				onSettingsChange={(updatedSettings) => {
					const newSettings = { ...settings, ...updatedSettings };
					setSettings(newSettings);
				}}
				previousSettings={settings}
				onNavigateHome={() => {
					props.onNavigateHome();
				}}
			/>
			<div className="p-5 sm:p-8">
				<div
					className="gap-5 sm:gap-8 [&>.gallery-item:not(:first-child)]:mt-8"
					style={{
						columns: columns,
					}}
				>
					{files.map((file, index) => {
						return (
							<MediaDisplay
								key={index}
								file={file}
								index={index}
								onShowCarousel={(index) => {
									props.onShowCarousel(index);
								}}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
}
