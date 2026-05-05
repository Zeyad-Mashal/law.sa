const REGISTER_ENDPOINT = "/API/auth/register";

export default async function signUp({ name, phoneNumber }) {
    const trimmedName = String(name ?? "").trim();
    const normalizedPhone = String(phoneNumber ?? "").replace(/\D/g, "");

    if (!trimmedName) {
        return {
            status: 400,
            ok: false,
            error: "name is required",
        };
    }

    if (!/^\d{9}$/.test(normalizedPhone)) {
        return {
            status: 400,
            ok: false,
            error: "phoneNumber must be exactly 9 digits",
        };
    }

    try {
        const response = await fetch(REGISTER_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: trimmedName,
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
