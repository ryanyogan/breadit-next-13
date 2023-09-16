import axios from "axios";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const href = url.searchParams.get("url");
    if (!href) {
      return new Response("Invalid href", { status: 400 });
    }

    const res = await axios.get(href);

    const titleMatch = res.data.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "";

    const descriptionMatch = res.data.match(
      /<meta name="description" content="(.*?)"/
    );
    const description = descriptionMatch ? descriptionMatch[1] : "";

    const imageMatch = res.data.match(/<meta name="og:image" content="(.*?)"/);
    const imageUrl = imageMatch ? imageMatch[1] : "";

    return new Response(
      JSON.stringify({
        success: 1,
        meta: {
          title,
          description,
          image: {
            url: imageUrl,
          },
        },
      })
    );
  } catch (error: any) {
    return new Response("Could not get url or... " + error.message, {
      status: 500,
    });
  }
}
