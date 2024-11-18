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
import { AnswerKeyForm, Test, TestItem } from "./AnswerKeyForm";

const sampleData: { tests: Test[] } = {
  tests: [
    {
      test_number: 1,
      test_type: "Multiple Choice",
      total_points: 30,
      correct_points: null,
      full_text:
        "1. A 6.b 11. 9 2. B 7.C 12. d 3. c 8.2 13. b 4. I 9.C 14. c 5. A 10. a 15. 9",
      question_answer_pairs: [
        { question_number: 1, answer: "A" },
        { question_number: 2, answer: "B" },
        { question_number: 3, answer: "C" },
        { question_number: 4, answer: "I" },
        { question_number: 5, answer: "A" },
        { question_number: 6, answer: "B" },
        { question_number: 7, answer: "C" },
        { question_number: 8, answer: "2" },
        { question_number: 9, answer: "C" },
        { question_number: 10, answer: "A" },
        { question_number: 11, answer: "9" },
        { question_number: 12, answer: "D" },
        { question_number: 13, answer: "B" },
        { question_number: 14, answer: "C" },
        { question_number: 15, answer: "9" },
      ],
    },
    {
      test_number: 2,
      test_type: "true or False",
      total_points: 10,
      correct_points: null,
      full_text:
        "1. true 6. F 2. False 7. U f 3. TRUE 8. f 4. FALSE 9. 5. T 10. t",
      question_answer_pairs: [
        { question_number: 1, answer: "TRUE" },
        { question_number: 2, answer: "FALSE" },
        { question_number: 3, answer: "TRUE" },
        { question_number: 4, answer: "FALSE" },
        { question_number: 6, answer: "F" },
        { question_number: 7, answer: "UF" },
        { question_number: 8, answer: "F" },
        { question_number: 9, answer: "5.T" },
        { question_number: 10, answer: "T" },
      ],
    },
    {
      test_number: 3,
      test_type: "Matching Type",
      total_points: 10,
      correct_points: null,
      full_text: "1. A 6.C 2. E 7.B 3. F 8.U 4. H 9.G 5. D 10. I",
      question_answer_pairs: [
        { question_number: 1, answer: "A" },
        { question_number: 2, answer: "E" },
        { question_number: 3, answer: "F" },
        { question_number: 4, answer: "H" },
        { question_number: 5, answer: "D" },
        { question_number: 6, answer: "C" },
        { question_number: 7, answer: "B" },
        { question_number: 8, answer: "U" },
        { question_number: 9, answer: "G" },
        { question_number: 10, answer: "I" },
      ],
    },
  ],
};

type FileMap = {
  [key: string]: string[];
};
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
  const [isConfirmAKOpen, setIsConfirmAKOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [fileListAK, setfileListAK] = useState<UploadFile[]>([]);
  const [fileLinksAK, setfileLinksAK] = useState<FileMap>({});
  const [fileListTP, setfileListTP] = useState<UploadFile[]>([]);
  const [fileLinksTP, setfileLinksTP] = useState<FileMap>({});
  const [answerKeys, setAnswerKeys] = useState<Test[]>([]);

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

  const handleGithubRepo = () => {
    // Download the "Short" file
    window.open(
      "https://github.com/stiffmeister923/C.H.E.C.K/tree/master",
      "_blank"
    );
  };

  const handleFBLink = () => {
    // Download the "Short" file
    window.open("https://www.facebook.com/dideysosa.morales/", "_blank");
  };

  const handleChange: UploadProps["onChange"] = ({
    fileList: newfileListAK,
  }) => {
    console.log(fileListAK);
    setfileListAK(newfileListAK);
  };

  const handleChangeTP: UploadProps["onChange"] = ({
    fileList: newfileListTP,
  }) => {
    console.log(fileListTP);
    setfileListTP(newfileListTP);
  };
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

  const onSubmit = (values: { [key: string]: string }): void => {
    const updatedTests: Test[] = answerKeys.map((test) => {
      return {
        ...test,
        question_answer_pairs: test.question_answer_pairs.map((testItem) => {
          return {
            ...testItem,
            answer: values[`${test.test_number}-${testItem.question_number}`],
          };
        }),
      };
    });
    console.log(updatedTests);
    setAnswerKeys(updatedTests);
    setIsConfirmAKOpen(false);
  };

  const onParse = () => {
    // Call backend to parse answer key
    setAnswerKeys(sampleData.tests);
    setIsUploadAnswerKeyOpen(false);
    setIsConfirmAKOpen(true);
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
              <Button type="link" size={"large"} onClick={handleDownloadShort}>
                Download Short
              </Button>
              <Button type="link" size={"large"} onClick={handleDownloadLong}>
                Download Long
              </Button>
            </>
          }
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
          title="Upload Your Answer Key"
          open={isUploadAnswerKeyOpen}
          onOk={handleUploadAnswerKeyOk}
          onCancel={handleUploadAnswerKeyCancel}
          closable={true}
          footer={[
            <Button
              disabled={fileListAK.length < 1 || fileListAK.length > 1}
              key="back"
              onClick={onParse}
            >
              Parse Answers
            </Button>,
          ]}
        >
          <p>Only one answer key may be uploaded at a time</p>
          <p>
            Only our supported formats with 6 landmarks can be uploaded at the
            moment
          </p>
          <Upload
            beforeUpload={handleBeforeUpload}
            name="images"
            customRequest={async ({ file: fileItem, onSuccess }) => {
              console.log(fileItem, fileListAK);
              const formData = new FormData();
              const uid = (fileItem as UploadFile).uid;
              formData.append("images", fileItem);
              formData.append("uid", uid);
              const response = await fetch(
                "https://a894-122-2-102-220.ngrok-free.app/process_images",
                {
                  method: "POST",
                  body: formData,
                }
              );
              const data = await response.json();
              const updatedfileLinksAK = { ...fileLinksAK };
              updatedfileLinksAK[(fileItem as UploadFile).uid] = data[0];
              setfileLinksAK(updatedfileLinksAK);
              console.log(data[0]);
              onSuccess!("ok");
            }}
            listType="picture-card"
            fileList={fileListAK}
            onPreview={handlePreview}
            onChange={handleChange}
            onRemove={async (file) => {
              const body = fileLinksAK[file.uid];
              console.log(body);

              const response = await fetch(
                "http://127.0.0.1:8000/delete-images",
                {
                  method: "POST",
                  body: JSON.stringify(body),
                  headers: { "Content-Type": "application/json" },
                }
              );
              const data = await response.json();
              console.log(data[0]);
              return true;
            }}
            //disabled={fileListAK?.some((fileItem) => fileItem.status === "done")}
          >
            {fileListAK.length >= 8 ? null : uploadButton}
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
          closable={true}
          footer={[
            <Button disabled={fileListTP.length < 1} key="back">
              Parse Tests
            </Button>,
          ]}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <Upload
            beforeUpload={handleBeforeUpload}
            name="images"
            multiple={true}
            customRequest={async ({ file: fileItem, onSuccess }) => {
              console.log(fileItem, fileListTP);
              const formData = new FormData();
              formData.append("images", fileItem);
              const response = await fetch(
                "http://127.0.0.1:8000/process_images",
                {
                  method: "POST",
                  body: formData,
                }
              );
              const data = await response.json();

              // Update fileLinksTP to store the unique link for each uploaded file
              setfileLinksTP((prevFileLinks) => ({
                ...prevFileLinks,
                [(fileItem as UploadFile).uid]: data[0], // Store the full data object for each file UID
              }));

              console.log(data);
              onSuccess!("ok");
            }}
            listType="picture-card"
            fileList={fileListTP}
            onPreview={handlePreview}
            onChange={handleChangeTP}
            onRemove={async (file) => {
              // Retrieve the specific data related to the file to be deleted
              const body = fileLinksTP[file.uid];
              if (!body) {
                console.error("No data found for this file UID:", file.uid);
                return false;
              }

              console.log(body);

              const response = await fetch(
                "http://127.0.0.1:8000/delete-images",
                {
                  method: "POST",
                  body: JSON.stringify(body),
                  headers: { "Content-Type": "application/json" },
                }
              );

              const data = await response.json();
              console.log(data);

              // Optionally, clean up fileLinksTP by removing the deleted file’s entry
              setfileLinksTP((prevFileLinks) => {
                const updatedLinks = { ...prevFileLinks };
                delete updatedLinks[file.uid];
                return updatedLinks;
              });

              return true; // Return true to proceed with Ant Design's removal behavior
            }}
          >
            {fileListTP.length >= 35 ? null : uploadButton}
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
          title="Grade Up The Tests"
          open={isGradeOpen}
          onOk={handleGradeOk}
          onCancel={handleGradeCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
        <Modal
          style={{}}
          title="Confirm Answer Key"
          open={isConfirmAKOpen}
          footer=""
          //onOk={handleGradeOk}
          //onCancel={handleGradeCancel}
        >
          <AnswerKeyForm tests={answerKeys} onSubmit={onSubmit} />
        </Modal>
      </Flex>
    </Layout>
  );
};

export default App;
