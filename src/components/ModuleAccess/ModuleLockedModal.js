import { useState, useEffect } from "react";
import { Modal, Form, Spinner } from "react-bootstrap";
import { MODULE_ADMIN_EMAIL } from "src/constants/moduleAccess";
import { submitModuleAccessInquiry } from "src/apiClient/pricingLinks";

const ModuleLockedModal = ({
  show,
  onHide,
  moduleName,
  moduleId,
  defaultName = "",
  defaultEmail = "",
  defaultCompany = "",
}) => {
  const [form, setForm] = useState({
    name: defaultName,
    email: defaultEmail,
    company: defaultCompany,
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: defaultName || prev.name,
      email: defaultEmail || prev.email,
      company: defaultCompany || prev.company,
    }));
  }, [defaultName, defaultEmail, defaultCompany]);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setSubmitted(false);
      setError("");
    }
  }, [show, moduleId]);

  const handleClose = () => {
    setIsVisible(false);
    if (onHide) {
      onHide();
    } else if (typeof window !== "undefined") {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "/other/my-business-account";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await submitModuleAccessInquiry({
        ...form,
        moduleId,
        moduleName,
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        "Could not submit your request. Please email us directly at " +
          MODULE_ADMIN_EMAIL
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      show={show && isVisible}
      onHide={handleClose}
      backdrop={true}
      keyboard={true}
      centered
      dialogClassName="module-locked-modal-dialog"
      contentClassName="module-locked-modal-content"
    >
      <button
        type="button"
        className="module-locked-close-btn"
        onClick={handleClose}
        aria-label="Close"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="module-locked-icon-badge">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2e7d32"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>

      <h3 className="module-locked-title">Unlock {moduleName || "Module"}</h3>
      <p className="module-locked-subtitle">
        This feature is not unlocked on your account yet.
      </p>

      {submitted ? (
        <div className="module-locked-success-state">
          <div className="module-locked-success-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2e7d32"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h4 className="module-locked-success-title">Inquiry Submitted</h4>
          <p className="module-locked-success-desc">
            Thank you! We've received your inquiry to activate{" "}
            <strong>{moduleName}</strong>. Our team will review your account and
            reach out to you at <strong>{form.email}</strong> shortly.
          </p>
          <button
            type="button"
            className="button--black module-locked-success-btn"
            onClick={handleClose}
          >
            Back to Business Account
          </button>
        </div>
      ) : (
        <>
          <div className="module-locked-notice">
            <div className="module-locked-notice-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2e7d32"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div className="module-locked-notice-text">
              Payment for <strong>{moduleName}</strong> has not been completed.
              Submit your request below or email our team directly at{" "}
              <a
                href={`mailto:${MODULE_ADMIN_EMAIL}`}
                className="module-locked-email-link"
              >
                {MODULE_ADMIN_EMAIL}
              </a>
              .
            </div>
          </div>

          <Form onSubmit={handleSubmit} className="module-locked-form">
            {error && <div className="module-locked-error">{error}</div>}

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="module-locked-label">
                  Your Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="module-locked-input"
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="module-locked-label">
                  Work Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="module-locked-input"
                  placeholder="e.g. john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="module-locked-label">Company Name</label>
                <input
                  type="text"
                  className="module-locked-input"
                  placeholder="e.g. EcoStance Ltd"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="module-locked-label">Phone Number</label>
                <input
                  type="tel"
                  className="module-locked-input"
                  placeholder="e.g. +1 234 567 890"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="module-locked-label">
                Message / Requirements
              </label>
              <textarea
                rows={3}
                className="module-locked-input module-locked-textarea"
                placeholder={`I'd like to activate ${
                  moduleName || "this module"
                } for my organization...`}
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
              />
            </div>

            <div className="module-locked-footer">
              <button
                type="button"
                className="button--white module-locked-btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button--black module-locked-btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <span
                    className="d-flex align-items-center justify-content-center"
                    style={{ gap: "8px" }}
                  >
                    <Spinner animation="border" size="sm" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default ModuleLockedModal;
