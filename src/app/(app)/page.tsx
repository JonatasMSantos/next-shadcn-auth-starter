import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  const user = await getCurrentUser();

  return <div>{JSON.stringify(user)}</div>;
}
