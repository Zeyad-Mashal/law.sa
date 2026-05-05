const BASE_URL = "https://lawsa-backend.onrender.com";
const LOGIN_ENTER_ENDPOINT = "/auth/login/enter";

export async function POST(request) {
  let body = {};

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const upstreamResponse = await fetch(`${BASE_URL}${LOGIN_ENTER_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
