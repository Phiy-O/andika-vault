export function CodeSnippet() {
  return (
    <div
      className="bg-[rgba(16,14,23,.9)] border border-[#4d485a] rounded-md shadow-[0_18px_40px_rgba(0,0,0,.25)] text-muted font-mono text-xs leading-[1.65] px-[13px] pt-0 pb-3 absolute right-[-6%] bottom-[8%] w-[280px] z-20 max-md:right-[-2%] max-md:bottom-[11%] max-md:scale-[.62] max-md:origin-bottom-right"
      aria-hidden="true"
    >
      <div className="flex items-center border-b border-line justify-between mx-[-13px] mt-0 mb-[9px] py-2 px-[11px]">
        <span>&lt;/&gt; code</span>
        <i className="bg-[#7fe495] rounded-full h-[5px] w-[5px]" />
      </div>
      <pre className="m-0 whitespace-pre-wrap">
        <code>
          <span className="text-[#d188ff]">const</span> developer = {'{'}
          {"\n"}  name: <span className="text-[#f1b86d]">&quot;Andika&quot;</span>,
          {"\n"}  skills: [<span className="text-[#f1b86d]">&quot;Next.js&quot;</span>, <span className="text-[#f1b86d]">&quot;React&quot;</span>],
          {"\n"}  focus: <span className="text-[#f1b86d]">&quot;useful products&quot;</span>
          {"\n"}{'}'};
        </code>
      </pre>
    </div>
  );
}
