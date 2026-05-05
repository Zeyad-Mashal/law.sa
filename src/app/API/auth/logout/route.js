const BASE_URL = "https://lawsa-backend.onrender.com";
const LOGOUT_ENDPOINT = "/auth/logout";

export async function POST(request) {
  let headers = {
    "Content-Type": "application/json",
  };

  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    headers = {
      ...headers,
      Authorization: authHeader,
    };
  }

  try {
    const upstreamResponse = await fetch(`${BASE_URL}${LOGOUT_ENDPOINT}`, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
      cache: "no-store",
    });

    const contentType = upstreamResponse.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson
      ? await upstreamResponse.json()
      : { message: await upstreamResponse.text() };

    return Response.json(payload, { status: upstreamResponse.status });
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error ? error.message : "Upstream request failed",
      },
      { status: 502 },
    );
  }
}
