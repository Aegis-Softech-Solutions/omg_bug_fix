import React, { Component } from "react";
import { Card, Row, Col, Input, Select } from "antd";
import Lightbox from "react-images-extended";

const { Meta } = Card;
const { Option } = Select;

class ImageEvaluation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLighBoxOpen: false,
      currentImage: 0,
      images: [],
      statusValues: [],
      scoreValues: []
    };
  }

  gotoNext = () => {
    const { currentImage, images } = this.state;
    this.setState({
      currentImage: currentImage === images.length - 1 ? 0 : currentImage + 1
    });
  };

  gotoPrevious = () => {
    const { currentImage, images } = this.state;
    this.setState({
      currentImage: currentImage === 0 ? images.length - 1 : currentImage - 1
    });
  };

  gotoImage = index => this.setState({ currentImage: index });

  componentDidMount() {
    const { images } = this.props;
    if (images && images.length) {
      let stateObj = {};
      images.forEach(obj => {
        stateObj = {
          ...stateObj,
          [obj.statusVariable]: obj.status,
          [obj.scoreVariable]: obj.score
        };
      });
      this.setState({ images, ...stateObj });
    }
  }

  render() {
    const { isLighBoxOpen, currentImage, images } = this.state;
    const { getImageData } = this.props;
    // console.log(" IMAGE STATE --> ", this.state);

    return (
      <div>
        {images && images.length ? (
          <Row>
            {images.map((obj, i) => (
              <Col key={i} span={8}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt="example"
                      src={obj.src}
                      onClick={() =>
                        this.setState({
                          isLighBoxOpen: true,
                          currentImage: i
                        })
                      }
                    />
                  }
                >
                  {/* <Meta
                    title={
                      <div>
                        <Row>
                          <Col span={8} style={{ paddingTop: "2px" }}>
                            Status:
                          </Col>
                          <Col span={16}>
                            <Select
                              name={obj.statusVariable}
                              size="small"
                              value={this.state[obj.statusVariable]}
                              onChange={value => {
                                this.setState({ [obj.statusVariable]: value });
                                getImageData({ [obj.statusVariable]: value });
                              }}
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
                              <Option key="pending" value="pending">
                                Pending
                              </Option>
                              <Option key="approved" value="approved">
                                Approved
                              </Option>
                              <Option key="rejected" value="rejected">
                                Rejected
                              </Option>
                            </Select>
                          </Col>
                        </Row>
                        <Row style={{ paddingTop: "8px" }}>
                          <Col span={8} style={{ paddingTop: "2px" }}>
                            Score:
                          </Col>
                          <Col span={16}>
                            <Input
                              type="number"
                              size="small"
                              value={this.state[obj.scoreVariable]}
                              onChange={({ target: { value } }) => {
                                this.setState({
                                  [obj.scoreVariable]: Number(value)
                                });
                                getImageData({
                                  [obj.scoreVariable]: Number(value)
                                });
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    }
                  /> */}
                </Card>

                <Lightbox
                  currentImage={currentImage}
                  images={images}
                  isOpen={isLighBoxOpen}
                  onClickPrev={this.gotoPrevious}
                  onClickNext={this.gotoNext}
                  onClickThumbnail={this.gotoImage}
                  onClose={() => this.setState({ isLighBoxOpen: false })}
                  rotatable={true}
                  zoomable={true}
                  showThumbnails={true}
                  showCloseButton={true}
                  closeButtonTitle="X"
                  //   onSave={(currentImageIndex, params) =>
                  //     console.log(
                  //       'currentImageIndex, currentImageSrc, params : ',
                  //       currentImageIndex,
                  //       this.props.images[currentImageIndex].src,
                  //       params
                  //     )}
                />
              </Col>
            ))}
          </Row>
        ) : null}
      </div>
    );
  }
}

export default ImageEvaluation;
