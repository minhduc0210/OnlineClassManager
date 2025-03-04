import {
    Container,
    Form,
    FloatingLabel,
    Button,
    Row,
    Col,
} from "react-bootstrap"
import { loginValidation } from "../../validations"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import { fetchLogin } from "../../services/AuthService"
import { toast } from "react-toastify"
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect } from "react"

const Login = () => {
    const { login, user } = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/"); 
        }
    }, [user, navigate]);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginValidation,
        onSubmit: async (values, bag) => {
            try {
                const response = await fetchLogin(values);
                if (response.status === 200) {
                    login(response);
                    toast.success(`Welcome ${response.data.name}!`);
                    navigate("/");
                }
            } catch (err) {
                if (err.response && err.response.data.errors) {
                    const errorsArray = err.response.data.errors;
                    if (errorsArray.length === 1 && errorsArray[0].msg === "Incorrect email or password") {
                        toast.error("Incorrect email or password. Please try again.");
                    } else {
                        const errors = {};
                        errorsArray.forEach(error => {
                            errors[error.path] = error.msg;
                        });
                        bag.setErrors(errors);
                    }
                } else {
                    toast.error("Something went wrong. Please try again later.");
                }
            }
        }
        ,
    });

    return (
        <Container>
            <div>
                <img
                    src="/images/logo_fpt.png"
                    style={{ width: '20%', display: 'block', margin: '0 auto' }}
                    alt="Logo"
                    className="mt-4"
                />
                <h3 className="text-center mt-2 mb-4">Login Page</h3>
            </div>

            {/* forms */}
            <Row>
                <Form onSubmit={formik.handleSubmit}>
                    <Col md={{ span: 6, offset: 3 }}>
                        <FloatingLabel label="Email" className="mb-3" controlId="floatingInput">
                            <Form.Control
                                onChange={formik.handleChange}
                                onBlur={formik.onBlur}
                                value={formik.values.email}
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                isInvalid={formik.touched.email && formik.errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.email}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                        <FloatingLabel label="Password" className="mb-3" controlId="floatingPassword">
                            <Form.Control
                                onChange={formik.handleChange}
                                onBlur={formik.onBlur}
                                value={formik.values.password}
                                name="password"
                                type="password"
                                placeholder="Password"
                                isInvalid={formik.touched.password && formik.errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.password}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                        <div className="d-grid gap-2">
                            <Button size="lg" className="mt-3" type="submit" style={{ backgroundColor: "#1565C0", color: "white" }}>
                                Login
                            </Button>
                        </div>
                    </Col>
                </Form>
            </Row>
        </Container>
    );
};

export default Login