import Image from "next/image";

export default function Loading() {
  return (
    <main className="loading-screen" role="status" aria-label="Loading page">
      <div className="loading-card">
        <div className="loading-card-head">
          <span className="loading-label">ANDIKA / LOADING</span>
          <span className="loading-label loading-label-accent">SYS // 01</span>
        </div>

        <div className="loading-logo-wrap">
          <div className="loading-logo-box">
            <Image
              className="loading-logo"
              src="/icons/portfolio-logo.svg"
              alt="Andika Vault logo"
              width={88}
              height={88}
              priority
            />
          </div>
        </div>

        <div className="loading-status">
          <span>PREPARING YOUR EXPERIENCE</span>
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
