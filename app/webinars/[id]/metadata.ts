import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.FRONTEND_URL}/api/webinars/${params.id}`);
    const data = await res.json();
    const webinar = data.webinar || data;

    return {
      title: `${webinar.title} | GAE Webinars`,
      description: webinar.description.substring(0, 160),
      openGraph: {
        title: webinar.title,
        description: webinar.description,
        images: [webinar.imageUrl],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: webinar.title,
        description: webinar.description,
        images: [webinar.imageUrl],
      },
    };
  } catch {
    return {
      title: 'Webinar | GAE',
      description: 'Professional webinar by Global Academy of Embryology',
    };
  }
}
