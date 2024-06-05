export const getContentType = (name: string): string | null => {
  const type = name.split('.').pop();
  if (type === undefined) return null;
  if (imageTypes.includes(type)) return `image/${type}`;
  if (videoTypes.includes(type)) return `video/${type}`;
  return null;
}

const imageTypes = ['jpg', 'jpeg', 'png'];

const videoTypes = ['mp4']; 