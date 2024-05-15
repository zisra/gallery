import { PlayIcon } from 'lucide-react';
import { DirectoryContents } from '@/components/FileUploadButton';
import { getFileTypefromMime } from '../lib/getFileTypefromMime';

export function MediaDisplay(props: {
	file: DirectoryContents;
	index: number;
	onShowCarousel: (index: number) => void;
}) {
	if (props.file.type === 'file') {
		const fileType = getFileTypefromMime(props.file.contents.type);

		if (fileType === 'image') {
			return (
				<img
					src={URL.createObjectURL(new Blob([props.file.contents.data]))}
					onContextMenu={(e) => e.preventDefault()}
					alt={props.file.name}
					className="w-full h-auto gallery-item cursor-pointer"
					onClick={() => props.onShowCarousel(props.index)}
					onDragStart={(e) => e.preventDefault()}
				/>
			);
		} else if (fileType === 'video') {
			const videoSrc = URL.createObjectURL(
				new Blob([props.file.contents.data])
			);
			return (
				<div className="relative w-full h-auto gallery-item">
					<video
						id="video-player"
						src={videoSrc}
						onContextMenu={(e) => e.preventDefault()}
						className="w-full h-auto cursor-pointer"
						controls={false}
						onClick={() => props.onShowCarousel(props.index)}
						preload="none"
					/>
					<PlayIcon
						fill="white"
						size={60}
						strokeWidth={0}
						className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
					/>
				</div>
			);
		}
	} else {
		return <div>Directory: {props.file.name}</div>;
	}
}
