import { Resource } from "sst";
import Redis, { Cluster } from "ioredis";

const kv =
  Resource.App.stage === "production"
    ? new Cluster([{ host: Resource.Redis.host, port: Resource.Redis.port }], {
        slotsRefreshTimeout: 20000,
        redisOptions: {
          tls: { checkServerIdentity: () => undefined },
          username: Resource.Redis.username,
          password: Resource.Redis.password,
        },
      })
    : new Redis({
        host: Resource.Redis.host,
        port: Resource.Redis.port,
      });

kv.on("error", (error) => {
  console.info("[ioredis]", error);
});

export function getRedisClient() {
  return kv;
}
