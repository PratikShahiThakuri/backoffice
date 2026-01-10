export default function DomainPage({ params }: { params: { domain: string } }) {
  return (
    <div>
      <h1>Domain Page for {params.domain}</h1>
    </div>
  );
}
