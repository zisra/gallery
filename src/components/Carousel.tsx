import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { type CarouselApi } from '@/components/ui/carousel';
import { type DirectoryContents } from '@/components/FileUploadButton';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFileTypefromMime } from '@/lib/getFileTypefromMime';

function CarouselMediaItem(props: { file: DirectoryContents }) {
	if (props.file.type === 'file') {
		const fileType = getFileTypefromMime(props.file.contents.type);

		if (fileType === 'image') {
			const imageSrc = URL.createObjectURL(
				new Blob([props.file.contents.data])
			);

			return (
				<CarouselItem className="flex items-center justify-center h-full">
					<img
						className="max-w-full max-h-full"
						alt={props.file.name}
						src={imageSrc}
						onContextMenu={(e) => e.preventDefault()}
					/>
				</CarouselItem>
			);
		} else {
			const videoSrc = URL.createObjectURL(
				new Blob([props.file.contents.data])
			);

			return (
				<CarouselItem className="flex items-center justify-center h-full">
					<video
						controls
						className="max-w-full max-h-full"
						src={videoSrc}
						preload="none"
						onContextMenu={(e) => e.preventDefault()}
					/>
				</CarouselItem>
			);
		}
	}
}

function CarouselControls(props: {
	onCloseCarousel: () => void;
	onAutoPlay: () => void;
}) {
	return <div></div>;
}

export function MediaCarousel(props: {
	startingIndex: number;
	files: DirectoryContents[];
	onCloseCarousel: () => void;
}) {
	const [api, setApi] = useState<CarouselApi>();

	useEffect(() => {
		if (!api) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') {
				api.scrollPrev();
			} else if (event.key === 'ArrowRight') {
				api.scrollNext();
			} else if (event.key === 'Escape') {
				props.onCloseCarousel();
			}
		};

		api.on('slidesChanged', () => {
			document.querySelectorAll('video').forEach((video) => {
				video.pause();
			});
		});

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [api, props]);

	return (
		<div className="fixed">
			<Carousel
				setApi={setApi}
				opts={{
					startIndex: props.startingIndex,
					align: 'center',
				}}
				className="w-full h-full"
			>
				<CarouselControls
					onCloseCarousel={props.onCloseCarousel}
					onAutoPlay={() => {}}
				/>
				<CarouselContent className="w-full h-full">
					{props.files.map((file, index) => (
						<CarouselMediaItem file={file} key={index} />
					))}
				</CarouselContent>
				<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors">
					<ChevronLeft className="h-8 w-8" />
				</CarouselPrevious>
				<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 transition-colors">
					<ChevronRight className="h-8 w-8" />
				</CarouselNext>
			</Carousel>
		</div>
	);
}
