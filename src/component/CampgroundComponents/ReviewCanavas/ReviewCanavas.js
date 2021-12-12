import { axiosInstance } from "../../../Redux/network";
import React, { useEffect, useState } from "react";
import { Card, Form, Modal } from "react-bootstrap";
import "./ReviewCanavas.css";
import { Rating } from "react-simple-star-rating";
import "animate.css";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
export default function ReviewCanavas() {
  const [rating, setRating] = useState(0);
  const [show, setShow] = useState(false);
  const [reviews, setReviews] = useState();
  const [review, setReview] = useState();
  const [msg, setMsg] =useState(false)


  useEffect(() => {
    axiosInstance
      .get("campground/review/61a9686369692796a2797f50")
      .then((result) => {
        setReview(result.data.data.reverse());
      });
  }, []);

  const handleRating = (rate = 0) => {
    setRating(rate);
    
  };

  const leaveReview = () => {
    reviews.starRating = rating / 20;
    axiosInstance
      .post("campground/review/" + "61a9686369692796a2797f50", reviews)
      .then((result) => {
        if (!result.data.success) {
          alert(result.data.msg);
        }else{
          setMsg(true)
          setTimeout(() => {
              setMsg(false);
          }, 3000);
        }

        axiosInstance
          .get("campground/review/61a9686369692796a2797f50")
          .then((result) => {
            setReview(result.data.data.reverse());
          });
      });
  };

  const onChange = (e) => {
    setReviews({ ...reviews, [e.target.name]: e.target.value });
    console.log(reviews);
  };
  return (
    <div className="containr-fluid">
      <div className="my-3">
        {" "}
        <div className="text-center">
          <Button
            onClick={() => setShow(true)}
            color="info"
            variant="outlined"
            size="small"
          >
            {" "}
            Leave Review
          </Button>
        </div>
        {msg && (
          <Stack
            sx={{ width: "100%" }}
            spacing={2}
            className="my-5 animate__animated animate__slideInLeft"
          >
            <Alert variant="filled" severity="success">
              Thank you for your review
            </Alert>
          </Stack>
        )}
      </div>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <h6 className="mt-2 fw-bold">
            Please leave a review and say what your opinion about this
            Campground.
          </h6>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Type your review here:</Form.Label>
            <Form.Control
              name="body"
              as="textarea"
              rows={5}
              onChange={onChange}
            />
          </Form.Group>
          <div className="my-3 text-center">
            Rate by star
            <Rating
              onClick={handleRating}
              ratingValue={rating}
              name="starRating"
            />
          </div>

    
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => {
                setShow(false);
                leaveReview();
              }}
              variant="contained"
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Stack>
        </Modal.Body>
      </Modal>
      {review &&
        review.map((x) => {
          return (
            <div className="container my-5">
              <div className="d-flex align-items-center">
                <div>
                  <Card.Img
                    variant="top"
                    src={x.userId.personalImage}
                    style={{
                      width: "65px",
                      height: "65px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div className="ms-2">
                  <h5>{x.userId.username}</h5>
                </div>
                <div className="ms-auto">
                  <span class="badge-rating">{x.starRating}</span>
                </div>
              </div>
              <div className="col-12 mt-3">
                <p className="ms-5">{x.body}</p>
              </div>
              <hr />
            </div>
          );
        })}
    </div>
  );
}
