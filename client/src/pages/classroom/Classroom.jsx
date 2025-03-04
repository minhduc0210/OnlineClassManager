import React, { useContext, useEffect } from "react";
import { Alert, Badge, Col, Container, Row, Spinner, Tabs } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchClassroomDetail } from "../../services/ClassroomService";
import { AuthContext } from "../../context/AuthContext";
import NotFoundClassroom from "../home/NotFoundClassroom";

const Classroom = () => {
    const { classroomID } = useParams();
    const { classroom, setClassroom, user } = useContext(AuthContext);

    useEffect(() => {
        const getClassroomDetail = async (id) => {
            try {
                const { data } = await fetchClassroomDetail(id);
                setClassroom(data.data);
            } catch (err) {
                console.log(err)
            }
        };
        getClassroomDetail(classroomID);
    }, [classroomID, setClassroom]);

    if (!classroom) {
        return (
            <NotFoundClassroom />
        );
    }

    return (
        <Container>
            <Row className="mt-4">
                <Col>
                    <h1 style={{ color: "#333978" }}>
                        {classroom.title}{" "}
                        {/* {user.role === "teacher" && (
                            
                        )} */}
                    </h1>
                </Col>
                <Col className="text-end">
                    <span className="d-block">
                        Teacher: {classroom?.teacher.name} {classroom?.teacher.lastname}
                    </span>
                    <span className="d-block">
                        Access Code: <Badge bg="info">{classroom.accessCode}</Badge>
                    </span>
                </Col>
                <hr className="bg-primary" />
            </Row>

            <Tabs defaultActiveKey={"posts"}>
                {/* <Tab eventKey={"posts"} title="Posts">
                    <PostTab posts={classroom.posts} classroom={classroom} />
                </Tab> */}
                {/* <Tab eventKey={"students"} title="Students">
                    <StudentTab students={classroom.students} />
                </Tab>
                <Tab eventKey={"homeworks"} title="Homeworks">
                    <HomeworkTab homeworks={classroom.homeworks} />
                </Tab> */}
            </Tabs>
        </Container>
    );
};

export default Classroom;