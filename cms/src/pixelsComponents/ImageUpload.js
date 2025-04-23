import React from "react";
import { Upload, message, Modal, Button, Icon } from "antd";
import Auxiliary from "util/Auxiliary";
import "./imageUpload.less";

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: props.fileList.length ? props.fileList : [],
      defaultFileList: props.fileList.length
        ? [
            {
              uid: "1",
              name: props.fileList[0].uid,
              status: "done",
              url: props.fileList[0].url
            }
          ]
        : [],
      previewVisible: false,
      previewImage: ""
    };
  }

  customRequest = data => {
    var reader = new FileReader();

    reader.addEventListener("load", () =>
      this.setState({
        file: data.file,
        fileSrc: reader.result,
        fileList: [
          {
            uid: data.file.uid,
            name: data.file.name,
            status: "done",
            url: reader.result
          }
        ]
      })
    );

    reader.readAsDataURL(data.file);

    if ("getFile" in this.props) {
      this.props.getFile(data.file);
    }
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: false
    });
  };

  handleChange = data => {
    let updateState = {
      fileList:
        data.fileList && data.fileList.length
          ? [data.fileList[data.fileList.length - 1]]
          : []
    };

    if (data.fileList.length === 0) {
      updateState.fileSrc = "";
      updateState.file = null;
      if ("onRemove" in this.props) this.props.onRemove();
    }

    this.setState(updateState);
  };

  beforeUpload(file) {
    let isMedia;

    if (
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/gif" ||
      file.type === "video/mp4" ||
      file.type === "video/webm" ||
      file.type === "video/x-matroska" ||
      file.type === "video/quicktime"
    )
      isMedia = true;
    else isMedia = false;

    if (!isMedia)
      message.error(
        "You can only upload an image (JPG/ PNG/ GIF) or a video (MP4/ MOV/ MKV)!"
      );

    // console.log(file.type)
    const isLt5M = file.size / 1024 / 1024 < 60;
    if (!isLt5M) message.error("File must smaller than 60 MB!");

    return isMedia && isLt5M;
  }

  beforeUploadImage(file) {
    let isImg;

    if (
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/gif"
    )
      isImg = true;
    else isImg = false;

    if (!isImg) message.error("You can only upload JPG, PNG, or GIF file!");

    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) message.error("Image must smaller than 3 MB!");

    return isImg && isLt3M;
  }

  beforeUploadVideo(file) {
    let isVideo;

    if (
      file.type === "video/mp4" ||
      file.type === "video/webm" ||
      file.type === "video/x-matroska" ||
      file.type === "video/quicktime"
    )
      isVideo = true;
    else isVideo = false;

    if (!isVideo) message.error("You can only upload MP4, MOV or MKV file!");

    const isLt10M = file.size / 1024 / 1024 < 60;
    if (!isLt10M) message.error("Video must smaller than 60 MB!");

    return isVideo && isLt10M;
  }

  componentDidMount() {
    // check if there is a preview for image
    if ("image" in this.props) {
      this.setState({
        fileSrc: this.props.image,
        fileList: [
          {
            uid: "-1",
            name: "xxx.png",
            status: "done",
            url: this.props.image
          }
        ]
      });
    }
  }

  toggleUploadButton = () => {
    const { crud, fileName, maxImagesCount } = this.props;
    const { fileList } = this.state;

    const uploadButton = (
      <div>
        <Button style={{ marginBottom: 0 }}>+ Image</Button>
      </div>
    );

    switch (crud) {
      case "read":
        if (fileName === null) return null;
        if (fileList.length && !maxImagesCount) return null;
        return uploadButton;

      case "create":
        if (fileList.length && !maxImagesCount) return null;
        if (fileList.length && fileList.length === maxImagesCount) return null;
        return uploadButton;

      case "update":
        if (fileList.length && !maxImagesCount) return null;
        if (fileList.length && fileList.length >= maxImagesCount) return null;
        return uploadButton;

      default:
        return null;
    }
  };

  render() {
    // console.log("UPLOAD COMPONENT STATE: ", this.state);
    // prettier-ignore
    const { previewVisible, previewImage, defaultFileList, fileList, file } = this.state;
    const { crud, fileType, hideUploadList, mediaFile } = this.props;

    let uploadListObj = {};
    if (hideUploadList) uploadListObj = { showUploadList: false };

    return (
      <Auxiliary>
        {fileType && (fileType === "video" || fileType === "media") ? (
          <Upload
            className="normalUploadBtn"
            customRequest={this.customRequest}
            beforeUpload={
              fileType === "video" ? this.beforeUploadVideo : this.beforeUpload
            }
            fileList={file ? fileList : defaultFileList}
            onChange={this.handleChange}
            supportServerRender={true}
            {...uploadListObj}
          >
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
            {hideUploadList ? (
              <>
                <br />
                {(mediaFile && file && file.name) || ""}
              </>
            ) : null}
          </Upload>
        ) : (
          <Upload
            listType="picture-card"
            customRequest={this.customRequest}
            fileList={fileList}
            onChange={this.handleChange}
            supportServerRender={true}
            showUploadList={{
              showRemoveIcon: crud === "read" ? false : true,
              showDownloadIcon: false,
              showPreviewIcon: false
            }}
            beforeUpload={
              fileType && fileType === "image"
                ? this.beforeUploadImage
                : this.beforeUpload
            }
          >
            {this.toggleUploadButton()}
          </Upload>
        )}
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Auxiliary>
    );
  }
}

export default ImageUpload;
