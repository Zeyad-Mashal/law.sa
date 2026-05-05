const SIGN_IN_ENDPOINT = "/API/auth/login/token";

export default async function signIn({ phoneNumber }) {
    const normalizedPhone = String(phoneNumber ?? "").replace(/\D/g, "");

    if (!/^\d{9}$/.test(normalizedPhone)) {
        return {
            status: 400,
            ok: false,
            error: "phoneNumber must be exactly 9 digits",
        };
    }

    try {
        const response = await fetch(SIGN_IN_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phoneNumber: normalizedPhone,
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
