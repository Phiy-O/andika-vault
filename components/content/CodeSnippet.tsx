export function CodeSnippet() {
  return (
    <div className="code-snippet" aria-hidden="true">
      <div className="code-snippet-header">
        <span>&lt;/&gt; code</span>
        <i />
      </div>
      <pre>
        <code>
          <span className="code-keyword">const</span> developer = {'{'}
          {"\n"}  name: <span className="code-string">&quot;Andika&quot;</span>,
          {"\n"}  skills: [<span className="code-string">&quot;Next.js&quot;</span>, <span className="code-string">&quot;React&quot;</span>],
          {"\n"}  focus: <span className="code-string">&quot;useful products&quot;</span>
          {"\n"}{'}'};
        </code>
      </pre>
    </div>
  );
}
