import { Resource } from "sst";
import Redis, { Cluster } from "ioredis";

// export const kv =
//   Resource.MyRedis.host === "localhost"
//     ? new Redis({
//         host: Resource.MyRedis.host,
//         port: Resource.MyRedis.port,
//       })
//     : new Cluster(
//         [
//           {
//             host: Resource.MyRedis.host,
//             port: Resource.MyRedis.port,
//           },
//         ],
//         {
//           redisOptions: {
//             username: Resource.MyRedis.username,
//             password: Resource.MyRedis.password,
//           },
//         },
//       );
export const kv = new Redis({
  host: Resource.MyRedis.host,
  port: Resource.MyRedis.port,
});
