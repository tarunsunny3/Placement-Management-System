import React from "react";
import firebase, { storage } from "./firebaseConfig";
import LinearProgressWithLabel from "./LinearProgressWithLabel.js";
import { v4 as uuidv4 } from "uuid";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import AppContext from "./AppContext";
import imageCompression from "browser-image-compression";
class Upload extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      storageRef: storage.ref(),
      percentUploaded: 0,
      uploadTask: null,
      file: null,
      uploadState: "",
      fileErrors: [],
      alertOpen: true,
    };
  }
  componentDidMount() {
    this.setState({ user: this.context.user });
    console.log("Context data is ", this.context);
  }
  addFile = (event) => {
    const file = event.target.files[0];

    if (file) {
      let isAuthorized = true;
      const fileType = this.props.type;
      let fileErrors = [];
      if (fileType === "image") {
        let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (!allowedExtensions.exec(file.name)) {
          isAuthorized = false;
          fileErrors.push({
            type: "error",
            message: "Please select a file which is an image(jpg/jpeg/png)",
          });
        }
        if (file.size >= 5 * Math.pow(10, 6)) {
          isAuthorized = false;
          fileErrors.push({
            type: "error",
            message: "please select a file size<5MB",
          });
        }
      } else if (fileType === "doc") {
        let allowedExtensions = /(\.pdf|\.docx|\.doc)$/i;
        if (!allowedExtensions.exec(file.name)) {
          isAuthorized = false;
          fileErrors.push({
            type: "error",
            message: "please select a file which is [pdf, doc, docx]",
          });
        }
        if (file.size >= 10 * Math.pow(10, 6)) {
          isAuthorized = false;
          fileErrors.push({
            type: "error",
            message: "please select a file size<10MB",
          });
        }
      }
      if (isAuthorized) {
        this.setState({ file, fileErrors: [] });
      } else {
        event.target.value = "";
        this.setState({ fileErrors, alertOpen: true });
        setTimeout(() => {
          this.setState({ fileErrors: [] });
        }, 4000);
      }
    }
  };

  handleErrors = () => {
    return this.state.fileErrors.map((message, key) => (
      <Collapse
        key={key}
        style={{ marginTop: "20px", marginLeft: "3%", width: "90%" }}
        in={this.state.alertOpen}
      >
        <Alert severity={message.type} variant="filled">
          {message.message}
        </Alert>
      </Collapse>
    ));
  };
  //Set the location where we want to store these images in firebase storage
  uploadFile = async (file) => {
    // console.log(file);
    console.log(this.state.user._id);
    if (file !== null) {
      let filePath = "";
      // location in storage you want to create/send file to

      if (this.state.user !== null) {
        filePath = `/${this.props.saveFolder}/${this.state.user._id}-${file.name}`;
      } else {
        //If in some case we are not able to get the user id then we use random uuid
        filePath = `/${this.props.saveFolder}/${uuidv4()}-${file.name}`;
      }

      this.setState({
        uploadState: "uploading",
      });
      console.log("originalFile instanceof Blob", file instanceof Blob); // true
      console.log(`originalFile size ${file.size / 1024 / 1024} MB`);

      const options = {
        maxSizeMB: 0.01,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      let compressedFile = null;
      try {
        compressedFile = await imageCompression(file, options);
        console.log(
          "compressedFile instanceof Blob",
          compressedFile instanceof Blob
        ); // true
        console.log(
          `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        ); // smaller than maxSizeMB
      } catch (error) {
        console.log(error);
      }
      if (compressedFile !== null) {
        file = compressedFile;
      }
      this.setState(
        {
          uploadTask: this.state.storageRef.child(filePath).put(file),
        },
        () => {
          this.state.uploadTask.on(
            "state_changed",
            (snap) => {
              const percentUploaded = Math.round(
                (snap.bytesTransferred / snap.totalBytes) * 100
              );
              this.setState({ percentUploaded });
            },
            (err) => {
              console.error(err);
              this.setState({
                fileErrors: this.state.fileErrors.concat(err),
                uploadState: "error",
                uploadTask: null,
              });
            },
            () => {
              this.state.uploadTask.snapshot.ref
                .getDownloadURL()
                .then((downloadUrl) => {
                  this.setState({ uploadState: "done" }, () => {
                    if (this.props.name === "profilePicture") {
                      this.props.handleProfilePicture(downloadUrl);
                    } else if (this.props.name === "resume") {
                      //It is a resume
                      this.props.handleResume(downloadUrl);
                    } else if (this.props.name === "offerLetter") {
                      this.props.handleOfferLetter(downloadUrl);
                    }
                    // alert('this is the download url', downloadUrl);
                  });
                })
                .catch((err) => {
                  console.error(err);
                  this.setState({
                    fileErrors: this.state.fileErrors.concat(err),
                    uploadState: "error",
                    uploadTask: null,
                  });
                });
            }
          );
        }
      );
    } else {
      alert("Please choose a file");
    }
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.uploadFile(this.state.file);
  };

  componentWillUnmount() {
    if (this.state.uploadTask !== null) {
      this.state.uploadTask.cancel();
      this.setState({ uploadTask: null });
    }
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.state.uploadState === "done" && (
            <p style={{ color: "green", fonrtWeight: "600" }}>
              Uploaded Successfully
            </p>
          )}
          {this.handleErrors()}
          <input
            onChange={this.addFile}
            disabled={this.state.uploadState === "uploading"}
            name="file"
            type="file"
            accept={this.props.type === "image" ? "image/*" : ""}
          />
          <Button variant="contained" color="primary" type="submit">
            Upload
          </Button>
        </form>

        <LinearProgressWithLabel
          value={this.state.percentUploaded}
          uploadState={this.state.uploadState}
        />
      </div>
    );
  }
}

export default Upload;
