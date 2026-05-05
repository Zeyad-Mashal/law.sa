const LOGOUT_ENDPOINT = "/API/auth/logout";

export default async function logOut({ accessToken } = {}) {
  const token =
    typeof accessToken === "string" && accessToken.trim()
      ? accessToken.trim()
      : "";

  try {
    const response = await fetch(LOGOUT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({}),
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      ok: false,
      error: error instanceof Error ? error.message : "Network request failed",
    };
  }
}
