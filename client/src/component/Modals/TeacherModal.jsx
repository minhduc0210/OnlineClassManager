import { useFormik } from "formik";
import React from "react";
import { Form, Modal, FloatingLabel, Button } from "react-bootstrap";
import { fetchCreateClassroom } from "../../services/ClassroomService";
import { classroomValidation } from "../../validations";
import { toast } from "react-toastify"

const TeacherModal = (props) => {
  const formik = useFormik({
    initialValues: {
      title: "",
      subtitle: "",
    },
    validationSchema: classroomValidation,
    onSubmit: async (values, bag) => {
      try {
        const response = await fetchCreateClassroom(values);
        if(response.status === 200){
            values.title = "";
            values.subtitle = "";
            props.onHide();
            toast.success(`Create class successfully`);
        }
      } catch (e) {}
      
    },
  });

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Classroom
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* form */}
        <Form>
          <FloatingLabel
            controlId="floatingTitle"
            label="Classroom Title"
            className="mb-3"
          >
            <Form.Control
              onChange={formik.handleChange}
              onBlur={formik.onBlur}
              value={formik.values.title}
              name="title"
              type="text"
              isInvalid={formik.touched.title && formik.errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.title}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingSubtitle"
            label="Subtitle"
            className="mb-3"
          >
            <Form.Control
              onChange={formik.handleChange}
              onBlur={formik.onBlur}
              value={formik.values.subtitle}
              name="subtitle"
              type="text"
              isInvalid={formik.touched.subtitle && formik.errors.subtitle}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.subtitle}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={formik.handleSubmit}>
          Create
        </Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TeacherModal;