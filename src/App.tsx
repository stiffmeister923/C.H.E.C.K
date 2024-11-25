import React, { useState, useEffect } from "react";
import {
  PlusOutlined,
  GithubOutlined,
  FacebookOutlined,
  QuestionCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import {
  Layout,
  Menu,
  theme,
  Button,
  Flex,
  FloatButton,
  Modal,
  Image,
  Upload,
  Typography,
  Row,
  Col,
  Splitter,
} from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { RcFile } from "antd/lib/upload";
import {
  AnswerKeyForm,
  AnswerKeyTest,
  Test,
  TestInfo,
  GradeTest,
} from "./AnswerKeyForm";

const { Title } = Typography;

// Represents the details of a single image
type ImageDetails = {
  original_image: string;
  name_section_url: string;
  answer_section_url: string;
  error: string | null;
};

// Represents the data for each upload (a single file upload)
type FileData = {
  status: string;
  data: {
    [imageName: string]: ImageDetails;
  };
  uid: string;
};

// Represents the entire structure of fileLinksTP
type FileMap = {
  [uploadKey: string]: FileData;
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
  const [fileListAK, setfileListAK] = useState<UploadFile[]>([]);
  const [fileLinksAK, setfileLinksAK] = useState<FileMap>({});
  const [fileListTP, setfileListTP] = useState<UploadFile[]>([]);
  const [fileLinksTP, setfileLinksTP] = useState<FileMap>({});
  const [formattedFileLinks, setFormattedFileLinks] = useState<FileData[]>([]);
  const [answerKeys, setAnswerKeys] = useState<Test[]>([]);
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [parsedAnswerKeys, setParsedAnswerKeys] = useState<TestInfo>();
  const [parsedTestPapers, setParsedTestPapers] = useState<AnswerKeyTest>();
  const [updatedTestPapers, setUpdatedTestPapers] = useState<GradeTest>();
  const [imageList, setImageList] = useState([]);
  useEffect(() => {
    console.log(formattedFileLinks);
  }, [formattedFileLinks]);

  const enterLoading = (index: number, isLoading: boolean = true) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = isLoading;
      return newLoadings;
    });
  };
  const exportGrades = () => {
    const data = updatedTestPapers;
    setTimeout(() => {
      // API call here
      const fetchData = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/export_grades", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            // Process the file as a blob
            const blob = await response.blob();

            // Create a temporary link element
            const downloadLink = document.createElement("a");

            // Create a URL for the blob and set it as the href
            const url = window.URL.createObjectURL(blob);
            downloadLink.href = url;

            // Set the desired file name
            downloadLink.download = "grades.xlsx";

            // Trigger the download by programmatically clicking the link
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Release the blob URL
            window.URL.revokeObjectURL(url);
          } else {
            console.error("API Error:", response.status);
          }
        } catch (error) {
          console.error("Error during API call:", error);
        }
      };

      fetchData();
    }, 0);
  };
  const loadPictures = () => {
    const data = updatedTestPapers;
    setTimeout(() => {
      // API call here
      const fetchData = async () => {
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/get_annotated_image_base_64",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (response.ok) {
            const { images } = await response.json();
            if (images && images.length > 0) {
              // Assuming `setImageList` is a React state setter to store image data
              setImageList(images);
            } // Save the images for rendering
          } else {
            console.error("API Error:", response.status);
          }
        } catch (error) {
          console.error("Error during API call:", error);
        }
      };

      fetchData();
    }, 0);
  };
  const gradeAKTP = () => {
    const data = {
      answer_key: parsedAnswerKeys as TestInfo,
      test_papers: parsedTestPapers as AnswerKeyTest,
    };
    setTimeout(() => {
      // API call here
      const fetchData = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/grade_papers", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            const data = await response.json();
            setUpdatedTestPapers(data);
            console.log(data);
          } else {
            console.error("API Error:", response.status);
          }
        } catch (error) {
          console.error("Error during API call:", error);
        }
      };

      fetchData();
    }, 0);
  };

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
    //console.log(fileListTP);
    //console.log(fileLinksTP);
    setfileListTP(newfileListTP);

    //setTestPapers([]);
  };
  const updateFormattedFileLinks = async () => {
    const formattedLinks = fileListTP
      .map((file) => {
        const fileData = fileLinksTP[file.uid];

        if (fileData) {
          const data = Object.keys(fileData.data).reduce((acc, imageName) => {
            acc[imageName] = {
              original_image: fileData.data[imageName].original_image,
              name_section_url: fileData.data[imageName].name_section_url,
              answer_section_url: fileData.data[imageName].answer_section_url,
              error: fileData.data[imageName].error,
            };
            return acc;
          }, {} as { [imageName: string]: ImageDetails });

          return {
            status: fileData.status,
            data,
            uid: file.uid,
          };
        }

        return null;
      })
      .filter((item) => item !== null); // Filter out null values

    // Update the state with the correctly formatted data
    setFormattedFileLinks(formattedLinks as FileData[]);

    // After state update, trigger the API call
    // Here we use a setTimeout to wait for the state to update before calling the API
    setTimeout(() => {
      const requestData = formattedFileLinks;

      // API call here
      const fetchData = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/parse-images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          if (response.ok) {
            const data = await response.json();
            setParsedTestPapers(data["results"]);
          } else {
            console.error("API Error:", response.status);
          }
        } catch (error) {
          console.error("Error during API call:", error);
        }
      };

      fetchData();
    }, 0); // Delays the API call until after the state is updated
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

  const handleUploadAnswerKeyOk = () => {
    setIsUploadAnswerKeyOpen(false);
  };
  const handleUploadAnswerKeyCancel = () => {
    setIsUploadAnswerKeyOpen(false);
  };

  const handleUploadTestPaperOk = () => {
    setIsUploadTestPaperOpen(false);
  };
  const handleUploadTestPaperCancel = () => {
    setIsUploadTestPaperOpen(false);
  };

  const onGradeBtnClick = () => {
    gradeAKTP();
    loadPictures();
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
    console.log(parsedAnswerKeys);
    const updatedParsedAnswerKeys: TestInfo = {
      ...parsedAnswerKeys,
    } as TestInfo;
    updatedParsedAnswerKeys.Question_pair!.tests = updatedTests;
    setParsedAnswerKeys(updatedParsedAnswerKeys);

    setIsConfirmAKOpen(false);
  };

  const onParse = async () => {
    try {
      if (parsedAnswerKeys) {
        // If parsedAnswerKeys already has a value, skip the API call
        setIsUploadAnswerKeyOpen(false);
        setIsConfirmAKOpen(true);
        return;
      }

      enterLoading(0, true); // Start loading

      const handleParse = async () => {
        const dataToSend = fileLinksAK[fileListAK[0].uid];
        console.log(dataToSend);

        const response = await fetch("http://127.0.0.1:8000/parse-images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([dataToSend]),
        });

        if (!response.ok) {
          throw new Error("Failed to parse images");
        }

        const responseData = await response.json();
        return responseData.results;
      };

      const answerKeysData = await handleParse();
      setParsedAnswerKeys(answerKeysData[0]);
      setAnswerKeys(answerKeysData[0].Question_pair.tests);
      setIsUploadAnswerKeyOpen(false);
      setIsConfirmAKOpen(true);
    } catch (error) {
      console.error("Error parsing images:", error);
    } finally {
      enterLoading(0, false); // Stop loading
    }
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
    <Layout
      style={{
        height: "100vh",
        background: `repeating-linear-gradient(
      90deg,
      hsla(196, 0%, 20%, 0.15) 0px,
      hsla(196, 0%, 20%, 0.15) 1px,
      transparent 1px,
      transparent 96px
    ),
    repeating-linear-gradient(
      0deg,
      hsla(196, 0%, 20%, 0.15) 0px,
      hsla(196, 0%, 20%, 0.15) 1px,
      transparent 1px,
      transparent 96px
    ),
    repeating-linear-gradient(
      0deg,
      hsla(196, 0%, 20%, 0.25) 0px,
      hsla(196, 0%, 20%, 0.25) 1px,
      transparent 1px,
      transparent 12px
    ),
    repeating-linear-gradient(
      90deg,
      hsla(196, 0%, 20%, 0.25) 0px,
      hsla(196, 0%, 20%, 0.25) 1px,
      transparent 1px,
      transparent 12px
    ),
    linear-gradient(90deg, rgb(24, 25, 26), rgb(24, 25, 26))`,
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
          <Content style={{ padding: "48px 48px", width: "65vw" }}>
            <div
              style={{
                minHeight: 600,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Splitter
                style={{
                  height: 600,
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Splitter.Panel min={33}>
                  <Layout
                    style={{
                      borderRadius: borderRadiusLG,
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    {/* <Header
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        height: "40px",
                        paddingInline: 48,
                        lineHeight: "64px",
                        backgroundColor: "#4096ff",
                      }}
                    >
                      <p>Only one answer key may be uploaded at a time</p>
                      <p>
                        Only our supported formats with 6 landmarks can be
                        uploaded at the moment
                      </p>
                    </Header> */}
                    <Content style={{ height: "48vh" }}>
                      <Flex
                        justify="center"
                        align="center"
                        style={{ height: "100%" }}
                      >
                        <Upload
                          beforeUpload={handleBeforeUpload}
                          name="images"
                          customRequest={async ({
                            file: fileItem,
                            onSuccess,
                          }) => {
                            console.log(fileItem, fileListAK);
                            const formData = new FormData();
                            const uid = (fileItem as UploadFile).uid;
                            formData.append("images", fileItem);
                            formData.append("uid", uid);
                            const response = await fetch(
                              "http://127.0.0.1:8000/process_images",
                              {
                                method: "POST",
                                body: formData,
                              }
                            );
                            const data = await response.json();
                            const updatedfileLinksAK = { ...fileLinksAK };
                            updatedfileLinksAK[(fileItem as UploadFile).uid] =
                              data[0];
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

                            if (response.ok) {
                              // Check if the removed file corresponds to the current parsedAnswerKeys
                              if (parsedAnswerKeys && fileLinksAK[file.uid]) {
                                console.log(
                                  "Clearing parsedAnswerKeys and related state"
                                );
                                setParsedAnswerKeys(undefined); // Reset parsedAnswerKeys
                                setAnswerKeys([]); // Reset associated answer keys
                              }
                            } else {
                              console.error(
                                "Failed to delete image on server."
                              );
                            }

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
                              onVisibleChange: (visible) =>
                                setPreviewOpen(visible),
                              afterOpenChange: (visible) =>
                                !visible && setPreviewImage(""),
                            }}
                            src={previewImage}
                          />
                        )}
                      </Flex>
                    </Content>
                    <Footer style={{ padding: "0" }}>
                      <Button
                        disabled={
                          fileListAK.length < 1 || fileListAK.length > 1
                        }
                        key="parse"
                        type="primary"
                        loading={loadings[0]}
                        onClick={onParse}
                      >
                        Parse Answers
                      </Button>
                    </Footer>
                  </Layout>
                </Splitter.Panel>
                <Splitter.Panel min={33}>
                  <Layout
                    style={{
                      borderRadius: borderRadiusLG,
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    {/* <Header
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        height: "40px",
                        paddingInline: 48,
                        lineHeight: "64px",
                        backgroundColor: "#4096ff",
                      }}
                    >
                      <p>Only one answer key may be uploaded at a time</p>
                      <p>
                        Only our supported formats with 6 landmarks can be
                        uploaded at the moment
                      </p>
                    </Header> */}
                    <Content style={{ height: "48vh" }}>
                      <Flex
                        justify="center"
                        align="center"
                        style={{ height: "100%" }}
                      >
                        <Upload
                          beforeUpload={handleBeforeUpload}
                          name="images"
                          multiple={true}
                          disabled={answerKeys.length < 1}
                          customRequest={async ({
                            file: fileItem,
                            onSuccess,
                          }) => {
                            console.log(fileItem, fileListTP);
                            const formData = new FormData();
                            formData.append("images", fileItem);
                            formData.append(
                              "uid",
                              (fileItem as UploadFile).uid
                            );
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
                              console.error(
                                "No data found for this file UID:",
                                file.uid
                              );
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
                              onVisibleChange: (visible) =>
                                setPreviewOpen(visible),
                              afterOpenChange: (visible) =>
                                !visible && setPreviewImage(""),
                            }}
                            src={previewImage}
                          />
                        )}
                        {previewImage && (
                          <Image
                            wrapperStyle={{ display: "none" }}
                            preview={{
                              visible: previewOpen,
                              onVisibleChange: (visible) =>
                                setPreviewOpen(visible),
                              afterOpenChange: (visible) =>
                                !visible && setPreviewImage(""),
                            }}
                            src={previewImage}
                          />
                        )}
                      </Flex>
                    </Content>
                    <Footer style={{ padding: "0" }}>
                      <Button
                        disabled={fileListTP.length < 1}
                        key="parse"
                        type="primary"
                        loading={loadings[0]}
                        onClick={updateFormattedFileLinks}
                      >
                        Parse Answers
                      </Button>
                    </Footer>
                  </Layout>
                </Splitter.Panel>
                <Splitter.Panel min={33}>
                  <Flex
                    justify="center"
                    align="center"
                    style={{ height: "100%" }}
                  >
                    {imageList.map((base64Image, index) => (
                      <Image
                        key={index}
                        width={200}
                        src={`data:image/jpeg;base64,${base64Image}`}
                        alt={`Annotated Image ${index + 1}`}
                      />
                    ))}
                    <Button
                      color="default"
                      variant="solid"
                      onClick={onGradeBtnClick}
                    >
                      Check Papers
                    </Button>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={exportGrades}
                    >
                      Grades
                    </Button>
                  </Flex>
                </Splitter.Panel>
              </Splitter>
            </div>
          </Content>
        </Col>
      </Row>

      <Flex wrap gap="small">
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
