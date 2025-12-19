import ngrok from "@ngrok/ngrok";

export async function startNgrok() {
  if (process.env.NODE_ENV === "production") return;

  const listener = await ngrok.connect({
    addr: 3000,
    authtoken: process.env.NGROK_AUTHTOKEN,
  });

  console.log("🔗 Ngrok tunnel:", listener.url());
}