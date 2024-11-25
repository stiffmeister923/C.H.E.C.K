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
} from "antd";
import { TestChecker } from "./TestCheckerSteps";

import {
  GithubOutlined,
  FacebookOutlined,
  QuestionCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import "./index.css";

const { Title } = Typography;

const { Header, Content } = Layout;

const items = new Array(1).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `C.H.E.C.K `,
}));

const Main: React.FC = () => {
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
          <Title style={{ color: "#ccc", padding: "30px 30px 0px 30px" }}>
            C.H.E.C.K: Comprehensive Handwritten Exam Checking Kit
          </Title>
          <Content
            style={{
              padding: "24px 24px",
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
          type="primary"
          shape="circle"
          onClick={onManualBtnClick}
          icon={<QuestionCircleOutlined />}
          style={{ height: "7.5vh", width: "7.5vh", fontSize: "3vh" }}
        />
        <FloatButton
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
        <p>{isManualModalOpen ? "T" : "F"}</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
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
