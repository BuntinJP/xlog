export function isMigrationWikiEnabled(): boolean {
  return process.env.NODE_ENV !== 'production';
}
