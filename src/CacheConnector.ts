import { GlideClient, TimeUnit } from "@valkey/valkey-glide";


let client: GlideClient

async function connect() {
    try {
        // Valkey 서버 연결
        client = await GlideClient.createClient({
            addresses: [{ host: process.env.REDIS_HOST || "", port: 6379 }],
            clientName: "my_valkey_client", useTLS:true
        });

        console.log("✅ Valkey 연결 성공!");

        // PING 테스트
        const pong = await client.customCommand(["PING"]);
        console.log(`✅ PING 응답: ${pong}`);
    } catch (error) {
        console.error("❌ Valkey 연결 실패:", error);
    }
}

async function setCache(key: string, value: string, ttl: number) {
    const result = await client.set(key, value, { expiry: { type: TimeUnit.Seconds, count: 60 * 60 * 4 } })

    if (result === "OK") {

    } 
}

async function getCache(key: string) {
    const result = await client.get(key)
    return result;
}


function init() {
    connect()
}

init()

export { setCache, getCache, client }