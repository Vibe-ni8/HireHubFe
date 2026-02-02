

export default function Spinner({show}:SpinnerProps) {
  return (
    <>
      {show && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )}
    </>
  );
}

interface SpinnerProps {
  show: boolean
}