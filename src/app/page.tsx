"use client";
import { Fingerprint, Check, KeyRound } from "lucide-react";

export default function Home() {
  const checkPasskeySupport = async () => {
    const capabilities = await PublicKeyCredential.getClientCapabilities?.();
    console.log("capabilities", capabilities);

    if (!capabilities?.isUserVerifyingPlatformAuthenticatorAvailable) {
      alert("パスキーはサポートされていません");
      return;
    }
    if (!capabilities?.isConditionalMediationAvailable) {
      alert("パスキーはサポートされていません");
      return;
    }
    alert("パスキーはサポートされています");
  };

  const registerPasskey = async () => {
    const isPlatformAvailable =
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.();
    if (!isPlatformAvailable) {
      alert("このデバイスはパスキーに対応していません。");
      return;
    }

    const options: CredentialCreationOptions = {
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: { name: "パスキーサンプル" },
        user: {
          id: new TextEncoder().encode("user-id-123"),
          name: "yabuki@gaia-btm.com",
          displayName: "yabuki",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "none",
      },
    };

    const credential = await navigator.credentials.create(options);
    console.log(credential);
  };

  const getPasskey = async () => {
    const options: CredentialRequestOptions = {
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rpId: "localhost",
        allowCredentials: [],
      },
    };
    const credential = await navigator.credentials.get(options);
    console.log(credential);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">🔐 パスキーサンプル</h1>

        <div className="space-y-4">
          <button
            onClick={checkPasskeySupport}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition p-3 rounded-xl font-semibold"
          >
            <Check className="w-5 h-5" />
            パスキー対応確認
          </button>

          <button
            onClick={registerPasskey}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition p-3 rounded-xl font-semibold"
          >
            <Fingerprint className="w-5 h-5" />
            パスキー登録
          </button>

          <button
            onClick={getPasskey}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition p-3 rounded-xl font-semibold"
          >
            <KeyRound className="w-5 h-5" />
            パスキー取得
          </button>
        </div>
      </div>
    </main>
  );
}
