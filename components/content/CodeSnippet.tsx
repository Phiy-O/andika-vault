export function CodeSnippet() {
  return (
    <div
      className="bg-foreground border border-foreground rounded-none shadow-[8px_8px_0_var(--purple)] text-muted font-mono text-xs leading-[1.65] px-[13px] pt-0 pb-3 absolute right-[-2%] bottom-[8%] w-[280px] z-20 max-md:right-[-2%] max-md:bottom-[11%] max-md:scale-[.62] max-md:origin-bottom-right"
      aria-hidden="true"
    >
      <div className="flex items-center border-b border-line justify-between mx-[-13px] mt-0 mb-[9px] py-2 px-[11px]">
        <span>&lt;/&gt; code</span>
        <i className="bg-[#7fe495] rounded-full h-[5px] w-[5px]" />
      </div>
      <pre className="m-0 whitespace-pre-wrap">
        <code>
          <span className="text-[#f4b7a5]">const</span> developer = {'{'}
          {"\n"}  name: <span className="text-[#f4b7a5]">&quot;Andika&quot;</span>,
          {"\n"}  skills: [<span className="text-[#f4b7a5]">&quot;Next.js&quot;</span>, <span className="text-[#f4b7a5]">&quot;React&quot;</span>],
          {"\n"}  focus: <span className="text-[#f4b7a5]">&quot;useful products&quot;</span>
          {"\n"}{'}'};
        </code>
      </pre>
    </div>
  );
}
