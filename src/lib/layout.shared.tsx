import { Folders, Newspaper, Tags } from 'lucide-react';
import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared';
import { appName, gitRepositoryUrl } from './shared';

const siteLinks = [
  {
    text: 'Posts',
    url: '/posts',
    icon: <Newspaper />,
    active: 'nested-url',
  },
  {
    text: 'Categories',
    url: '/categories',
    icon: <Folders />,
    active: 'nested-url',
  },
  {
    text: 'Tags',
    url: '/tags',
    icon: <Tags />,
    active: 'nested-url',
  },
] satisfies LinkItemType[];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    links: siteLinks,
    githubUrl: gitRepositoryUrl,
  };
}
