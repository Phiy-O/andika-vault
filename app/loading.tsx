import Image from "next/image";

export default function Loading() {
  return (
    <main className="loading-screen" role="status" aria-label="Loading page">
      <div className="loading-content">
        <div className="loading-logo-wrap">
          <Image
            className="loading-logo"
            src="/icons/code-icon.svg"
            alt="Andika Lab"
            width={132}
            height={32}
            priority
          />
        </div>
        <div className="loading-status">
          <span>Preparing your experience</span>
          <span aria-hidden="true">01 / 01</span>
        </div>
        <div className="loading-track" aria-hidden="true">
          <span className="loading-progress" />
        </div>
      </div>
      <span className="loading-corner loading-corner-top" aria-hidden="true" />
      <span className="loading-corner loading-corner-bottom" aria-hidden="true" />
    </main>
  );
}
