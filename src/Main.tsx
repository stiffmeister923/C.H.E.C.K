import React, { useState } from "react";

import { Layout, Menu, theme, Typography, Row, Col } from "antd";
import { TestChecker } from "./TestCheckerSteps";
import type { FileData } from "./types";
import { UploadFile, UploadProps } from "antd/lib/upload";
import "./index.css";

const { Title } = Typography;

const { Header, Content } = Layout;

const items = new Array(1).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `C.H.E.C.K `,
}));

const Main: React.FC = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

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
          <Title style={{ color: "#ccc", padding: "30px 0px 0px 0px" }}>
            C.H.E.C.K: Comprehensive Handwritten Exam Checking Kit
          </Title>
          <Title style={{ color: "#ccc" }} level={3}>
            C.H.E.C.K is designed for educators and students alike. A complete
            kit to help facilitate your checking process through our formatted
            papers and optical character recognition (OCR) pipeline will ensure
            time efficiency, accuracy, and seamless evaluation. With C.H.E.C.K,
            a picture is all you need.
          </Title>
        </Col>
        <Col>
          <Content
            style={{
              padding: "24px 24px",
              // width: "calc(100vw - 400px)",
              height: "calc(100vh - 350px)",
              // background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <TestChecker />
          </Content>
        </Col>
      </Row>
    </Layout>
  );
};

export default Main;
