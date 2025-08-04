"use client";
import { Fingerprint, Check, KeyRound } from "lucide-react";
import { useTransition, useState } from "react";

export default function Home() {
  const [credential, setCredential] = useState<Credential | null>(null);
  const [isLoading, startTransition] = useTransition();

  const checkPasskeySupport = async () => {
    startTransition(async () => {
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
    });
  };

  const registerPasskey = async () => {

    startTransition(async () => {
      const isPlatformAvailable =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!isPlatformAvailable) {
        alert("このデバイスはパスキーに対応していません。");
        return;
      }

      const options: CredentialCreationOptions = {
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp: { name: "パスキーサンプル" , id: window.location.hostname},
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
    });
    
  };

  const getPasskey = async () => {
    

    startTransition(async () => {
      // 実際はバックエンドから帰ってきたチャレンジを使う
      if (!credential) {
        alert("先にパスキーを登録してください！");
        return;
      }

      const rawId = (credential as PublicKeyCredential).rawId;
      const credentialId = new Uint8Array(rawId);

      const challenge = Uint8Array.from("dummy_challenge_string", c => c.charCodeAt(0));

      const authOptions: PublicKeyCredentialRequestOptions = {
        challenge: challenge,
        timeout: 60000,
        rpId: window.location.hostname, 
        allowCredentials: [
          {
            id: credentialId.buffer,
            type: "public-key",
            transports: ["internal"],
          },
        ],
        userVerification: "required",
      };

      try {
        const result = await navigator.credentials.get({ publicKey: authOptions });
        console.log("✅ 認証成功:", result);
        setCredential(result);
        alert("パスキーによる署名に成功。");
      } catch (err) {
        console.error("❌ 認証失敗:", err);
        alert("パスキーによる署名に失敗。");
      }
    });
  };

  const getConditionalPasskey = async () => {

    startTransition(async () => {
      try {
        const challenge = Uint8Array.from("dummy_challenge_string", c => c.charCodeAt(0));
        const credential = await navigator.credentials.get({
          publicKey: {
            challenge: challenge,
            rpId: window.location.hostname,
            userVerification: "required",
          },
          mediation: "conditional"
        });
    
        if (credential) {
          alert("自動ログイン成功");
          setCredential(credential);
        } else {
          alert("自動ログインに失敗");
        }
      } catch (err) {
        console.error("❌ 自動ログイン失敗:", err);
        alert("error 自動ログインに失敗");  
      }
    });
  };

  return (
    <main className="min-h-screen bg-gray-800 text-white flex items-center justify-center p-4">
        <input
          id="autofill-trigger"
          type="text"
          name="username"
          autoComplete="webauthn"
          style={{ position: "absolute", opacity: 0, height: 1, width: 1 }}
        />
      <div className="max-w-2xl w-full  rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-xl md:text-4xl font-bold text-center">🔐 パスキーサンプル</h1>

        <div className="space-y-4">
          <button
            onClick={checkPasskeySupport}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition p-3 rounded-xl font-semibold"
            disabled={isLoading}
          >
            <Check className="w-5 h-5" />
            パスキー対応確認 {isLoading ? "..." : ""}
          </button>

          <button
            onClick={registerPasskey}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition p-3 rounded-xl font-semibold"
            disabled={isLoading}
          >
            <Fingerprint className="w-5 h-5" />
            パスキー登録 {isLoading ? "..." : ""}
          </button>

          <button
            onClick={getPasskey}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition p-3 rounded-xl font-semibold"
            disabled={isLoading}
          >
            <KeyRound className="w-5 h-5" />
            パスキー取得 {isLoading ? "..." : ""}
          </button>
          <button
            onClick={getConditionalPasskey}
            className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 transition p-3 rounded-xl font-semibold"
            disabled={isLoading}
          >
            <KeyRound className="w-5 h-5" />
            パスキーで自動ログイン {isLoading ? "..." : ""}
          </button>
        </div>
        


        <div className="text-sm text-gray-400 rounded-lg ">
          <pre className="overflow-x-auto bg-gray-900 text-green-400 p-4 rounded-lg">{JSON.stringify(credential, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}
