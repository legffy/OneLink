import { NextRequest } from "next/server";

const DEFAULT_BACKEND_ORIGIN = "http://127.0.0.1:8000";

function getBackendOrigin() {
  return (process.env.API_BASE_URL ?? DEFAULT_BACKEND_ORIGIN).replace(/\/+$/, "");
}

function buildUpstreamUrl(searchParams: URLSearchParams) {
  const query = searchParams.toString();
  const upstreamUrl = `${getBackendOrigin()}/api/buildings/`;

  return query ? `${upstreamUrl}?${query}` : upstreamUrl;
}

async function proxyRequest(url: string) {
  try {
    const upstreamResponse = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const headers = new Headers();
    const contentType = upstreamResponse.headers.get("content-type");

    if (contentType) {
      headers.set("content-type", contentType);
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers,
    });
  } catch (error) {
    console.error("Failed to reach backend buildings endpoint.", error);

    return Response.json(
      { detail: "Unable to reach the backend service." },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(buildUpstreamUrl(request.nextUrl.searchParams));
}
