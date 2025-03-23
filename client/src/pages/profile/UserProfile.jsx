import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { fetchUser, fetchUpdateUser } from "../../services/AuthService";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const UserProfile = () => {
    const { setUser } = useContext(AuthContext); 
    const [user, setLocalUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", lastname: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await fetchUser();
                setLocalUser(response.data.user);
                setFormData({
                    name: response.data.user.name || "",
                    lastname: response.data.user.lastname || ""
                });
            } catch (error) {
                toast.error("Error fetching user data!");
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user._id) {
            toast.error("User data is not available!");
            return;
        }

        try {
            const updatedUser = await fetchUpdateUser(user._id, formData);
            console.log(updatedUser)
            if (updatedUser) {
                setLocalUser(updatedUser.data); 
                setUser(updatedUser.data); 
                toast.success("Update information successfully!");
            } else {
                toast.error("Error updating information!");
            }
        } catch (error) {
            toast.error("Error updating information!");
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title style={{ textAlign: "center" }}>User Profile</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={user.email} disabled />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Update Profile
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;
