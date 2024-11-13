import React, { useState } from "react";
import {
  PlusOutlined,
  DownloadOutlined,
  GithubOutlined,
  FacebookOutlined,
  CustomerServiceOutlined,
  CommentOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import {
  Layout,
  Menu,
  theme,
  Button,
  ConfigProvider,
  Flex,
  FloatButton,
  Modal,
  Image,
  Upload,
} from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { RcFile } from "antd/lib/upload";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const { Header, Content, Footer } = Layout;

const items = new Array(1).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `C.H.E.C.K `,
}));

const App: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isFormattedModalOpen, setIsFormatedModalOpen] = useState(false);
  const [isUploadAnswerKeyOpen, setIsUploadAnswerKeyOpen] = useState(false);
  const [isUploadTestPaperOpen, setIsUploadTestPaperOpen] = useState(false);
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);
  const onManualBtnClick = () => {
    setIsManualModalOpen(true);
  };

  const handleManualOk = () => {
    setIsManualModalOpen(false);
  };
  const handleManualCancel = () => {
    setIsManualModalOpen(false);
  };

  const onFormattedBtnClick = () => {
    setIsFormatedModalOpen(true);
  };

  const handleFormattedOk = () => {
    setIsFormatedModalOpen(false);
  };
  const handleFormattedCancel = () => {
    setIsFormatedModalOpen(false);
  };

  const onUploadAnswerKeyBtnClick = () => {
    setIsUploadAnswerKeyOpen(true);
  };

  const handleUploadAnswerKeyOk = () => {
    setIsUploadAnswerKeyOpen(false);
  };
  const handleUploadAnswerKeyCancel = () => {
    setIsUploadAnswerKeyOpen(false);
  };

  const onUploadTestPaperBtnClick = () => {
    setIsUploadTestPaperOpen(true);
  };

  const handleUploadTestPaperOk = () => {
    setIsUploadTestPaperOpen(false);
  };
  const handleUploadTestPaperCancel = () => {
    setIsUploadTestPaperOpen(false);
  };

  const onGradeBtnClick = () => {
    setIsGradeOpen(true);
  };

  const handleGradeOk = () => {
    setIsGradeOpen(false);
  };
  const handleGradeCancel = () => {
    setIsGradeOpen(false);
  };
  const handleBeforeUpload = (file: RcFile): boolean => {
    const maxSizeMB = 5; // Set the maximum size in MB
    if (file.size / 1024 / 1024 > maxSizeMB) {
      alert(`File is too large! Maximum size is ${maxSizeMB} MB.`);
      return false;
    }
    return true;
  };
  return (
    <Layout style={{ height: "100vh", background: "#343434" }}>
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
      <Content style={{ padding: "48px 48px" }}>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Flex gap="middle" wrap>
            <Button
              color="default"
              variant="solid"
              onClick={onUploadAnswerKeyBtnClick}
            >
              Upload Answer Key
            </Button>
            <Button
              color="default"
              variant="solid"
              onClick={onUploadTestPaperBtnClick}
            >
              Upload Test Papers
            </Button>
            <Button color="default" variant="solid" onClick={onGradeBtnClick}>
              Grade
            </Button>
          </Flex>
        </div>
      </Content>
      <Flex wrap gap="small">
        <FloatButton.Group shape="circle" style={{}}>
          <FloatButton
            type="primary"
            shape="circle"
            onClick={onManualBtnClick}
            icon={<QuestionCircleOutlined />}
          />
          <FloatButton
            shape="circle"
            onClick={onFormattedBtnClick}
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
              />
              <Button
                type="primary"
                shape="circle"
                icon={<FacebookOutlined />}
                size={"large"}
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
          title="View the Supported Formatted Papers Here"
          open={isFormattedModalOpen}
          closable={true}
          onOk={handleFormattedOk}
          onCancel={handleFormattedCancel}
          footer={""}
        >
          <Image.PreviewGroup
            preview={{
              onChange: (current, prev) =>
                console.log(`current index: ${current}, prev index: ${prev}`),
            }}
          >
            <Image
              width={200}
              height={300}
              src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539481/not_folder_short4_t6ykm3.jpg"
            />
            <Image
              width={200}
              height={300}
              src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539479/not_folder_short3_qoybf4.jpg"
            />
            <Image
              width={200}
              height={300}
              src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539479/not_folder_short2_zmfdhc.jpg"
            />
            <Image
              width={200}
              height={300}
              src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539477/not_folder_short1_dzb3aa.jpg"
            />
            <Image
              width={200}
              height={300}
              src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539476/not_folder_long4_d3xfi2.jpg"
            />
            <Image
              width={200}
              height={300}
              src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539476/not_folder_long3_zdrbnc.jpg"
            />
            <Image
              width={200}
              height={300}
              src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539475/not_folder_long1_cestmr.jpg"
            />
            <Image
              width={200}
              height={300}
              src="https://res.cloudinary.com/djdjamrmj/image/upload/v1731539475/not_folder_long2_d7z8ci.jpg"
            />
          </Image.PreviewGroup>
        </Modal>
        <Modal
          style={{}}
          title="Upload Your Test Papers Here"
          open={isUploadTestPaperOpen}
          onOk={handleUploadTestPaperOk}
          onCancel={handleUploadTestPaperCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
        <Modal
          style={{}}
          title="Grade Up The Tests"
          open={isGradeOpen}
          onOk={handleGradeOk}
          onCancel={handleGradeCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </Flex>
    </Layout>
  );
};

export default App;
