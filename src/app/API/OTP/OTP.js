const ENTER_ENDPOINT = "/API/auth/login/enter";

/**
 * POST /auth/login/enter — body: phoneNumber, token only.
 * هنا token هو رمز التحقق المكوّن من 4 أرقام الذي يدخله المستخدم.
 */
export default async function submitLoginOtp({ phoneNumber, token }) {
  const normalizedPhone = String(phoneNumber ?? "").replace(/\D/g, "");
  const code = String(token ?? "").replace(/\D/g, "").trim();

  if (!/^\d{9}$/.test(normalizedPhone)) {
    return {
      status: 400,
      ok: false,
      error: "phoneNumber must be exactly 9 digits",
    };
  }

  if (!/^\d{4}$/.test(code)) {
    return {
      status: 400,
      ok: false,
      error: "token must be exactly 4 digits",
    };
  }

  try {
    const response = await fetch(ENTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: normalizedPhone,
        token: code,
      }),
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
