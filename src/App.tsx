import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
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
  const [isUploadAnswerKeyOpen, setIsUploadAnswerKeyOpen] = useState(false);
  const [isUploadTestPaperOpen, setIsUploadTestPaperOpen] = useState(false);
  const [isGradeOpen, setIsGradeOpen] = useState(false);
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
        <FloatButton type="primary" shape="circle" onClick={onManualBtnClick}>
          A
        </FloatButton>
        <Modal
          style={{}}
          title="User Manual"
          open={isManualModalOpen}
          onOk={handleManualOk}
          onCancel={handleManualCancel}
        >
          <p>{isManualModalOpen ? "T" : "F"}</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
        <Modal
          style={{}}
          title="Upload Your Answer Key"
          open={isUploadAnswerKeyOpen}
          onOk={handleUploadAnswerKeyOk}
          onCancel={handleUploadAnswerKeyCancel}
        >
          <Upload
            //action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            multiple={true}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
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
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default App;
