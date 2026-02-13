// File upload constraints
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB limit

/**
 * Allowed media types for upload validation
 *
 * Comprehensive list for cross-browser compatibility:
 * - Different browsers report different MIME types for same format
 * - Includes both standard and vendor-specific types
 * - Validated both client-side (dropzone) and server-side (API route)
 */
export const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg", // MP3 (standard)
  "audio/mp3", // MP3 (alternate)
  "audio/mp4", // M4A (standard)
  "audio/m4a", // M4A (alternate)
  "audio/x-m4a", // M4A (Apple)
  "audio/wav", // WAV (standard)
  "audio/x-wav", // WAV (Microsoft)
  "audio/wave", // WAV (alternate)
  "audio/aac", // AAC
  "audio/aacp", // AAC+
  "audio/ogg", // OGG Vorbis
  "audio/opus", // Opus
  "audio/webm", // WebM Audio
  "audio/flac", // FLAC (standard)
  "audio/x-flac", // FLAC (alternate)
  "audio/3gpp", // 3GP
  "audio/3gpp2", // 3G2
]; export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp"
]; export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg"
]; export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

/**
 * Progress animation constants
 *
 * Used in processing flow for smooth progress indication:
 * - PROGRESS_CAP_PERCENTAGE: Stop at 95% until actual completion (UX best practice)
 * - ANIMATION_INTERVAL_MS: Speed of progress bar animation
 * - PROGRESS_UPDATE_INTERVAL_MS: How often to recalculate progress
 */
export const PROGRESS_CAP_PERCENTAGE = 95;
export const ANIMATION_INTERVAL_MS = 4000;
export const PROGRESS_UPDATE_INTERVAL_MS = 1000;

/**
 * Time conversion constants
 *
 * Used for duration formatting and time calculations
 */
export const MS_PER_MINUTE = 60000;
export const MS_PER_HOUR = 3600000;
export const MS_PER_DAY = 86400000;