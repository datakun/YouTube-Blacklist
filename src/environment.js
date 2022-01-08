export const youtubeVideoItemTag = 'ytd-rich-item-renderer;';
export const youtubeSearchItemTag = 'ytd-video-renderer';
export const youtubeMainItemTag = 'ytd-rich-item-renderer';

// YouTube 시작 페이지 패턴
export const youtubeMainPattern = /^https:\/\/www\.youtube\.com/;
// YouTube 채널, 영상 페이지 패턴
export const youtubeBlockPattern = /^https?:\/\/(?:www\.)?youtube\.com\/((?:(?:user|channel|c)\/(?:[^\/]+))|(?:watch\?v=([^&]+)))/;
// YouTube 채널 페이지 패턴
export const youtubeChannelPattern = /^https?:\/\/(?:www\.)?youtube\.com\/((?:user|channel|c)\/[^\/]+)/;
// YouTube 영상 페이지 패턴
export const youtubeVideoPattern = /^https?:\/\/(?:www\.)?youtube\.com\/(watch\?v=([^&]+))/;
// YouTube 검색 결과 패턴
export const youtubeResultPattern = /^https?:\/\/(?:www\.)?youtube\.com\/results\?(?:.*&)?search_query=([^&]+)/;
