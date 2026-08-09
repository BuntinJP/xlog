import { SiteHeader } from '@/components/blog/site-header';

const Layout = ({ children }: LayoutProps<'/'>) => {
  return (
    <div className="blog-shell lg:grid lg:grid-cols-6">
      <div className="hidden lg:col-span-1 lg:block" aria-hidden="true" />
      <div className="lg:col-span-4">
        <SiteHeader />
        <div className="mx-6">{children}</div>
        <div className="mt-12" aria-hidden="true" />
      </div>
      <div className="hidden lg:col-span-1 lg:block" aria-hidden="true" />
    </div>
  );
};

export default Layout;
