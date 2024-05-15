export function getFileTypefromMime(mimeType: string) {
	if (mimeType.startsWith('image')) {
		return 'image';
	} else if (mimeType.startsWith('video')) {
		return 'video';
	} else {
		return 'other';
	}
}
