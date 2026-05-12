import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali"],
  variable: "--font-hind",
});

import { CMSService } from "@/lib/server/app/modules/cms/cms.service";
import { dbConnect } from "@/lib/server/DB/dbConnect";

export async function generateMetadata(): Promise<Metadata> {
  let settings: any = null;
  try {
    await dbConnect();
    const data = await CMSService.getCMSByKey("website_settings");
    settings = data?.value;
  } catch (error) {
    console.error("Metadata fetch failed:", error);
  }

  const seo = settings?.seo;
  const general = settings?.general;

  const defaultTitle = seo?.metaTitle || "Fresh MouShum | ফ্রেশ ফলমূলের বিশ্বস্ত ঠিকানা";
  const defaultDesc = seo?.metaDescription || "সরাসরি বাগান থেকে আম, লিচুসহ সব ধরণের সিজনাল ফল সংগ্রহ করি এবং আপনাদের কাছে পৌঁছে দেই। টাটকা ও নিরাপদ খাদ্যের বিশ্বস্ত নাম ফ্রেশ মৌসুম।";
  const ogImage = seo?.ogImage || "/og-image.png";
  const siteName = general?.siteName || "Fresh MouShum";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`
    },
    description: defaultDesc,
    keywords: seo?.keywords?.split(',').map((k: string) => k.trim()) || ["fresh fruits", "mango", "litchi", "organic fruits", "bangladesh", "fresh food", "রাজশাহীর আম", "ফ্রেশ লিচু"],
    authors: [{ name: "Fresh MouShum Team" }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "bn_BD",
      url: "https://freshmoushum.com",
      siteName: siteName,
      title: defaultTitle,
      description: defaultDesc,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDesc,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${hindSiliguri.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
