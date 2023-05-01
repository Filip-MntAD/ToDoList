const ConfirmModal = ({
  message,
  onConfirm,
  onClose,
}: {
  onConfirm: () => void;
  onClose: () => void;
  message: String;
}) => {
  return (
    <>
      <input type="checkbox" id="my-modal-delete" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-delete"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>

          <h3 className="text-lg font-bold">DELETE</h3>
          <p className="py-4">{message}</p>

          <button className="btn btn-success m-1" onClick={onConfirm}>
            Vymazať
          </button>
          <button className="btn btn-outline btn-error m-1" onClick={onClose}>
            Zrušiť
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
