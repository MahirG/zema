export default function Loading(): React.JSX.Element {
  return <main className="route-loading" aria-label="Loading"><div className="skeleton h-7 w-36" /><div className="skeleton mt-8 h-20 w-full" /><div className="loading-grid mt-4">{[1, 2, 3].map((item) => <div className="skeleton h-56" key={item} />)}</div></main>;
}
