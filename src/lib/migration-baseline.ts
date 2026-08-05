export const publishedPostSlugs: readonly string[] = [
  'arch-setup-syslog-ng-for-maillog',
  'bitwarden-as-ssh-agent',
  'build-mailserver-with-sendgrid-arch',
  'directory-tree-without-tree-command',
  'enable-sudo-in-windows',
  'fix-wezterm-aiagents-input-newline',
  'github-gpg-signing',
  'ignore-dns-send-mail-using-s-nail',
  'manage-compose-yml-on-github-and-auto-apply-with-portainer-be',
  'publish-web-with-cloudflare-zero-trust-and-tunnel',
  'redirect-multiple-domains-with-only-cloudflare',
  'selfhost-convertx',
  'selfhost-obsidian-cross-platform-syncing',
  'setup-logrotate-syslog-ng-archlinux',
  'welcome-acme.sh',
  'welcome-dehydrated',
  'xlog-from-hugo-to-nextjs',
];

export const draftPostSlugs: readonly string[] = [
  'install-old-mailclient-with-docker',
  'purge-cloudflare-cache-after-vercel-build',
  'secureboot-windows-linux-dualboot-with-grub-and-shim',
  'selfhost-iam-idp-with-authentik-rhel10',
  'welcome-ipfs',
];

export const neverUpdatedPostSlugs: readonly string[] = [
  'manage-compose-yml-on-github-and-auto-apply-with-portainer-be',
  'welcome-acme.sh',
];

export const publishedCategoryNames: readonly string[] = [
  'git・github',
  'Linux',
  'SSH',
  'SSL',
  'Web',
  'Windows',
  'xlog関連',
  'クラウド',
  'シェル',
  'セルフホスト',
  'メール',
  'ログ管理',
  '備忘録',
  '工作',
];

export const publishedTagNames: readonly string[] = [
  'acme',
  'acme.sh',
  'ArchLinux',
  'awk',
  'bash',
  'Bitwarden',
  'Claude',
  'Cloudflare',
  'Codex',
  'ConvertX',
  'dehydrated',
  'Docker',
  'Dovecot',
  'GitHub',
  'GitOps',
  'gpg(GnuPG)',
  'logrotate',
  'Next.js',
  'Nginx',
  'Obsidian',
  'Portainer',
  'Postfix',
  'PowerShell',
  's-nail',
  'SendGrid',
  'sudo',
  'swaks',
  'syslog-ng',
  'WezTerm',
  'Zero Trust',
  'さくら',
];

export const migrationBaseline = {
  bodyManifestSha256: '79bcd35e943a82e32544e4398e042b33434786c362fdc505396c86648a15ff3b',
  faviconSha256: 'b187c8cae21d70a96c3cc1ba40432bd1254d05371eec4da5692182a9cdd0980d',
  fontSha256: '596c059724737174387f4903697789552218e7fe3e3cd17044be28401e4f0b8d',
  imageCount: 83,
  imageManifestSha256: '762722ac7017c205c2d8301ae43c9c8ac0688dcc8853182017850ee066cfd1c8',
  imageReferenceCount: 77,
  publicRouteCount: 67,
  sitemapUrlCount: 66,
  unreferencedImageCount: 6,
};

const publicCacheablePathnames = new Set<string>([
  '/',
  '/posts',
  '/categories',
  '/tags',
  '/sitemap.xml',
  '/robots.txt',
  ...publishedPostSlugs.map((slug) => `/posts/${slug}`),
  ...publishedCategoryNames.map((name) => `/categories/${encodeURIComponent(name)}`),
  ...publishedTagNames.map((name) => `/tags/${encodeURIComponent(name)}`),
]);

function normalizePathname(pathname: string): string | undefined {
  try {
    const withoutTrailingSlash = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
    return withoutTrailingSlash
      .split('/')
      .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
      .join('/');
  } catch {
    return undefined;
  }
}

export function isPublicCacheablePathname(pathname: string): boolean {
  const normalized = normalizePathname(pathname);
  return normalized !== undefined && publicCacheablePathnames.has(normalized);
}
