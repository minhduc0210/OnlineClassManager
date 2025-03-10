import React from "react";
import { Badge, Card } from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";

const SlotList = ({ slots, classroom }) => {
    if (!slots || slots.length === 0) {
        return <p>No slots available.</p>;
    }

    return (
        <div>
            {slots.map((slot, index) => (
                <Card key={slot._id} className="mb-3 p-3 shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5>
                            <Badge bg="secondary" className="me-2">Slot {index + 1}</Badge>
                        </h5>
                        <Link
                            to={`/classroom/${classroom._id}/${slot._id}`}
                            state={{ slotIndex: index + 1, title: slot.title, content: slot.content }}
                            className="text-primary fw-bold"
                        >
                            View slot
                        </Link>

                    </div>

                    <p className="text-muted">
                        📅 {moment(slot.startTime).format("HH:mm DD/MM/YYYY")} - {moment(slot.endTime).format("HH:mm DD/MM/YYYY")}
                    </p>

                    <div>
                        <strong>{slot.title}</strong>
                        <p>{slot.content}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default SlotList;
