import { MediaCarousel } from '@/components/Carousel';
import { useState } from 'react';
import {
	type DirectoryContents,
	FileUploadButton,
} from '@/components/FileUploadButton';
import { Gallery } from '@/components/Gallery';
import { ThemeProvider } from '@/components/ThemeProvider';

function App() {
	const [files, setFiles] = useState<DirectoryContents[]>([]);
	const [showUploadButton, setShowUploadButton] = useState(true);
	const [carouselSlide, setCarouselSlide] = useState<number | null>(null);

	function handleUpload(files: DirectoryContents[]) {
		setFiles(files);
		setShowUploadButton(false);
	}

	return (
		<ThemeProvider defaultTheme="system">
			{showUploadButton ? (
				<FileUploadButton onUpload={(files) => handleUpload(files)} />
			) : null}
			{files.length !== 0 && carouselSlide === null ? (
				<Gallery
					onNavigateHome={() => {
						setShowUploadButton(true);
						setFiles([]);
					}}
					onShowCarousel={(index) => {
						setCarouselSlide(index);
					}}
					files={files}
				/>
			) : null}
			{carouselSlide !== null ? (
				<MediaCarousel
					startingIndex={carouselSlide}
					files={files}
					onCloseCarousel={() => {
						setCarouselSlide(null);
					}}
				/>
			) : null}
		</ThemeProvider>
	);
}

export default App;
