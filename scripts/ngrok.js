import ngrok from "@ngrok/ngrok";

export async function startNgrok() {
  if (process.env.NODE_ENV === "production") return;

  if (!process.env.NGROK_AUTHTOKEN) {
    console.warn("⚠️  NGROK_AUTHTOKEN not set, skipping ngrok tunnel");
    return;
  }

  try {
    const listener = await ngrok.connect({
      addr: 3000,
      authtoken: process.env.NGROK_AUTHTOKEN,
    });

    console.log("🔗 Ngrok tunnel:", listener.url());
  } catch (error) {
    console.error("Failed to establish ngrok tunnel:", error);
  }
}