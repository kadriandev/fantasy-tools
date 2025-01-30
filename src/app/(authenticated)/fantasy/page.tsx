interface PageProps {
  params: { league_key: string };
}

export default async function Page({ params }: PageProps) {
  return (
    <>
      <p>Select a league</p>
    </>
  );
}
