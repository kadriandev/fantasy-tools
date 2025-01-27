import { getUserTeams } from "@/lib/yahoo"

export default async function Page() {

  const data = await getUserTeams()
  console.log("getUserTeams", data)

  return (<pre>{JSON.stringify(data)}</pre>)
}
