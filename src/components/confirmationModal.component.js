import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const ConfirmationModal = ({ icon, text, proceed }) => {
  return (
    <div
      className="modal fade"
      id="confirmationModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="confirmationModalTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div
            className="modal-header text-center justify-content-center py-2"
            style={{
              fontWeight: 500,
              backgroundColor: "var(--light-accent)",
            }}
          >
            <ExclamationCircleIcon width={20} style={{ marginRight: 5 }} />
            Confirmation Required
          </div>
          <div className="modal-body">
            <div className="hstack justify-content-center align-items-start gap-2">
              {icon}
              <p
                className="primary-p"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                className="light-btn"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="secondary-btn"
                data-bs-dismiss="modal"
                onClick={() => proceed.method(proceed.bookingId)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
