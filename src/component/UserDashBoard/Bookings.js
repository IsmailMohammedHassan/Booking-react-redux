import React from "react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../Redux/network";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import ButtonFromMui from "@mui/material/Button";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import PaymentIcon from "@mui/icons-material/Payment";

export default function Bookings() {
  let [userBookings, setUserBookings] = useState();
  let [paypalAccount, setPaypalAccount] = useState();

  const [show, setShow] = useState(false);
  const [propClick, setPropClick] = useState();
  const [BK, setBK] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    axiosInstance.get("filter/booking").then((result) => {
      setUserBookings(result.data.data);
    });
  }, []);

  const cancel = () => {
    switch (propClick) {
      case "hotel":
        if (
          window.confirm(
            "Are you sure !! you will get your money back in 72 hours"
          )
        ) {
          axiosInstance
            .delete(
              "hotel/booking/" +
                BK.hotelId +
                "/" +
                BK.roomId +
                "/" +
                BK.booking._id,
              paypalAccount
            )
            .then((result) => {
              let newarr = userBookings.hotels.filter((item) => {
                return item.booking._id != BK.booking._id;
              });
              setUserBookings({ ...userBookings, hotels: newarr });
            });
        }
        break;
      case "campground":
        if (
          window.confirm(
            "Are you sure !! you will get your money back in 72 hours"
          )
        ) {
          axiosInstance
            .delete(
              "campground/booking/" +
                BK.campgroundId +
                "/" +
                BK.roomId +
                "/" +
                BK.booking._id,
              paypalAccount
            )
            .then((result) => {
              let newarr = userBookings.campgrounds.filter((item) => {
                return item.booking._id != BK.booking._id;
              });
              setUserBookings({ ...userBookings, campgrounds: newarr });
            });
        }
        break;
      case "apartment":
        if (
          window.confirm(
            "Are you sure !! you will get your money back in 72 hours"
          )
        ) {
          axiosInstance
            .delete(
              "apartment/booking/" + BK.apartmentId + "/" + BK.booking._id,
              paypalAccount
            )
            .then((result) => {
              let newarr = userBookings.apartments.filter((item) => {
                return item.booking._id != BK.booking._id;
              });
              setUserBookings({ ...userBookings, apartments: newarr });
            });
        }
        break;
      default:
        break;
    }
  };

  const hotelCancelBooking = (BK) => {
    if (window.confirm("Are U Sure To Cancel This Booking !!")) {
      axiosInstance
        .delete(
          "hotel/booking/" + BK.hotelId + "/" + BK.roomId + "/" + BK.booking._id
        )
        .then((result) => {
          let newarr = userBookings.hotels.filter((item) => {
            return item.booking._id != BK.booking._id;
          });
          setUserBookings({ ...userBookings, hotels: newarr });
        });
    }
  };

  const campCancelBooking = (BK) => {
    if (window.confirm("Are U Sure To Cancel This Booking !!")) {
      axiosInstance
        .delete(
          "campground/booking/" +
            BK.campgroundId +
            "/" +
            BK.roomId +
            "/" +
            BK.booking._id
        )
        .then((result) => {
          let newarr = userBookings.campgrounds.filter((item) => {
            return item.booking._id != BK.booking._id;
          });
          setUserBookings({ ...userBookings, campgrounds: newarr });
        });
    }
  };

  const apartCancelBooking = (BK) => {
    if (window.confirm("Are U Sure To Cancel This Booking !!")) {
      axiosInstance
        .delete("apartment/booking/" + BK.apartmentId + "/" + BK.booking._id)
        .then((result) => {
          let newarr = userBookings.apartments.filter((item) => {
            return item.booking._id != BK.booking._id;
          });
          setUserBookings({ ...userBookings, apartments: newarr });
        });
    }
  };

  return (
    <div className="container">
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th className="">#</th>
            <th className="col-2">Hotel Name</th>
            <th className="col-2">Room Name</th>
            <th className="col-2">Start At</th>
            <th className="col-2">End At</th>
            <th className="col-2">Price</th>
            <th className="col-2" className="text-danger">
              Cancel
            </th>
          </tr>
        </thead>
        <tbody>
          {userBookings &&
            userBookings.hotels.map((hotelBooking, index) => {
              let startdate = new Date(hotelBooking.booking.startAt);
              let enddate = new Date(hotelBooking.booking.endAt);
              let cancelAvailable = false;
              let today = new Date().getUTCDate();
              let year = new Date().getYear();
              let month = new Date().getMonth() + 1;
              let stMonth = startdate.getMonth() + 1;
              let stYear = startdate.getYear();
              let stday = startdate.getUTCDate();

              if (year < stYear) {
                cancelAvailable = true;
              }

              if (month <= stMonth) {
                if (
                  stday - today >= hotelBooking.cancellation ||
                  (stday - today < 0 && stday - today > -3)
                ) {
                  cancelAvailable = true;
                }
              }

              if (month < stMonth) {
                cancelAvailable = true;
              }
              if (year > stYear) {
                cancelAvailable = false;
              }
              if (hotelBooking.booking.cancelFree) {
                cancelAvailable = true;
              }

              return (
                <tr>
                  <th className="fw-normal" scope="row">
                    {index + 1}
                  </th>
                  <td className="fw-normal">{hotelBooking.hotelName}</td>
                  <td className="fw-normal">{hotelBooking.roomName}</td>
                  <td className="fw-normal">{startdate.toDateString()}</td>
                  <td className="fw-normal">{enddate.toDateString()}</td>
                  <td className="fw-normal">
                    {hotelBooking.booking.totalPrice}$
                  </td>
                  <td className="fw-normal">
                    {" "}
                    {cancelAvailable
                      ? ["top"].map((placement) => (
                          <OverlayTrigger
                            key={placement}
                            placement={placement}
                            overlay={
                              <Tooltip id={`tooltip-${placement}`}>
                                <span>
                                  You Can Cancel Before only (
                                  {hotelBooking.cancellation}) Days from the
                                  Start Day
                                </span>
                              </Tooltip>
                            }
                          >
                            <Button
                              variant="btn text-danger fw-bold"
                              onClick={() => {
                                handleShow();
                                setPropClick("hotel");
                                setBK(hotelBooking);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-x-lg"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                                />
                                <path
                                  fill-rule="evenodd"
                                  d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                                />
                              </svg>
                            </Button>
                          </OverlayTrigger>
                        ))
                      : ["top"].map((placement) => (
                          <OverlayTrigger
                            key={placement}
                            placement={placement}
                            overlay={
                              <Tooltip id={`tooltip-${placement}`}>
                                <span>
                                  You Can Cancel Before only (
                                  {hotelBooking.cancellation}) Days from the
                                  Start Day
                                </span>
                              </Tooltip>
                            }
                          >
                            <Button variant="btn text-secondar fw-bold">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-x-lg"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                                />
                                <path
                                  fill-rule="evenodd"
                                  d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                                />
                              </svg>
                            </Button>
                          </OverlayTrigger>
                        ))}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th className="">#</th>
            <th className="col-2">Campground Name</th>
            <th className="col-2">Room Name</th>
            <th className="col-2">Start At</th>
            <th className="col-2">End At</th>
            <th className="col-2">Price</th>
            <th className="col-2" className="text-danger">
              Cancel
            </th>
          </tr>
        </thead>
        <tbody>
          {userBookings &&
            userBookings.campgrounds.map((campBooking, index) => {
              let startdate = new Date(campBooking.booking.startAt);
              let enddate = new Date(campBooking.booking.endAt);
              let cancelAvailable = false;

              let today = new Date().getUTCDate();
              let year = new Date().getYear();
              let month = new Date().getMonth() + 1;
              let stMonth = startdate.getMonth() + 1;
              let stYear = startdate.getYear();
              let stday = startdate.getUTCDate();

              if (year < stYear) {
                cancelAvailable = true;
              }

              if (month <= stMonth) {
                if (
                  stday - today >= campBooking.cancellation ||
                  (stday - today < 0 && stday - today > -3)
                ) {
                  cancelAvailable = true;
                }
              }

              if (month < stMonth) {
                cancelAvailable = true;
              }
              if (year > stYear) {
                cancelAvailable = false;
              }
              if (campBooking.booking.cancelFree) {
                cancelAvailable = true;
              }

              return (
                <tr>
                  <th className="fw-normal" scope="row">
                    {index + 1}
                  </th>
                  <td className="fw-normal">{campBooking.campgroundName}</td>
                  <td className="fw-normal" className="fw-normal">
                    {campBooking.roomName}
                  </td>
                  <td className="fw-normal" className="fw-normal">
                    {startdate.toDateString()}
                  </td>
                  <td className="fw-normal" className="fw-normal">
                    {enddate.toDateString()}
                  </td>
                  <td className="fw-normal" className="fw-normal">
                    {campBooking.booking.totalPrice}$
                  </td>
                  <td className="fw-normal" className="fw-normal">
                    {" "}
                    {cancelAvailable
                      ? ["top"].map((placement) => (
                          <OverlayTrigger
                            key={placement}
                            placement={placement}
                            overlay={
                              <Tooltip id={`tooltip-${placement}`}>
                                <span>
                                  You Can Cancel Before only (
                                  {campBooking.cancellation}) Days from the
                                  Start Day
                                </span>
                              </Tooltip>
                            }
                          >
                            <Button
                              variant="btn text-danger fw-bold"
                              onClick={() => {
                                handleShow();
                                setPropClick("campground");
                                setBK(campBooking);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-x-lg"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                                />
                                <path
                                  fill-rule="evenodd"
                                  d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                                />
                              </svg>
                            </Button>
                          </OverlayTrigger>
                        ))
                      : ["top"].map((placement) => (
                          <OverlayTrigger
                            key={placement}
                            placement={placement}
                            overlay={
                              <Tooltip id={`tooltip-${placement}`}>
                                <span>
                                  You Can Cancel Before only (
                                  {campBooking.cancellation}) Days from the
                                  Start Day
                                </span>
                              </Tooltip>
                            }
                          >
                            <Button variant="btn text-secondar fw-bold">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-x-lg"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                                />
                                <path
                                  fill-rule="evenodd"
                                  d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                                />
                              </svg>
                            </Button>
                          </OverlayTrigger>
                        ))}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th className="">#</th>
            <th className="col-2">ApartMent Name</th>
            <th className="col-2"></th>
            <th className="col-2">Start At</th>
            <th className="col-2">End At</th>
            <th className="col-2">Price</th>
            <th className="col-2" className="text-danger">
              Cancel
            </th>
          </tr>
        </thead>
        <tbody>
          {userBookings &&
            userBookings.apartments.map((apartBooking, index) => {
              let startdate = new Date(apartBooking.booking.startAt);
              let enddate = new Date(apartBooking.booking.endAt);
              let cancelAvailable = false;

              let today = new Date().getUTCDate();
              let year = new Date().getYear();
              let month = new Date().getMonth() + 1;
              let stMonth = startdate.getMonth() + 1;
              let stYear = startdate.getYear();
              let stday = startdate.getUTCDate();

              if (year < stYear) {
                cancelAvailable = true;
              }

              if (month <= stMonth) {
                if (
                  stday - today >= apartBooking.cancellation ||
                  (stday - today < 0 && stday - today > -3)
                ) {
                  cancelAvailable = true;
                }
              }

              if (month < stMonth) {
                cancelAvailable = true;
              }
              if (year > stYear) {
                cancelAvailable = false;
              }
              if (apartBooking.booking.cancelFree) {
                cancelAvailable = true;
              }

              return (
                <tr>
                  <th className="fw-normal" scope="row">
                    {index + 1}
                  </th>
                  <td className="fw-normal">{apartBooking.apartmentName}</td>

                  <td className="fw-normal"></td>
                  <td className="fw-normal">{startdate.toDateString()}</td>
                  <td className="fw-normal">{enddate.toDateString()}</td>
                  <td className="fw-normal">
                    {apartBooking.booking.totalPrice}$
                  </td>

                  <td className="fw-normal">
                    {" "}
                    {cancelAvailable
                      ? ["top"].map((placement) => (
                          <OverlayTrigger
                            key={placement}
                            placement={placement}
                            overlay={
                              <Tooltip id={`tooltip-${placement}`}>
                                <span>
                                  You Can Cancel Before only (
                                  {apartBooking.cancellation}) Days from the
                                  Start Day
                                </span>
                              </Tooltip>
                            }
                          >
                            <Button
                              variant="btn text-danger fw-bold"
                              onClick={() => {
                                handleShow();
                                setPropClick("hotel");
                                setBK(apartBooking);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-x-lg"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                                />
                                <path
                                  fill-rule="evenodd"
                                  d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                                />
                              </svg>
                            </Button>
                          </OverlayTrigger>
                        ))
                      : ["top"].map((placement) => (
                          <OverlayTrigger
                            key={placement}
                            placement={placement}
                            overlay={
                              <Tooltip id={`tooltip-${placement}`}>
                                <span>
                                  You Can Cancel Before only (
                                  {apartBooking.cancellation}) Days from the
                                  Start Day
                                </span>
                              </Tooltip>
                            }
                          >
                            <Button variant="btn text-secondar fw-bold">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-x-lg"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                                />
                                <path
                                  fill-rule="evenodd"
                                  d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                                />
                              </svg>
                            </Button>
                          </OverlayTrigger>
                        ))}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Your Paypal Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box sx={{ "& > :not(style)": { m: 1 } }}>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <PaymentIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                id="input-with-sx"
                label="Paypal account"
                className="w-100"
                variant="standard"
                onChange={(e) =>
                  setPaypalAccount({ paypalAccount: e.target.value })
                }
              />
            </Box>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Stack direction="row" spacing={2}>
            <ButtonFromMui
              variant="contained"
              endIcon={<SendIcon />}
              onClick={() => {
                cancel();
                handleClose();
              }}
            >
              Send
            </ButtonFromMui>
          </Stack>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
