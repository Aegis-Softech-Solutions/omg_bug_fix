import React, { Component } from "react";
import {
  Row,
  Col,
  Upload,
  Icon,
  Input,
  DatePicker,
  Button,
  Select,
  notification,
  message
} from "antd";
import moment from "moment";
import { Editor } from "@tinymce/tinymce-react";
import CustomScrollbars from "util/CustomScrollbars";
import ImageUpload from "../../../../pixelsComponents/ImageUpload";
import { validateForm } from "../../../../pixelsComponents/validateForm";
import createSlug from "../../../../pixelsComponents/createSlug";
import "./formStyle.less";

const { Dragger } = Upload;
const { Option } = Select;

class NewsItemForm extends Component {
  constructor(props) {
    super(props);

    this.filesToUpload = [];
    this.uploadedFileNames = [];
    this.errorShownNames = [];
    this.draggerFileList = [];

    this.state = {
      html_content: props.newsData
        ? props.newsData.html_content || "<p></p>"
        : "<p></p>",
      errors: {},
      draggerFileList: [],
      disableSave: false,
      media_type: "image"
    };
  }

  componentWillMount() {
    const { newsData } = this.props;
    if (newsData && Object.keys(newsData).length) {
      const {
        title,
        slug,
        media_type,
        featured_image,
        excerpt,
        html_content,
        publish_at,
        active
      } = newsData;

      const sessionTitle = sessionStorage.getItem("session_news_title");
      const sessionSlug = sessionStorage.getItem("session_news_slug");
      const sessionExcerpt = sessionStorage.getItem("session_news_excerpt");
      const sessionMediaType = sessionStorage.getItem(
        "session_news_media_type"
      );
      const sessionContent = sessionStorage.getItem(
        "session_news_html_content"
      );
      const sessionPublishAt = sessionStorage.getItem(
        "session_news_publish_at"
      );
      const finalPublishAt = sessionPublishAt
        ? Number(sessionPublishAt)
        : publish_at;

      this.setState({
        title: sessionTitle || title,
        slug: sessionSlug || slug,
        featured_image,
        media_type: sessionMediaType || media_type || "image",
        excerpt: sessionExcerpt || excerpt,
        html_content: sessionContent || html_content || "<p></p>",
        publish_at: finalPublishAt || moment().valueOf(),
        wasActive: active || false
      });
    }
  }

  customRequest = async onSuccess => {
    const { uploadImages } = this.props;

    this.uploadErrors.forEach(e => {
      if (!this.errorShownNames.includes(e.name)) {
        message.warning(e.message);
        this.errorShownNames.push(e.name);
      }
    });

    let finalFiles = [];
    this.filesToUpload.forEach(file => {
      if (!this.uploadedFileNames.includes(file.name)) {
        finalFiles.push(file);
        this.uploadedFileNames.push(file.name);
      }
    });

    for (let f = 0; f < finalFiles.length; f++) {
      await uploadImages({ variables: { image: finalFiles[f] } })
        .then(response => {
          const image = response.data.uploadImages;
          onSuccess("ok");
          this.draggerFileList.push(image.imgName);
        })
        .catch(error => {
          notification.error({
            message: "Error occured while uploading images for News & PR item.",
            description: error.message
              ? error.message
              : "Please contact system administrator."
          });
        });
    }

    this.setState({ draggerFileList: this.draggerFileList });
    // });
  };

  copyImgUrl = imgSRC => {
    let dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = imgSRC;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    message.success("Image URL copied to clipboard");
  };

  onChange = ({ target: { name, value } }) => {
    let objToSet = { [name]: value };
    sessionStorage.setItem(`session_news_${name}`, value);

    if (name === "title") {
      const slugValue = createSlug(value);
      objToSet = {
        ...objToSet,
        slug: slugValue
      };
      sessionStorage.setItem("session_news_slug", slugValue);
    }

    this.setState(objToSet);
  };

  onChangeDate = (name, e) => {
    const timestamp = moment(e).valueOf();
    sessionStorage.setItem(`session_news_${name}`, String(timestamp));
    this.setState({ [name]: timestamp });
  };

  onChangeSelect = value => {
    sessionStorage.setItem("session_news_media_type", value);
    this.setState({ media_type: value });
  };

  handleEditorChange = (content, editor) => {
    this.setState({ html_content: content });
    sessionStorage.setItem("session_news_html_content", content);
  };

  saveNews = async () => {
    const {
      upsertNews,
      page_history,
      crud,
      news_id,
      doesSlugExist
    } = this.props;
    const {
      title,
      slug,
      media_type,
      featured_image,
      excerpt,
      html_content,
      publish_at,
      wasActive
    } = this.state;

    let validationArray = [
      { fieldName: "title", fieldValue: title, checkNotEmpty: "Y" },
      { fieldName: "slug", fieldValue: slug, checkNotEmpty: "Y" },
      { fieldName: "publish_at", fieldValue: publish_at, checkNotEmpty: "Y" },
      { fieldName: "media_type", fieldValue: media_type, checkNotEmpty: "Y" },
      {
        fieldName: "featured_image",
        fieldValue: featured_image,
        checkNotEmpty: "Y"
      }
    ];

    let validationData = validateForm(validationArray);

    if (!validationData.formIsValid) {
      this.setState({ errors: validationData.errors });
      notification.error({
        message: "Incomplete Form!",
        description:
          "'Title', 'Slug', 'Featured Media' and 'Publish Date' are mandatory fields."
      });
      return;
    } else {
      let doesSlugExistData = false;
      await doesSlugExist({ variables: { type: "news", id: news_id, slug } })
        .then(res => {
          doesSlugExistData = res.data.doesSlugExist.slugExists;
        })
        .catch(error => {
          notification.error({
            message: "Error occured in 'doesSlugExist' mutation.",
            description: error.message
              ? error.message
              : "Please contact system administrator."
          });
        });

      if (doesSlugExistData) {
        this.setState({
          errors: { slug: "Slug already in use. Please enter a unique slug." }
        });
        notification.error({
          message: "Slug already in use",
          description: "Please enter a unique slug/URL for this post."
        });
        return;
      }

      this.setState({ disableSave: true });
      upsertNews({
        variables: {
          upsertType: crud,
          wasActive,
          newsData: {
            id: news_id,
            title,
            slug,
            media_type,
            featured_image,
            excerpt,
            html_content,
            publish_at: String(publish_at)
          }
        }
      })
        .then(data => {
          sessionStorage.clear();
          page_history.push("/misc/news-and-pr");
          notification.success({
            message: `News & PR Item Saved Successfully`
          });
        })
        .catch(error => {
          notification.error({
            message: "Error occured while saving News & PR item.",
            description: error.message
              ? error.message
              : "Please contact system administrator."
          });
        });
    }
  };

  render() {
    const { crud, page_history } = this.props;
    // prettier-ignore
    const { title, slug, featured_image, media_type, excerpt, html_content, publish_at, draggerFileList, errors,
            disableSave } = this.state;

    return (
      <div className=" gx-app-module gx-chat-module article-form-newHeight">
        <div className="gx-chat-module-box">
          <div className="gx-chat-sidenav gx-d-none gx-d-lg-flex">
            <div className="gx-chat-sidenav-content">
              <CustomScrollbars className="gx-chat-list-scroll">
                <div className="article-form-sidebox">
                  <div>
                    <label>
                      Title<span className="error-below-input"> *</span>
                    </label>
                    <Input
                      name="title"
                      value={title}
                      onChange={this.onChange}
                      placeholder={
                        crud === "create" ? "Enter title of the article" : ""
                      }
                      disabled={crud === "read"}
                    />
                    <span className="errorStyle">{errors.title || ""}</span>
                  </div>

                  <div>
                    <label>
                      Slug<span className="error-below-input"> *</span>
                    </label>
                    <Input
                      name="slug"
                      value={slug}
                      onChange={this.onChange}
                      disabled={crud === "read"}
                    />
                    <span className="errorStyle">{errors.slug || ""}</span>
                  </div>

                  <div>
                    <label>Excerpt</label>
                    <Input.TextArea
                      name="excerpt"
                      value={excerpt}
                      rows={5}
                      onChange={this.onChange}
                      disabled={crud === "read"}
                    />
                  </div>

                  <div>
                    <label>
                      Featured Media Type
                      <span className="error-below-input"> *</span>
                    </label>
                    <br />
                    <Select
                      name="media_type"
                      value={media_type}
                      onChange={this.onChangeSelect}
                      showSearch
                      style={{ width: "100%" }}
                      placeholder="Select one option"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option key="image" value="image">
                        Image
                      </Option>
                      <Option key="video" value="video">
                        Video
                      </Option>
                    </Select>
                    <span className="errorStyle">
                      {errors.media_type || ""}
                    </span>
                  </div>

                  <div>
                    <label>
                      Featured Media
                      <span className="error-below-input"> *</span>
                    </label>
                    <br />
                    <ImageUpload
                      fileType="media"
                      fileName={featured_image}
                      fileList={
                        featured_image
                          ? [
                              {
                                uid: featured_image,
                                url:
                                  process.env.REACT_APP_IMAGE_URL +
                                  process.env.REACT_APP_MISC_URL +
                                  featured_image
                              }
                            ]
                          : []
                      }
                      getFile={file => this.setState({ featured_image: file })}
                      onRemove={() => this.setState({ featured_image: null })}
                      crud={crud}
                    />
                    <span className="errorStyle">
                      {errors.featured_image || ""}
                    </span>
                  </div>

                  <div id="publishDate">
                    <label>Publish Date*</label>
                    <DatePicker
                      showTime
                      value={publish_at ? moment(Number(publish_at)) : null}
                      format="Do MMM YYYY h:mm A"
                      placeholder="Select Date & Time"
                      onChange={e => this.onChangeDate("publish_at", e)}
                    />
                    <br />
                    <span className="errorStyle">
                      {errors.publish_at || ""}
                    </span>
                  </div>

                  <div>
                    <div>
                      <Dragger
                        name="file"
                        multiple={true}
                        beforeUpload={(file, fileList) => {
                          this.filesToUpload = [];
                          this.uploadErrors = [];

                          fileList.forEach(e => {
                            if (
                              !(
                                e.type === "image/jpeg" ||
                                e.type === "image/png" ||
                                e.type === "image/gif"
                              )
                            )
                              this.uploadErrors.push({
                                message:
                                  "Only images (.jpg, .png, .gif) can be uploaded.",
                                name: e.name
                              });
                            else if (e.size / 1024 / 1024 > 5)
                              this.uploadErrors.push({
                                message:
                                  "Images greater than 5 MB cannot be uploaded.",
                                name: e.name
                              });
                            else this.filesToUpload.push(e);
                          });
                        }}
                        customRequest={({ onSuccess }) =>
                          this.customRequest(onSuccess)
                        }
                        showUploadList={false}
                      >
                        <Icon type="inbox" />
                        <br />
                        Click or drag file to this area to upload
                      </Dragger>

                      <div>
                        {draggerFileList && draggerFileList.length ? (
                          <div>
                            {draggerFileList.map((image, i) => {
                              const imgSRC =
                                process.env.REACT_APP_IMAGE_URL +
                                process.env.REACT_APP_MISC_URL +
                                image;

                              let splitString = image.split(".");
                              splitString.length -= 1;
                              const imgName = splitString.join();

                              return (
                                <Row key={i}>
                                  <Col span={10}>
                                    <img
                                      height={40}
                                      src={imgSRC}
                                      alt="No Image"
                                      onClick={() => this.copyImgUrl(imgSRC)}
                                    />
                                  </Col>
                                  <Col span={10} className="wrapAndCenter">
                                    {imgName.substring(0, imgName.length - 5)}
                                  </Col>
                                  <Col span={4}>
                                    <br />
                                    <Icon
                                      type="copy"
                                      onClick={() => this.copyImgUrl(imgSRC)}
                                    />
                                  </Col>
                                </Row>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <br />

                  <div key="finalSave">
                    <Button
                      disabled={disableSave}
                      type="primary"
                      onClick={this.saveNews}
                    >
                      Save News
                    </Button>
                    &nbsp;
                    <Button
                      onClick={() => page_history.push("/misc/news-and-pr")}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </CustomScrollbars>
            </div>
          </div>

          <div className="gx-chat-box">
            <div className="gx-chat-main">
              <div className="tinymceEditor">
                <Editor
                  value={html_content}
                  init={{
                    height: 550,
                    max_height: 550,
                    menubar: "insert",
                    image_caption: false,
                    plugins: [
                      "advlist autolink lists link image media charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                      "autoresize hr"
                    ],
                    toolbar:
                      "formatselect | fontselect fontsizeselect | bold italic underline hr forecolor backcolor | \
                       image media | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | \
                       undo redo | removeformat | help",
                    icons: "material",
                    autoresize_overflow_padding: 2
                  }}
                  onEditorChange={this.handleEditorChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewsItemForm;
