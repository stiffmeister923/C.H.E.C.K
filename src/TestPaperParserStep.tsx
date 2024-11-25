import { Col, Flex, Image, Row, Skeleton, Space, Spin, Splitter } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FileData } from "./types";
import { AnswerKeyForm, AnswerKeyTest, Test, TestInfo } from "./AnswerKeyForm";

export const TestPaperParserStep = ({
  testPaperFileList,
  parsedTestPaper,
  onParse,
  onSubmit,
}: {
  testPaperFileList: FileData[];
  parsedTestPaper: TestInfo[];
  onParse: (keys: TestInfo) => void;
  onSubmit: (uid: string, values: { [key: string]: string }) => void;
}) => {
  const [sizes, setSizes] = useState<(number | string)[]>(["40%", "60%"]);
  const [selectedTestPaper, setSelectedTestPaper] = useState("");

  const getFileUrl = useCallback((item: FileData) => {
    const { data } = item;
    return Object.keys(data).reduce((url, currentKey) => {
      if (
        typeof data[currentKey] === "object" &&
        "original_image" in data[currentKey]
      ) {
        return data[currentKey].original_image;
      }
      return url;
    }, "");
  }, []);

  const selectedTestPaperData = useMemo(() => {
    return selectedTestPaper
      ? testPaperFileList.find(
          (testPaperFile) => testPaperFile.uid === selectedTestPaper
        )
      : null;
  }, [selectedTestPaper, testPaperFileList]);

  const selectedTestPaperUrl = useMemo(() => {
    return selectedTestPaperData ? getFileUrl(selectedTestPaperData) : "";
  }, [selectedTestPaperData, getFileUrl]);

  const selectedParsedTestPaper = useMemo(() => {
    console.log();
    return selectedTestPaper
      ? parsedTestPaper?.find(
          (testPaper) => testPaper.generated_uid === selectedTestPaper
        )?.Question_pair.tests
      : null;
  }, [selectedTestPaper, parsedTestPaper]);

  const fileUrl = useMemo(() => {
    // const TestPaperData = testPaperFileList.data || {};
    // return Object.keys(TestPaperData).reduce((url, currentKey) => {
    //   if (
    //     typeof TestPaperData[currentKey] === "object" &&
    //     "original_image" in TestPaperData[currentKey]
    //   ) {
    //     return TestPaperData[currentKey].original_image;
    //   }
    //   return url;
    // }, "");

    return "";
  }, [testPaperFileList]);
  console.log("parsedTestPaper", parsedTestPaper);
  console.log("selectedParsedTestPaper", selectedParsedTestPaper);

  return (
    <>
      <Row
        // onResize={setSizes}
        style={{
          height: "calc(100vh - 512px)",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* <Splitter.Panel size={sizes[0]} resizable={true}> */}
        {selectedTestPaperUrl && (
          <Col
            style={{ width: "489px", height: "100%" }}
            className="answer-key-img"
          >
            <Image src={selectedTestPaperUrl} className="answer-key-img" />
          </Col>
        )}
        {/* </Splitter.Panel> */}
        {/* <Splitter.Panel
        style={{ padding: "24px", background: "white" }}
        resizable={true}
      > */}
        {!selectedParsedTestPaper && (
          <Col
            style={{
              width: "489px",
              height: "100%",
              display: "flex",
              background: "white",
            }}
          >
            <Spin size="large" style={{ width: "100%", alignSelf: "center" }} />
          </Col>
        )}

        {selectedTestPaper && (
          <Col
            style={{
              overflowY: "scroll",
              height: "calc(100vh - 512px)",
              padding: "48px",
              background: "white",
              // width: "100%",
              width: "489px",
            }}
          >
            {selectedTestPaper && selectedParsedTestPaper ? (
              <AnswerKeyForm
                tests={selectedParsedTestPaper || []}
                onSubmit={(values: { [key: string]: string }) => {
                  onSubmit(selectedTestPaper, values);
                }}
              />
            ) : null}
          </Col>
        )}
        {/* </Splitter.Panel> */}
      </Row>
      <Row>
        {testPaperFileList.map((testPaperItem, index) => {
          const testUrl = getFileUrl(testPaperItem);
          return (
            <Image
              style={{ cursor: "pointer" }}
              key={index}
              width={"100px"}
              height={"100px"}
              src={testUrl as string}
              preview={false}
              onClick={() => {
                setSelectedTestPaper("");
                setSelectedTestPaper(testPaperItem.uid);
              }}
            />
          );
        })}
        {/* {images.map((url, index) => (
          
        ))} */}
      </Row>

      <Row></Row>
    </>
  );
};
