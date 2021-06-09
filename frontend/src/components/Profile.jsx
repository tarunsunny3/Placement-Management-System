import React from 'react'
import {storage } from './firebaseConfig';
import LinearProgressWithLabel from './LinearProgressWithLabel.js';
import {v4 as uuidv4} from 'uuid';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';

class UploadImage extends React.Component {

  constructor(props){
    super(props);
    this.state ={
      storageRef: storage.ref(), // ADD THIS LINE
      percentUploaded: 0, // ADD THIS LINE TOO
      uploadTask: null, // ADD THIS LINE TOO, SEE BELOW
      file: null,
      uploadState: "",
      authorizedImageFileTypes: ['image/jpeg', 'image/png'],
      fileErrors: [],
      alertOpen: true
    }
  }
  addFile = (event) => {
    // event.preventDefault();
    const file = event.target.files[0];

    if (file) {
      let isAuthorized = true;
      const fileType = this.props.type;
      let fileErrors = [];
      if(fileType==="image"){
        if(!this.state.authorizedImageFileTypes.includes(file.type)){
          isAuthorized = false;
          fileErrors.push({type:"error", message: "Please select a file which is an image(jpg/jpeg/png)"});
        }
        if(file.size >= 5*Math.pow(10, 6)){
          isAuthorized = false;
          fileErrors.push({type:"error", message:"please select a file size<5MB"});
        }
      }else if(fileType==="pdf"){
        if(file.type !== "application/pdf"){
          isAuthorized = false;
          fileErrors.push({type:"error", message:  "please select a file which is a pdf"});
        }
        if(file.size >= 10*Math.pow(10, 6)){
          isAuthorized = false;
          fileErrors.push({type:"error", message:"please select a file size<10MB"});
        }
      }
      if(isAuthorized){
        this.setState({ file, fileErrors:[] });
      }else{
        event.target.value = "";
        this.setState({fileErrors, alertOpen: true});
        setTimeout(()=>{
          this.setState({fileErrors:[]})
        }, 4000);
      }
    }
  };

  handleErrors = () => {

    return this.state.fileErrors.map((message, key) =>
    (<Collapse style={{  marginTop: '20px',
      width: '100%',
    }} in={this.state.alertOpen}>
      <Alert
        severity={message.type}
        variant="filled"
        >
          {message.message}
        </Alert>
      </Collapse>)

  )
  }
  //Set the location where we want to store these images in firebase storage
  uploadFile = (file) => {
      // console.log(file);
      if(file !== null){
        const fileType = this.props.type;
        let filePath="";
      // location in storage you want to create/send file to
        if(fileType === "image"){
           filePath = `/images/${uuidv4()}-${file.name}`;
        }else if (fileType==="pdf"){
          filePath = `/resumes/${uuidv4()}-${file.name}`;
        }
        this.setState({
          uploadState: "uploading"
        })
        this.setState({
          uploadTask: this.state.storageRef.child(filePath).put(file)
        },
          () => {
            this.state.uploadTask.on(
              'state_changed',
              snap => {
                const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                this.setState({ percentUploaded });
            },
              err => {
                console.error(err);
                this.setState({
                  fileErrors: this.state.fileErrors.concat(err),
                  uploadState: 'error',
                  uploadTask: null
                });
              },
              () => {
                this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                  this.setState({ uploadState: 'done' },()=>{
                      if(fileType==="image"){
                        this.props.handleProfilePicture(downloadUrl);
                      }else if(fileType==="pdf"){
                        //It is a resume
                        this.props.handleResume(downloadUrl);
                      }
                      // alert('this is the download url', downloadUrl);
                  })


                })
                .catch(err => {
                  console.error(err);
                  this.setState({
                    fileErrors: this.state.fileErrors.concat(err),
                    uploadState: 'error',
                    uploadTask: null
                  })
                })
              }
            )
          }
        )
      }else{
        alert("Please choose a file");
      }
  }
  handleSubmit = event => {
    event.preventDefault();
    this.uploadFile(this.state.file);
  };

componentWillUnmount(){
    if (this.state.uploadTask !== null) {
      this.state.uploadTask.cancel();
      this.setState({ uploadTask: null });
    }
}
render(){
  return (
<div>
    <form onSubmit={this.handleSubmit}>
        <p> {this.props.type==="image"? "Choose the profile picture" : "Select the resume file" }</p>
    {this.state.uploadState === 'done' && <p style={{color: "green", fonrtWeight: "600"}}>Uploaded Successfully</p>}
    {this.handleErrors()}
      <input  onChange={this.addFile}
              disabled={this.state.uploadState === 'uploading' }
              name="file"
              type="file"
              accept={this.props.type==="image"? "image/*" : "application/pdf" }
            />
      <Button style={{marginTop: "2%"}}  variant="contained" color="primary" type="submit" >Upload</Button>
    </form>

    <LinearProgressWithLabel value={this.state.percentUploaded} uploadState={this.state.uploadState} />
</div>
  )
}
}

export default UploadImage;
