// Proxies newsletter signups from the static site to Beehiiv so the API key
// never reaches the browser. The form does a native POST here; on success we
// 303-redirect back to the site's /thanks page (post/redirect/get).

const SITE = "https://gritmade.tech";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const form = await request.formData();
    const email = String(form.get("email") || "").trim();

    if (!email) {
      return new Response("Email is required", { status: 400 });
    }

    // The page the signup came from (e.g. https://gritmade.tech/blog/...),
    // falling back to the site root if the browser didn't send a referrer.
    const referrer = request.headers.get("Referer") || SITE;

    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.BEEHIIV_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "gritmade.tech",
          utm_medium: "newsletter_form",
          referring_site: referrer,
        }),
      },
    );

    if (!res.ok) {
      return new Response(
        `Subscription failed. <a href="${SITE}">Go back and try again</a>.`,
        { status: 502, headers: { "Content-Type": "text/html" } },
      );
    }

    return Response.redirect(`${SITE}/thanks`, 303);
  },
};
