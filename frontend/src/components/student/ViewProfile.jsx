import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import AppContext from "../AppContext";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleOutlineTwoToneIcon from "@material-ui/icons/RemoveCircleOutlineTwoTone";
import AddCircleOutlineTwoToneIcon from "@material-ui/icons/AddCircleOutlineTwoTone";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import "./ViewProfile.css";
import BackdropLoad from "../BackdropLoad";
import { Avatar, Modal } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import UploadFile from "../UploadFile";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
const StyledInput = withStyles({
  root: {
    "& fieldset": {
      borderColor: "#005792",
    },
    textTransform: "capitalize",
    "& input:valid:focus + fieldset": {
      borderLeftWidth: 7,
      padding: "4px !important", // override inline-style
    },
  },
})(TextField);
const ViewProfile = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = React.useContext(AppContext);
  const [grades, setGrades] = useState([]);
  const [gradesInputArray, setGradesInputArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [collapseVisible, setCollapseVisible] = useState(false);
  const [showGrades, setShowGrades] = useState(false);
  const [editModal, setEditModal] = useState({ type: "", show: false });
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const uploadFileToServer = async (type, val) => {
    let updateData;
    if (user !== undefined && user.details !== undefined) {
      const userDetails = user.details;
      userDetails[type] = val;
      updateData = {
        details: userDetails,
      };
    } else {
      updateData = {
        details: {
          [type]: val,
        },
      };
    }
    console.log(updateData);
    const res = await axios.post("/api/updateUserDetails", { updateData });
    console.log(res.data);
    if (res.data.success) {
      history.go(0);
    }
  };
  const handleProfilePicture = (downloadURL) => {
    uploadFileToServer("profilePictureLink", downloadURL);
  };
  const handleResumeFile = (URL) => {
    uploadFileToServer("resumeLink", URL);
  };
  const handleAddRemaining = () => {
    setCollapseVisible(true);

    let values = [];
    for (
      let i = user.details.semesterWisePercentage.length;
      i < Number(user.details.semesters);
      i++
    ) {
      values.push({ grade: "" });
      setGradesInputArray(values);
    }
    // console.log(values);/
  };
  const handleAddField = (key) => {
    setCollapseVisible(true);
    let values = [...gradesInputArray];
    values.push({ grade: "" });
    setGradesInputArray(values);
  };
  const handleRemoveField = (index) => {
    let values = [...gradesInputArray];
    values.splice(index, 1);
    let gradesArray = [];
    values.map((val, key) => {
      return gradesArray.push(Number(val.grade));
    });
    setGrades(gradesArray);
    setGradesInputArray(values);
  };
  const handleCollapseAll = () => {
    setCollapseVisible(false);
    setGradesInputArray([]);
  };
  const handleSemGrade = (event, index) => {
    let values = [...gradesInputArray];
    values[index][event.target.name] = event.target.value;
    let gradesArray = [];
    values.map((val, key) => {
      return gradesArray.push(Number(val.grade));
    });
    setGrades(gradesArray);
    setGradesInputArray(values);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let updateData = {};

    if (user !== undefined && user.details !== undefined) {
      const userDetails = user.details;
      for (let i = 0; i < grades.length; i++) {
        userDetails.semesterWisePercentage.push(grades[i]);
      }
      updateData = {
        details: userDetails,
      };
    } else {
      const userDetails = user.details;
      userDetails.semesterWisePercentage = grades;
      updateData = {
        details: userDetails,
      };
    }
    const res = await axios.post("/api/updateUserDetails", { updateData });
    console.log(res.data);
    if (res.data.success) {
      history.go(0);
    }
  };
  return (
    <div>
      {loading ? (
        <BackdropLoad />
      ) : (
        <Grid container spacing={1}>
          <Modal
            open={editModal.show}
            onClose={() => setEditModal({ ...editModal, show: false })}
          >
            <div style={{ backgroundColor: "white", padding: "2%" }}>
              {editModal.type === "image" ? (
                <>
                  <p>Please choose a new profile picture</p>
                  <UploadFile
                    handleProfilePicture={handleProfilePicture}
                    type="image"
                    name="profilePicture"
                    saveFolder="images"
                  />
                </>
              ) : (
                <>
                  <p>Please choose a new Resume file</p>
                  <UploadFile
                    handleResume={handleResumeFile}
                    type="doc"
                    name="resume"
                    saveFolder="resumes"
                  />
                </>
              )}
            </div>
          </Modal>
          {/* <div style={{margin: "auto", textAlign: "center"}}> */}
          {user.details === undefined ? (
            <>
              <p>
                Please finish the{" "}
                <Link to="/studentReg/register">registration</Link> first!!
              </p>
            </>
          ) : (
            <>
              <Grid item xs={12} md={6}>
                <div
                  style={{ borderTop: "13px groove blue", borderBottom: "12px groove blue" }}
                  className="image-container"
                >
                  {
                    user.details.profilePictureLink !== undefined && (
                      <Avatar
                        style={{
                          marginLeft: "20%",
                          width: "200px",
                          height: "200px",
                        }}
                        src={user.details.profilePictureLink}
                      ></Avatar>
                    )

                    // <img className="profileImage" id="profile-image" src={user.details.profilePictureLink} alt="user profile"/>
                  }
                  <Grid
                    container
                    spacing={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-around"
                  >
                    <Grid item xs={6} sm={6}>
                      <IconButton
                        onClick={() =>
                          setEditModal({ type: "image", show: true })
                        }
                      >
                        <span>
                          <i className="fas fa-edit"> Image</i>
                        </span>
                      </IconButton>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <IconButton
                        onClick={(event) => setAnchorEl(event.currentTarget)}
                      >
                        <span>
                          <i className="fas fa-file">Resume</i>
                        </span>
                      </IconButton>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleClose}>
                          <a
                            download="resume.pdf"
                            href={user.details.resumeLink || "#"}
                          >
                            <Button component={"p"}>View Resume</Button>
                          </a>
                        </MenuItem>

                        <MenuItem onClick={handleClose}>
                          <Button
                            onClick={() =>
                              setEditModal({ type: "resume", show: true })
                            }
                            component={"p"}
                          >
                            Update Resume
                          </Button>
                        </MenuItem>
                      </Menu>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div style={{ marginTop: "10%", marginRight: "2px" }}>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>ID number</td>
                        <td>{user.username}</td>
                      </tr>
                      <tr>
                        <td>Name</td>
                        <td>
                          {user.details.firstName + " " + user.details.lastName}
                        </td>
                      </tr>
                      {user.role === "Student" && (
                        <>
                          <tr>
                            <td>Email</td>
                            <td>{user.details.email}</td>
                          </tr>

                          <tr>
                            <td>Phone Number</td>
                            <td>{user.details.phone}</td>
                          </tr>
                          <tr>
                            <td>Gender</td>
                            <td>{user.details.gender}</td>
                          </tr>

                          {showGrades && (
                            <>
                              {user.details.semesterWisePercentage.map(
                                (grade, key) => {
                                  return (
                                    <tr key={key}>
                                      <td>Semester {key + 1}</td>
                                      <td>{grade}</td>
                                    </tr>
                                  );
                                }
                              )}
                            </>
                          )}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                <Button
                  style={{marginLeft: "2%", marginBottom: "5%"}}
                  className="showGradesButton"
                  onClick={() => setShowGrades(!showGrades)}
                  variant="contained"
                  color="primary"
                >
                  {!showGrades ? "Show SGPAs" : "Hide SGPAs"}{" "}
                </Button>
                {showGrades &&
                  user.details !== undefined &&
                  user.details.semesters !== undefined &&
                  user.details.semesters >
                    user.details.semesterWisePercentage.length && (
                    <div className="grades">
                      <p>
                        You have to enter{" "}
                        <b>
                          {user.details.semesters -
                            user.details.semesterWisePercentage.length}{" "}
                        </b>
                        more semesters Grades
                      </p>
                      {gradesInputArray.length === 0 && (
                        <>
                          <h3>
                            Add field to enter grades for each sem?{" "}
                            <span>
                              <IconButton onClick={() => handleAddField()}>
                                <AddCircleOutlineTwoToneIcon />
                              </IconButton>
                            </span>
                          </h3>
                          <span>or</span>
                          <h3>
                            Add all remaining fields?{" "}
                            <span>
                              <IconButton onClick={() => handleAddRemaining()}>
                                <AddCircleOutlineTwoToneIcon />
                              </IconButton>
                            </span>
                          </h3>
                        </>
                      )}
                      {collapseVisible && (
                        <h3>
                          Collapse all fields?{" "}
                          <span>
                            <IconButton onClick={() => handleCollapseAll()}>
                              <RemoveCircleOutlineTwoToneIcon />
                            </IconButton>
                          </span>
                        </h3>
                      )}
                      <form onSubmit={(e) => handleSubmit(e)}>
                        <Grid
                          container
                          direction="column"
                          justify="space-around"
                        >
                          {gradesInputArray.map((val, key) => {
                            const len =
                              user.details.semesterWisePercentage.length;
                            key += len;
                            const autoFocus =
                              key - len === gradesInputArray.length - 1;
                            return (
                              <Grid item xs={12} sm={6} key={key}>
                                <StyledInput
                                  margin="normal"
                                  autoFocus={autoFocus}
                                  name="grade"
                                  required
                                  value={val.grade}
                                  type="number"
                                  label={"Enter Grade for SEM " + (key + 1)}
                                  variant="outlined"
                                  onChange={(event) =>
                                    handleSemGrade(event, key - len)
                                  }
                                />
                                {key === gradesInputArray.length + len - 1 &&
                                  key < Number(user.details.semesters) - 1 && (
                                    <IconButton
                                      onClick={(key) => handleAddField(key)}
                                    >
                                      <AddCircleOutlineTwoToneIcon />
                                    </IconButton>
                                  )}

                                <IconButton
                                  onClick={(event) =>
                                    handleRemoveField(key - len)
                                  }
                                >
                                  <RemoveCircleOutlineTwoToneIcon />
                                </IconButton>
                              </Grid>
                            );
                          })}
                        </Grid>
                        {gradesInputArray.length > 0 && (
                          <Button
                            style={{marginBottom: "5%"}}
                            type="submit"
                            variant="contained"
                            color="primary"
                          >
                            Submit
                          </Button>
                        )}
                      </form>
                    </div>
                  )}
              </Grid>
            </>
          )}
        </Grid>
      )}
    </div>
  );
};

export default ViewProfile;
