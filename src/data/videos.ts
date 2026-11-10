export type VideoCategory = 'Talking head' | 'SaaS explainer' | 'Motion design' | 'Reels' | 'AI ads';

export type VideoProject = {
  id: string;
  title: string;
  category: VideoCategory;
  aspectRatio: 'video' | 'portrait' | 'wide';
};

export const videoProjects: VideoProject[] = [
  { id: 'gROrfP8t8N8', title: 'Video edit / 01', category: 'Talking head', aspectRatio: 'portrait' },
  { id: '6p4eZm1agO8', title: 'Video edit / 02', category: 'Talking head', aspectRatio: 'portrait' },
  { id: '5ejGek-hUgw', title: 'SaaS explainer / 01', category: 'SaaS explainer', aspectRatio: 'wide' },
  { id: 'on0aBPUPgig', title: 'SaaS explainer / 02', category: 'SaaS explainer', aspectRatio: 'wide' },
  { id: 's6e5PWDGt9k', title: 'SaaS explainer / 03', category: 'SaaS explainer', aspectRatio: 'wide' },
  { id: 'che92vMaJDk', title: 'Motion design / 01', category: 'Motion design', aspectRatio: 'portrait' },
  { id: 'X6YXEIv3v4g', title: 'Motion design / 02', category: 'Motion design', aspectRatio: 'portrait' },
  { id: 'oeBAl8F3MB0', title: 'Motion design / 03', category: 'Motion design', aspectRatio: 'portrait' },
  { id: '_sidPPDbiAk', title: 'Motion design / 04', category: 'Motion design', aspectRatio: 'portrait' },
  { id: 'Ts3r8T28pHM', title: 'Motion design / 05', category: 'Motion design', aspectRatio: 'portrait' },
  { id: 'Co91D2OHLvQ', title: 'Motion design / 06', category: 'Motion design', aspectRatio: 'portrait' },
  { id: 'UAZU_9SbNt4', title: 'Motion design / 07', category: 'Motion design', aspectRatio: 'portrait' },
  { id: 'GiZumi_qGo0', title: 'Motion design / 08', category: 'Motion design', aspectRatio: 'portrait' },
  { id: 'cEWLE1aNAnQ', title: 'Motion design / 09', category: 'Motion design', aspectRatio: 'portrait' },
  { id: 'Gw_DhPUPgu8', title: 'Reels / 01', category: 'Reels', aspectRatio: 'portrait' },
  { id: 'sQkVm15eruY', title: 'Reels / 02', category: 'Reels', aspectRatio: 'portrait' },
  
  { id: '0Bwo3-CqWW0', title: 'AI ads / 01', category: 'AI ads', aspectRatio: 'portrait' },
  { id: 'acdDQ1JYP14', title: 'AI ads / 02', category: 'AI ads', aspectRatio: 'portrait' },
  { id: 'vkKT8fbpnqg', title: 'AI ads / 03', category: 'AI ads', aspectRatio: 'wide' },
];

export const videoCategories: VideoCategory[] = ['Talking head', 'SaaS explainer', 'Motion design', 'Reels', 'AI ads'];
