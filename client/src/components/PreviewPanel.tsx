interface Props {
  html: string;
}

// Isolated component — dangerouslySetInnerHTML is contained here only
export default function PreviewPanel({ html }: Props) {
  if (!html) return null;

  return (
    <div className="card">
      <h2>Preview</h2>
      <div
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
