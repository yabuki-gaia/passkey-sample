"use client";
import { Fingerprint, Check, KeyRound } from "lucide-react";
import { useState } from "react";

export default function Home() {

const initialCredential = {
  "authenticatorAttachment": "platform",
  "clientExtensionResults": {},
  "id": "4_RzqcT7zHqh0P6i6xKcE22CCk0",
  "rawId": "4_RzqcT7zHqh0P6i6xKcE22CCk0",
  "response": {
    "attestationObject": "o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YViYF6ZWBvEMxSm56JmftYbRJxtOvvUSslCDUUH1D0blaTldAAAAAPv8MAcVTk7MjAtuAgVX170AFOP0c6nE-8x6odD-ousSnBNtggpNpQECAyYgASFYIN-uahHPm7OcbyRH_bQs8a-ALnqJmEGJBmrkNNMqV-awIlggIv-zySkpGtrIqO8rFb8bn57pS6oRNfBkLVtGCAysorE",
    "authenticatorData": "F6ZWBvEMxSm56JmftYbRJxtOvvUSslCDUUH1D0blaTldAAAAAPv8MAcVTk7MjAtuAgVX170AFOP0c6nE-8x6odD-ousSnBNtggpNpQECAyYgASFYIN-uahHPm7OcbyRH_bQs8a-ALnqJmEGJBmrkNNMqV-awIlggIv-zySkpGtrIqO8rFb8bn57pS6oRNfBkLVtGCAysorE",
    "clientDataJSON": "eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiVjg3YkUwQ3F3NTNRcXdITnEwMTNqZ1hqNE5jYW9yRDZsMlZhcjk2UHhHZyIsIm9yaWdpbiI6Imh0dHBzOi8vbWFpbi5kMWRsendzOXR3M3J0Ny5hbXBsaWZ5YXBwLmNvbSIsImNyb3NzT3JpZ2luIjpmYWxzZX0",
    "publicKey": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE365qEc-bs5xvJEf9tCzxr4AueomYQYkGauQ00ypX5rAi_7PJKSka2sio7ysVvxufnulLqhE18GQtW0YIDKyisQ",
    "publicKeyAlgorithm": -7,
    "transports": [
      "internal",
      "hybrid"
    ]
  },
  "type": "public-key"
};


  const [credential, setCredential] = useState<Credential | null>(initialCredential);

  const checkPasskeySupport = async () => {
    const capabilities = await PublicKeyCredential.getClientCapabilities?.();
    console.log("capabilities", capabilities);

    if (!capabilities?.isUserVerifyingPlatformAuthenticatorAvailable) {
      alert("パスキーはサポートされていません isUserVerifyingPlatformAuthenticatorAvailable");
      return;
    }
    if (!capabilities?.isConditionalMediationAvailable) {
      alert("パスキーはサポートされていません isConditionalMediationAvailable");
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
    setCredential(credential);
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
    setCredential(credential);
  };

  return (
    <main className="min-h-screen bg-gray-800 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full  rounded-2xl shadow-xl p-6 space-y-6">
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

        <div className="text-sm text-gray-400 rounded-lg ">
          <pre className="overflow-x-auto bg-gray-900 text-green-400 p-4 rounded-lg">{JSON.stringify(credential, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}
