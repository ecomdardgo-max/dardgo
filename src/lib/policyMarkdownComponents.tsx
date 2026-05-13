import type { Components } from "react-markdown";

export function normalizePolicyMarkdown(raw: string): string {
  return raw
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/^<!--[\s\S]*?-->\s*\n?/, "");
}

export const policyMarkdownComponents: Components = {
  h2: ({ node: _n, children, ...props }) => (
    <h2 className="text-xl font-bold text-foreground mt-10 mb-4 first:mt-0 scroll-mt-24" {...props}>
      {children}
    </h2>
  ),
  h3: ({ node: _n, children, ...props }) => (
    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3" {...props}>
      {children}
    </h3>
  ),
  p: ({ node: _n, children, ...props }) => (
    <p className="leading-relaxed text-muted-foreground mb-4 last:mb-0" {...props}>
      {children}
    </p>
  ),
  ul: ({ node: _n, children, ...props }) => (
    <ul className="list-disc pl-5 space-y-2 mb-4 text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ node: _n, children, ...props }) => (
    <ol className="list-decimal pl-5 space-y-2 mb-4 text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  li: ({ node: _n, children, ...props }) => (
    <li className="leading-relaxed marker:text-primary" {...props}>
      {children}
    </li>
  ),
  a: ({ node: _n, href, children, ...props }) => (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/90 break-words"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  strong: ({ node: _n, children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ node: _n, children, ...props }) => (
    <em className="italic text-foreground/90" {...props}>
      {children}
    </em>
  ),
  table: ({ node: _n, children, ...props }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-border/60 bg-card/40">
      <table className="w-full min-w-[520px] text-sm border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ node: _n, children, ...props }) => (
    <thead className="bg-muted/50 text-left" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ node: _n, children, ...props }) => <tbody {...props}>{children}</tbody>,
  tr: ({ node: _n, children, ...props }) => (
    <tr className="border-b border-border/50 last:border-0" {...props}>
      {children}
    </tr>
  ),
  th: ({ node: _n, children, ...props }) => (
    <th className="px-3 py-2.5 font-semibold text-foreground align-top w-[45%]" {...props}>
      {children}
    </th>
  ),
  td: ({ node: _n, children, ...props }) => (
    <td className="px-3 py-2.5 text-muted-foreground align-top" {...props}>
      {children}
    </td>
  ),
};
