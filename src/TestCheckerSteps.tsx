import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  Button,
  message,
  Steps,
  theme,
  UploadProps,
  Image,
  Col,
  Row,
} from "antd";
import { AnswerKeyUploaderStep } from "./AnswerKeyUploaderStep";
import { FileData } from "./types";
import { UploadFile } from "antd/lib/upload";
import { AnswerKeyParserStep } from "./AnswerKeyParserStep";
import {
  TestInfo,
  Test,
  AnswerKeyTest,
  GradeTest,
  AnswerKeyForm,
} from "./AnswerKeyForm";
import { TestPaperUploaderStep } from "./TestPaperUploaderStep";
import { TestPaperParserStep } from "./TestPaperParserStep";
import { DownloadOutlined } from "@ant-design/icons";

export const TestChecker = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [answerKeyFileList, setAnswerKeyFileList] = useState<UploadFile[]>();
  const [answerKeyFile, setAnswerKeyFile] = useState<FileData>();
  const [testPaperFileList, setTestPaperFileList] = useState<UploadFile[]>([]);
  const [testPaperFile, setTestPaperFile] = useState<FileData[]>([]);
  const [parsedAnswerKey, setParsedAnswerKey] = useState<TestInfo>();
  const [parsedTestPapers, setParsedTestPapers] = useState<AnswerKeyTest>([]);
  const [checkedTestPapers, setCheckedTestPapers] = useState<GradeTest>();
  const [imageList, setImageList] = useState([]);

  const onSubmit = (values: { [key: string]: string }): void => {
    const updatedTests: Test[] = parsedAnswerKey!.Question_pair.tests.map(
      (test) => {
        return {
          ...test,
          question_answer_pairs: test.question_answer_pairs.map((testItem) => {
            return {
              ...testItem,
              answer: values[`${test.test_number}-${testItem.question_number}`],
            };
          }),
        };
      }
    );
    const updatedParsedAnswerKeys: TestInfo = {
      ...parsedAnswerKey,
    } as TestInfo;
    updatedParsedAnswerKeys.Question_pair!.tests = updatedTests;
    setParsedAnswerKey(updatedParsedAnswerKeys);
    //console.log(updatedParsedAnswerKeys);
  };

  const onSubmitTestPapers = (
    uid: string,
    values: { [key: string]: string }
  ): void => {
    const updatedTestPapers = [...parsedTestPapers];
    const testPaperToUpdateIndex = updatedTestPapers.findIndex((testPaper) => {
      // ////console.log(
      //   testPaper.generated_uid,
      //   uid,
      //   testPaper.generated_uid === uid
      // );
      return testPaper.generated_uid === uid;
    });

    //////console.log(parsedTestPapers);

    if (testPaperToUpdateIndex !== -1) {
      const updatedTests: Test[] = parsedTestPapers[
        testPaperToUpdateIndex
      ]!.Question_pair.tests.map((test) => {
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
      updatedTestPapers[testPaperToUpdateIndex].Question_pair!.tests =
        updatedTests;
      setParsedTestPapers(updatedTestPapers);
    }
  };

  const onAnswerKeyRemove = () => {
    setAnswerKeyFile(undefined);
    setParsedAnswerKey(undefined);
  };

  const onAnswerKeyChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setAnswerKeyFileList(newFileList);
  };

  const onTestPaperRemove = (fileItem: FileData) => {
    setTestPaperFile((testPaperItems) => {
      const updatedFileData = testPaperItems?.filter(
        (fileDataItem: FileData) => fileDataItem.uid !== fileItem.uid
      );
      //////console.log("updatedFileData", updatedFileData);
      return updatedFileData;
    });
    // setParsedTestPapers((testPaperItems) => {
    //   const updatedFileData = testPaperItems?.filter(
    //     (fileDataItem: FileData) => fileDataItem.uid !== fileItem.uid
    //   );
    //   return updatedFileData;
    // });
  };

  const onTestPaperUpload = (fileItem: FileData) => {
    setTestPaperFile((testPaperFileItems) => {
      return testPaperFileItems?.concat([fileItem]);
    });
  };

  const onTestPaperChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setTestPaperFileList(newFileList);
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
    //////console.log(testPaperFile, testPaperFileList);
  };
  const loadPictures = useCallback(() => {
    const data = checkedTestPapers;

    setTimeout(() => {
      // Start the loading message
      const hideLoading = message.loading("Loading pictures...", 0); // 0 duration keeps it open indefinitely

      const fetchData = async () => {
        try {
          const response = await fetch(
            "https://eminent-gazelle-vital.ngrok-free.app/get_annotated_image_base_64",
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
              message.success("Finished loading images");
              setImageList(images);
            } else {
              message.warning("No images were returned.");
            }
          } else {
            message.error("Try going back and clicking next again");
            console.error("API Error:", response.status);
          }
        } catch (error) {
          console.error("Error during API call:", error);
          message.error("An error occurred while loading pictures.");
        } finally {
          // Close the loading message
          hideLoading();
        }
      };

      fetchData();
    }, 0);
  }, [checkedTestPapers]);

  const exportGrades = () => {
    const data = checkedTestPapers;
    setTimeout(() => {
      // API call here
      const fetchData = async () => {
        try {
          const response = await fetch(
            "https://eminent-gazelle-vital.ngrok-free.app/export_grades_with_images",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

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

  const gradeAKTP = () => {
    const data = {
      answer_key: parsedAnswerKey as TestInfo,
      test_papers: parsedTestPapers as AnswerKeyTest,
    };
    //////console.log(data);
    setTimeout(() => {
      // API call here
      const fetchData = async () => {
        try {
          const response = await fetch(
            "https://eminent-gazelle-vital.ngrok-free.app/grade_papers",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (response.ok) {
            const data = await response.json();
            setCheckedTestPapers(data);
            message.success("Papers Checked!!!, make sure to double check.");
            //////console.log(data);
          } else {
            message.warning("API Error, try again.");
            console.error("API Error:", response.status);
          }
        } catch (error) {
          message.error("Error during API call");
          console.error("Error during API call:", error);
        }
      };

      fetchData();
    }, 0);
  };

  const handleParse = useCallback(async () => {
    // Show the loading message and get a reference to close it
    const hideMessage = message.loading("Parsing", 0); // Duration 0 keeps it open indefinitely

    try {
      const response = await fetch(
        "https://eminent-gazelle-vital.ngrok-free.app/parse-images",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([answerKeyFile]),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to parse images");
      }

      const responseData = await response.json();
      //console.log(responseData);
      message.success("Parsed text are now editable");
      return responseData.results;
    } catch (error) {
      message.error("Failed to parse the image");
      console.error(error);
      throw error;
    } finally {
      // Close the loading message
      hideMessage();
    }
  }, [answerKeyFile]);

  const onAnswerKeyParse = useCallback(async () => {
    try {
      const data = await handleParse();
      setParsedAnswerKey(data[0]);
    } catch (error) {
      console.error("Error parsing images:", error);
    }
  }, [handleParse]);

  const handleParseTestPapers = useCallback(async () => {
    const hideMessage = message.loading("Parsing", 0);
    try {
      ////////console.log(testPaperFile);
      const response = await fetch(
        "https://eminent-gazelle-vital.ngrok-free.app/parse-images",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testPaperFile),
        }
      );

      if (!response.ok) {
        message.error("Failed to parse the Images");
        throw new Error("Failed to parse images");
      }
      message.success("Parsed text are now editable");
      const responseData = await response.json();
      return responseData.results;
    } catch (error) {
      message.error("Failed to parse the image");
      console.error(error);
      throw error;
    } finally {
      hideMessage();
    }
  }, [testPaperFile]);

  const onTestPaperParse = useCallback(async () => {
    try {
      const data = await handleParseTestPapers();
      setParsedTestPapers(data);
    } catch (error) {
      console.error("Error parsing images:", error);
    }
  }, [handleParseTestPapers]);

  const steps = [
    {
      title: "Upload Answer Key",
      description: "Upload a PDF file containing the answer key",
      content: (
        <AnswerKeyUploaderStep
          fileData={answerKeyFile}
          fileList={answerKeyFileList}
          onChange={onAnswerKeyChange}
          onUpload={setAnswerKeyFile}
          onRemove={onAnswerKeyRemove}
        />
      ),
    },
    {
      title: "Validate Answer Key",
      description: "Validate parsed answer key",
      content: current === 1 && answerKeyFile && (
        <AnswerKeyParserStep
          answerKeyFile={answerKeyFile as unknown as FileData}
          parsedAnswerKey={parsedAnswerKey as unknown as TestInfo}
          onParse={setParsedAnswerKey as unknown as (keys: TestInfo) => void}
          onSubmit={onSubmit}
        />
      ),
      // content: current === 1 && answerKey && <
      // content: <AnswerKeyUploader />,
    },
    {
      title: "Upload Test Papers",
      description: "Upload test papers to check",
      content: current === 2 && parsedAnswerKey && (
        <TestPaperUploaderStep
          fileData={testPaperFile}
          fileList={testPaperFileList}
          onChange={onTestPaperChange}
          onUpload={onTestPaperUpload}
          onRemove={onTestPaperRemove}
        ></TestPaperUploaderStep>
      ),
    },
    {
      title: "Validate Test Papers",
      description: "Validate parsed test papers",
      content: current === 3 && testPaperFile && (
        <TestPaperParserStep
          testPaperFileList={testPaperFile as unknown as FileData[]}
          parsedTestPaper={parsedTestPapers as unknown as AnswerKeyTest}
          onParse={setParsedTestPapers as unknown as (keys: TestInfo) => void}
          onSubmit={onSubmitTestPapers}
        ></TestPaperParserStep>
      ),
    },
    {
      title: "Check Test Papers",
      description: "Check test papers against answer key",
      content: (
        <Col>
          {parsedAnswerKey && (
            <Row
              style={{
                overflowY: "scroll",
                padding: "48px",
                background: "white",

                height: "calc(100vh - 330px)",
                display: "inline-grid",
                minWidth: "200px",

                // width: "100%",
              }}
            >
              <div>
                <AnswerKeyForm
                  tests={parsedAnswerKey.Question_pair.tests}
                  onSubmit={onSubmit}
                />
              </div>
            </Row>
          )}
          <div>
            {imageList.map((base64Image, index) => (
              <Image
                key={index}
                width={`calc(100vw/3)`}
                src={`data:image/jpeg;base64,${base64Image}`}
                alt={`Annotated Image ${index + 1}`}
              />
            ))}
          </div>
        </Col>
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    //minHeight: "calc(100% - 50px)",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const preventNext = useMemo(() => {
    ////console.log("Current step:", current);

    if (current === 0) {
      ////console.log("Checking if answerKeyFile exists:", answerKeyFile);
      // Stage 0: Check if answerKeyFile is missing
      return !answerKeyFile;
    } else if (current === 2) {
      //////console.log("Checking if test papers are available:", testPaperFile);
      if (!testPaperFile || testPaperFile.length === 0) {
        //////console.log("No test papers available.");
        return true; // Prevent going to the next step if there are no test papers
      }

      // ////console.log("Checking if all test papers are parsed:", testPaperFile);
      //////console.log("Parsed Test Papers:", parsedTestPapers);

      // Stage 2: Check if all test papers have been parsed
      // return testPaperFile?.some(
      //   (file) =>
      //     !parsedTestPapers?.some((paper) => paper?.generated_uid === file?.uid)
      // );
    } else if (current === 3) {
      // Stage 3: Check if parsedTestPapers is empty
      return !parsedTestPapers?.length;
    }
    return false; // Default: No restrictions for other stages
  }, [current, answerKeyFile, testPaperFile, parsedTestPapers]);

  useEffect(() => {
    if (checkedTestPapers && Object.keys(checkedTestPapers).length > 0) {
      loadPictures(); // Call loadPictures once checkedTestPapers state is updated
    }
  }, [checkedTestPapers, loadPictures]);

  return (
    <>
      <Steps
        className="check-steps"
        current={current}
        items={items}
        style={{ width: "100%", padding: "0px 40px 0px 40px" }}
      />
      <div style={contentStyle}>{steps[current].content}</div>
      <div
        className={"step-btn"}
        style={{ marginTop: 24, padding: "0px 0px 24px 0px" }}
      >
        {current > 0 && (
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => {
              prev();
              //////console.log("Previous: ", current);
            }}
          >
            Previous
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button
            type="primary"
            style={{ color: "white" }}
            onClick={() => {
              ////////console.log(answerKeyFile, parsedAnswerKey);
              //////console.log("Next: ", current);
              if (
                current === 0 &&
                answerKeyFile?.uid !== parsedAnswerKey?.generated_uid
              ) {
                onAnswerKeyParse();
              } else if (
                current === 2 &&
                testPaperFile?.some(
                  (file) =>
                    !parsedTestPapers?.some(
                      (paper) => paper?.generated_uid === file?.uid
                    )
                ) && // Check if at least one test paper file hasn't been parsed yet
                testPaperFile.length !== 0
              ) {
                ////console.log("SO FUCKING TRUE");
                onTestPaperParse();
              } else if (current === 3 && parsedTestPapers.length) {
                gradeAKTP();
              }
              ////////console.log(parsedTestPapers);
              next();
            }}
            disabled={preventNext}
          >
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              message.success("Processing complete!");
              exportGrades();
            }}
          >
            Grades
          </Button>
        )}
      </div>
    </>
  );
};
