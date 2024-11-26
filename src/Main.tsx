import React, { useState } from "react";

import {
  Layout,
  Menu,
  theme,
  Typography,
  Row,
  Col,
  FloatButton,
  Modal,
  Button,
  Image,
  Space,
  QRCode,
} from "antd";
import { TestChecker } from "./TestCheckerSteps";

import {
  GithubOutlined,
  FacebookOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import {
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import "./index.css";

const { Title } = Typography;

const { Header, Content } = Layout;

const imageList = [
  "https://res.cloudinary.com/djdjamrmj/image/upload/v1732560489/JANE_DOE_iq6t7g.jpg",
  "https://res.cloudinary.com/djdjamrmj/image/upload/v1732560488/BRODOE_nv5ybu.jpg",
  "https://res.cloudinary.com/djdjamrmj/image/upload/v1732560488/JOHNDOE_iqkfsz.jpg",
];
const items = new Array(1).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `C.H.E.C.K `,
}));

const Main: React.FC = () => {
  const [current, setCurrent] = React.useState(0);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isFormattedModalOpen, setIsFormatedModalOpen] = useState(false);

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const onManualBtnClick = () => {
    setIsManualModalOpen(true);
  };
  const onFormattedBtnClick = () => {
    setIsFormatedModalOpen(true);
  };

  const handleManualOk = () => {
    setIsManualModalOpen(false);
  };
  const handleManualCancel = () => {
    setIsManualModalOpen(false);
  };
  const handleFormattedOk = () => {
    setIsFormatedModalOpen(false);
  };
  const handleFormattedCancel = () => {
    setIsFormatedModalOpen(false);
  };

  const handleGithubRepo = () => {
    window.open(
      "https://github.com/stiffmeister923/C.H.E.C.K/tree/master",
      "_blank"
    );
  };

  const handleFBLink = () => {
    window.open("https://www.facebook.com/dideysosa.morales/", "_blank");
  };

  const handleDownloadShort = () => {
    // Download the "Short" file
    window.open(
      "https://drive.google.com/file/d/1OmPtfnrIQ-ZcGKiybzlFuPyR_7VhNoa3/view?usp=drive_link",
      "_blank"
    );
  };

  const handleDownloadLong = () => {
    // Download the "Long" file
    window.open(
      "https://drive.google.com/file/d/1cvGzbczhuqQ6TBNxc3tfGQPQKz3oSHPy/view?usp=drive_link",
      "_blank"
    );
  };

  const onDownload = () => {
    const url = imageList[current];
    const suffix = url.slice(url.lastIndexOf("."));
    const filename = Date.now() + suffix;

    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(blobUrl);
        link.remove();
      });
  };
  return (
    <Layout
      style={{
        height: "100vh",
        background: "transparent",
        //     background: `repeating-linear-gradient(
        //   90deg,
        //   hsla(196, 0%, 20%, 0.15) 0px,
        //   hsla(196, 0%, 20%, 0.15) 1px,
        //   transparent 1px,
        //   transparent 96px
        // ),
        // repeating-linear-gradient(
        //   0deg,
        //   hsla(196, 0%, 20%, 0.15) 0px,
        //   hsla(196, 0%, 20%, 0.15) 1px,
        //   transparent 1px,
        //   transparent 96px
        // ),
        // repeating-linear-gradient(
        //   0deg,
        //   hsla(196, 0%, 20%, 0.25) 0px,
        //   hsla(196, 0%, 20%, 0.25) 1px,
        //   transparent 1px,
        //   transparent 12px
        // ),
        // repeating-linear-gradient(
        //   90deg,
        //   hsla(196, 0%, 20%, 0.25) 0px,
        //   hsla(196, 0%, 20%, 0.25) 1px,
        //   transparent 1px,
        //   transparent 12px
        // ),
        // linear-gradient(90deg, rgb(24, 25, 26), rgb(24, 25, 26))`,
      }}
    >
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Row
        justify="center"
        align="middle"
        style={{ height: "auto", textAlign: "center" }}
      >
        <Col>
          <Title style={{ color: "#e7eee0", padding: "30px 30px 0px 30px" }}>
            C.H.E.C.K: Comprehensive Handwritten Exam Checking Kit
          </Title>
          <Content
            style={{
              padding: "20px 20px",
              //width: "calc(100vw - 400px)",
              height: "calc(100vh - 350px)",
              // background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <TestChecker />
          </Content>
        </Col>
      </Row>
      <FloatButton.Group shape="circle" style={{}}>
        <FloatButton
          className="user-manual"
          type="primary"
          shape="circle"
          onClick={onManualBtnClick}
          icon={<QuestionCircleOutlined />}
          style={{ height: "7.5vh", width: "7.5vh", fontSize: "3vh" }}
        />
        <FloatButton
          className="formatted-papers"
          shape="circle"
          onClick={onFormattedBtnClick}
          style={{ height: "7.5vh", width: "7.5vh", fontSize: "3vh" }}
        ></FloatButton>
      </FloatButton.Group>
      <Modal
        style={{}}
        title="User Manual"
        open={isManualModalOpen}
        onOk={handleManualOk}
        onCancel={handleManualCancel}
        closable={true}
        footer={
          <>
            <Button
              color="primary"
              type="primary"
              shape="circle"
              icon={<GithubOutlined />}
              size={"large"}
              onClick={handleGithubRepo}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<FacebookOutlined />}
              size={"large"}
              onClick={handleFBLink}
            />
          </>
        }
      >
        <p>
          1. To test the system properly, you first need to download the answer
          key and test paper samples...
        </p>
        <p>
          2. Each of the test paper can serve as an answer key for the others
          for as long as they are of the same formatted paper
        </p>
        <p>3. You can now start by uploading one of the test image</p>
        <p>
          4. Take note that the models used for the OCR pipeline is not
          completely accurate. It may completely miss some words or characters
          and fail to recognize or misinterpret handwriting for other
          characters.
        </p>
        <p>
          5. Give us your input here if you are a professor in DLSU-D or scan
          the QR code provided below
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16,
            padding: 12,
          }}
        >
          <QRCode
            errorLevel="H"
            value="https://forms.gle/5LmpjSqSkBcKNsHQ7"
            icon="https://res.cloudinary.com/djdjamrmj/image/upload/v1732569030/C.H.E.C.K_gsc9yf.svg"
          />
        </div>
        <Image.PreviewGroup
          preview={{
            toolbarRender: (
              _,
              {
                transform: { scale },
                actions: {
                  onActive,
                  onFlipY,
                  onFlipX,
                  onRotateLeft,
                  onRotateRight,
                  onZoomOut,
                  onZoomIn,
                  onReset,
                },
              }
            ) => (
              <Space size={12} className="toolbar-wrapper">
                <LeftOutlined
                  onClick={() => onActive?.(-1)}
                  style={{ fontSize: "20px" }}
                />
                <RightOutlined
                  onClick={() => onActive?.(1)}
                  style={{ fontSize: "20px" }}
                />
                <DownloadOutlined
                  onClick={onDownload}
                  style={{ fontSize: "20px" }}
                />
                <SwapOutlined
                  rotate={90}
                  onClick={onFlipY}
                  style={{ fontSize: "20px" }}
                />
                <SwapOutlined onClick={onFlipX} style={{ fontSize: "20px" }} />
                <RotateLeftOutlined
                  onClick={onRotateLeft}
                  style={{ fontSize: "20px" }}
                />
                <RotateRightOutlined
                  onClick={onRotateRight}
                  style={{ fontSize: "20px" }}
                />
                <ZoomOutOutlined
                  disabled={scale === 1}
                  onClick={onZoomOut}
                  style={{ fontSize: "20px" }}
                />
                <ZoomInOutlined
                  disabled={scale === 50}
                  onClick={onZoomIn}
                  style={{ fontSize: "20px" }}
                />
                <UndoOutlined onClick={onReset} style={{ fontSize: "20px" }} />
              </Space>
            ),
            onChange: (index) => {
              setCurrent(index);
            },
          }}
        >
          <Row gutter={[16, 16]} justify="center">
            {imageList.map((src, index) => (
              <Col span={6} key={index}>
                <Image
                  width="100%"
                  height="auto"
                  src={src}
                  style={{ padding: "0px 0px 10px 0px" }}
                />
              </Col>
            ))}
          </Row>
        </Image.PreviewGroup>
      </Modal>
      <Modal
        style={{}}
        title={
          <>
            <p>View the supported formats here</p>
          </>
        }
        open={isFormattedModalOpen}
        closable={true}
        onOk={handleFormattedOk}
        onCancel={handleFormattedCancel}
        footer={
          <>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size={"large"}
              onClick={handleDownloadShort}
            >
              Short
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size={"large"}
              onClick={handleDownloadLong}
            >
              Long
            </Button>
          </>
        }
      >
        <Image.PreviewGroup
          preview={{
            onChange: (current, prev) =>
              console.log(`current index: ${current}, prev index: ${prev}`),
          }}
        >
          <Row gutter={[16, 16]} justify="center">
            <Col span={6}>
              <Image
                width="100%"
                height="auto"
                src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539481/not_folder_short4_t6ykm3.jpg"
              />
            </Col>
            <Col span={6}>
              <Image
                width="100%"
                height="auto"
                src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539479/not_folder_short3_qoybf4.jpg"
              />
            </Col>
            <Col span={6}>
              <Image
                width="100%"
                height="auto"
                src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539479/not_folder_short2_zmfdhc.jpg"
              />
            </Col>
            <Col span={6}>
              <Image
                width="100%"
                height="auto"
                src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539477/not_folder_short1_dzb3aa.jpg"
              />
            </Col>
            <Col span={6}>
              <Image
                width="100%"
                height="auto"
                src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539476/not_folder_long4_d3xfi2.jpg"
              />
            </Col>
            <Col span={6}>
              <Image
                width="100%"
                height="auto"
                src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539476/not_folder_long3_zdrbnc.jpg"
              />
            </Col>
            <Col span={6}>
              <Image
                width="100%"
                height="auto"
                src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539475/not_folder_long1_cestmr.jpg"
              />
            </Col>
            <Col span={6}>
              <Image
                width="100%"
                height="auto"
                src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539475/not_folder_long2_d7z8ci.jpg"
              />
            </Col>
          </Row>
        </Image.PreviewGroup>
      </Modal>
    </Layout>
  );
};

export default Main;
