import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { MODULE_ADMIN_EMAIL } from "src/constants/moduleAccess";
import { submitModuleAccessInquiry } from "src/apiClient/pricingLinks";

const ModuleLockedModal = ({
  show,
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
      setError("Could not submit your request. Please email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} backdrop="static" keyboard={false} centered size="lg">
      <Modal.Header>
        <Modal.Title>Module Not Activated</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Payment for <strong>{moduleName}</strong> has not been completed, so this
          module is not unlocked on your account yet.
        </p>
        <p>
          Please contact our admin at{" "}
          <a href={`mailto:${MODULE_ADMIN_EMAIL}`}>{MODULE_ADMIN_EMAIL}</a> or
          submit your details below and we will get back to you.
        </p>

        {submitted ? (
          <Alert variant="success">
            Thank you. Your request has been sent to our team.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModuleLockedModal;
