import { PlayCircle } from 'lucide-react';

function getYouTubeEmbedUrl(url) {
  // handles youtu.be/ID and youtube.com/watch?v=ID formats
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  const longMatch = url.match(/[?&]v=([^?&]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;

  return null;
}

function getDriveEmbedUrl(url) {
  // converts drive.google.com/file/d/FILE_ID/view -> .../preview
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  return null;
}

export default function VideoPlayer({ url }) {
  if (!url) {
    return (
      <div className="aspect-video rounded-xl bg-primary flex flex-col items-center justify-center text-tertiary/50">
        <PlayCircle size={40} />
        <p className="text-sm mt-2 text-white/50">No video available for this lesson</p>
      </div>
    );
  }

  const youtubeEmbed = getYouTubeEmbedUrl(url);
  if (youtubeEmbed) {
    return (
      <div className="aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={youtubeEmbed}
          title="Lesson video"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  const driveEmbed = getDriveEmbedUrl(url);
  if (driveEmbed) {
    return (
      <div className="aspect-video rounded-xl overflow-hidden bg-black">
        <iframe src={driveEmbed} title="Lesson video" className="w-full h-full" allowFullScreen />
      </div>
    );
  }

  // fallback: assume direct video file URL
  return (
    <video controls className="w-full aspect-video rounded-xl bg-black">
      <source src={url} />
      Your browser does not support the video tag.
    </video>
  );
}