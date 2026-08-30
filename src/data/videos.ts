export type VideoCategory = 'Video editing' | 'SaaS explainer' | 'Motion design';

export type VideoProject = {
  id: string;
  title: string;
  category: VideoCategory;
  aspectRatio: 'video' | 'portrait' | 'wide';
};

export const videoProjects: VideoProject[] = [
  { id: '6p4eZm1agO8', title: 'Video edit / 01', category: 'Video editing', aspectRatio: 'portrait' },
  { id: 'gROrfP8t8N8', title: 'Video edit / 02', category: 'Video editing', aspectRatio: 'portrait' },
  { id: '5ejGek-hUgw', title: 'SaaS explainer / 01', category: 'SaaS explainer', aspectRatio: 'wide' },
  { id: 'on0aBPUPgig', title: 'SaaS explainer / 02', category: 'SaaS explainer', aspectRatio: 'wide' },
  { id: 's6e5PWDGt9k', title: 'SaaS explainer / 03', category: 'SaaS explainer', aspectRatio: 'wide' },
  { id: 'baC-fWYBSk0', title: 'Motion design / 01', category: 'Motion design', aspectRatio: 'portrait' },
  { id: 'sf1637GmLr0', title: 'Motion design / 02', category: 'Motion design', aspectRatio: 'portrait' },
  { id: '_sidPPDbiAk', title: 'Motion design / 03', category: 'Motion design', aspectRatio: 'portrait' },
  { id: 'Ts3r8T28pHM', title: 'Motion design / 04', category: 'Motion design', aspectRatio: 'portrait' },
  { id: 'lEsbs-8PWu0', title: 'Motion design / 05', category: 'Motion design', aspectRatio: 'portrait' },
  { id: 'GiZumi_qGo0', title: 'Motion design / 06', category: 'Motion design', aspectRatio: 'portrait' },
];

export const videoCategories: VideoCategory[] = ['Video editing', 'SaaS explainer', 'Motion design'];
