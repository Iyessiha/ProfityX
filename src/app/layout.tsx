import type { Metadata, Viewport } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { PRODUCT_NAME } from '@/lib/config';
import { getLocale } from '@/lib/locale';

export const metadata: Metadata = {
  title: { default: PRODUCT_NAME, template: `%s · ${PRODUCT_NAME}` },
  description:
    "Trading assisté par IA pour l'Afrique de l'Ouest et le Kenya. AI-assisted trading for West Africa and Kenya.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        <Nav locale={locale} />
        <main className="container">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
