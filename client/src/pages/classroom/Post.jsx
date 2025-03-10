import { useFormik } from "formik";
import { useEffect, useContext, useState } from "react";
import { Accordion, Button, Card, Col, Container, Form, Image, Row, Popover, OverlayTrigger } from "react-bootstrap";
import { fetchCreatePost, fetchDeletePost, fetchDownloadPostFile, fetchPostsByClassroom, fetchPostsBySlot } from "../../services/PostService.js";
import { AuthContext } from "../../context/AuthContext.js";
import { GrDocumentDownload } from "react-icons/gr";
import moment from "moment";
import { saveAs } from "file-saver";
import { AiFillDelete } from "react-icons/ai";
import { postValidation } from "../../validations";
import { useLocation, useParams } from "react-router-dom";
import { fetchClassroomDetail } from "../../services/ClassroomService.js";

const Post = () => {
    const location = useLocation()
    const { classroomID, slotID } = useParams();
    const { slotIndex, title, content } = location.state || {}
    const { posts, setPosts, user, classroom, setClassroom } = useContext(AuthContext);
    const [showPopover, setShowPopover] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const getPostsBySlot = async () => {
            let { data } = await fetchPostsBySlot(classroomID, slotID);
            console.log(data)
            const currentPost = data.posts.posts;
            setPosts([...currentPost]);
        };
        getPostsBySlot();
        const getClassroomDetail = async (id) => {
            try {
                const { data } = await fetchClassroomDetail(id);
                setClassroom(data.data);
            } catch (err) {
                console.log(err)
            }
        };
        getClassroomDetail(classroomID)
    }, [setPosts]);

    const downloadFile = async (filename) => {
        saveAs(fetchDownloadPostFile(filename), `${filename}`);
    };

    const deletePost = async (slotID, postID) => {
        await fetchDeletePost(slotID, postID);
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postID));
        setShowPopover(false);
    };

    const popover = (
        <Popover id="delete-popover">
            <Popover.Body>
                <p className="mb-2">Are you sure you want to delete this post?</p>
                <div className="d-flex justify-content-end">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => setShowPopover(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deletePost(slotID, selectedPost._id)}
                    >
                        Delete
                    </Button>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <Container>
            <Card className="shadow-sm p-3" style={{ backgroundColor: "#F7F7F7" }}>
                <Card.Body>
                    <Card.Title className="fs-3 fw-bold">Slot {slotIndex}</Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">{title}</Card.Subtitle>
                    <hr />
                    <Card.Text>{content}</Card.Text>
                </Card.Body>
            </Card>

            <CreatePostInputs classroom={classroom} classroomID={classroomID} slotID={slotID}/>

            {posts.length === 0 && (
                <Container fluid style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Image src="/images/no_post.jpg" />
                </Container>
            )}

            {posts
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((post) => (
                    <Card className="mt-2" key={post._id}>
                        <Card.Body>
                            <Card.Title>
                                <Row>
                                    <Col>
                                        <h5 className="d-inline me-3">{post.title}</h5>
                                    </Col>
                                    {user._id === post.author._id && (
                                        <Col className="text-end">
                                            <OverlayTrigger
                                                trigger="click"
                                                placement="bottom"
                                                show={showPopover && selectedPost?._id === post._id}
                                                onToggle={() => {
                                                    if (showPopover && selectedPost?._id === post._id) {
                                                        setShowPopover(false);
                                                    } else {
                                                        setSelectedPost(post);
                                                        setShowPopover(true);
                                                    }
                                                }}
                                                overlay={popover}
                                                rootClose
                                            >
                                                <Button size="sm" variant="warning">
                                                    <AiFillDelete />
                                                </Button>
                                            </OverlayTrigger>
                                        </Col>
                                    )}
                                </Row>
                            </Card.Title>
                            <Card.Text>{post.content}</Card.Text>
                        </Card.Body>
                        <Card.Footer className="text-muted">
                            <Row>
                                <Col>
                                    {post.file && (
                                        <Button size="sm" onClick={() => downloadFile(post.file)} variant="outline-success">
                                            <GrDocumentDownload className="me-2" />
                                            Click to download document
                                        </Button>
                                    )}
                                </Col>
                                <Col className="text-end">
                                    {post.author.name} {post.author.lastname}
                                    <span className="ms-2">|</span>
                                    <span className="ms-2">
                                        {moment(post.createdAt).format("DD.MM.YYYY HH:mm")}
                                    </span>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                ))}
        </Container>
    );
};

export default Post;

const CreatePostInputs = ({ classroom, classroomID, slotID }) => {
    const formData = new FormData();
    const { setPosts } = useContext(AuthContext);

    const formik = useFormik({
        initialValues: {
            title: "",
            content: "",
            post_file: null,
        },
        validationSchema: postValidation,
        onSubmit: async (values, bag) => {
            formData.append("title", values.title);
            formData.append("content", values.content);
            formData.append("post_file", values.post_file);

            await fetchCreatePost(classroomID, slotID, formData);
            let { data } = await fetchPostsBySlot(classroomID, slotID)
            const currentPost = data.posts.posts;
            setPosts([...currentPost]);
        },
    });

    const handleChangeFile = (e) => {
        formik.setFieldValue("post_file", e.target.files[0]);
    };

    return (
        <Accordion defaultActiveKey={0} className="mt-3" >
            <Accordion.Item eventKey="0">
                <Accordion.Header>Create Post</Accordion.Header>
                <Accordion.Body>
                    <Form className="px-5" onSubmit={formik.handleSubmit} encType="multipart/form-data">
                        <Form.Group className="mt-2">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                onChange={formik.handleChange}
                                type="text"
                                name="title"
                                isInvalid={formik.touched.title && formik.errors.title}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.title}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                onChange={formik.handleChange}
                                as="textarea"
                                rows={2}
                                type="text"
                                name="content"
                            />
                        </Form.Group>
                        <Form.Group controlId="post_file" className="mb-3 mt-2">
                            <Form.Label>File Upload</Form.Label>
                            <Form.Control onChange={handleChangeFile} type="file" name="post_file" aria-label="Upload" />
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button size="sm" type="submit">
                                Send
                            </Button>
                        </div>
                    </Form>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};
