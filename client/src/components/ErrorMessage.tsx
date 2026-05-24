interface Props {
  message: string;
  onDismiss: () => void;
}

export default function ErrorMessage({ message, onDismiss }: Props) {
  return (
    <div className="error-banner" role="alert">
      <span>{message}</span>
      <button onClick={onDismiss} aria-label="Dismiss error">x</button>
    </div>
  );
}
