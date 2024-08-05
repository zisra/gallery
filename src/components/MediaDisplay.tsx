import React, { useState, useEffect } from 'react';
import { PlayIcon } from 'lucide-react';
import { DirectoryContents } from '@/components/FileUploadButton';
import { getFileTypefromMime } from '../lib/getFileTypefromMime';

interface MediaDisplayProps {
	file: DirectoryContents;
	index: number;
	onShowCarousel: (index: number) => void;
}

export const MediaDisplay: React.FC<MediaDisplayProps> = ({
	file,
	index,
	onShowCarousel,
}) => {
	const [thumbnail, setThumbnail] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const createVideoThumbnail = async (videoFile: Blob) => {
			const video = document.createElement('video');
			video.src = URL.createObjectURL(videoFile);
			video.currentTime = 1;
			video.volume = 0;
			await video.play();
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			if (ctx) {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			}
			return canvas.toDataURL('image/png');
		};

		const loadThumbnail = async () => {
			if (file.type !== 'file') return;
			const fileType = getFileTypefromMime(file.contents.type);
			let thumbnailData = null;

			if (fileType === 'image') {
				thumbnailData = URL.createObjectURL(file.contents.data);
			} else if (fileType === 'video') {
				thumbnailData = await createVideoThumbnail(file.contents.data);
			}

			setThumbnail(thumbnailData);
			setLoading(false);
		};

		loadThumbnail();
	}, [file]);

	if (loading) {
		return <div></div>;
	}

	if (file.type === 'file') {
		const fileType = getFileTypefromMime(file.contents.type);

		if (fileType === 'image') {
			return (
				<img
					src={thumbnail || ''}
					onContextMenu={(e) => e.preventDefault()}
					alt={file.name}
					className="w-full h-auto gallery-item cursor-pointer"
					onClick={() => onShowCarousel(index)}
					onDragStart={(e) => e.preventDefault()}
				/>
			);
		} else if (fileType === 'video') {
			return (
				<div className="relative w-full h-auto gallery-item">
					<img
						src={thumbnail || ''}
						onContextMenu={(e) => e.preventDefault()}
						alt={file.name}
						className="w-full h-auto gallery-item cursor-pointer"
						onClick={() => onShowCarousel(index)}
						onDragStart={(e) => e.preventDefault()}
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
		return <div>Directory: {file.name}</div>;
	}

	return null;
};

export default MediaDisplay;
