import citanjeDanaKindle from "@/app/api/scripture-today/citanje-dana-na-kindle";

export default function Home() {
  return (
      <form action={citanjeDanaKindle} className={"w-full flex h-screen"}>
        <button type={"submit"} className={"btn-primary m-auto"}>Citanje dana na Kindle</button>
      </form>
  );
}
