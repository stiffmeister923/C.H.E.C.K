import { Col, Image, Row, Spin } from "antd";
import { useCallback, useMemo, useState } from "react";
import { FileData } from "./types";
import { AnswerKeyForm, TestInfo } from "./AnswerKeyForm";

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
    //console.log();
    return selectedTestPaper
      ? parsedTestPaper?.find(
          (testPaper) => testPaper.generated_uid === selectedTestPaper
        )?.Question_pair.tests
      : null;
  }, [selectedTestPaper, parsedTestPaper]);

  //console.log("parsedTestPaper", parsedTestPaper);
  //console.log("selectedParsedTestPaper", selectedParsedTestPaper);

  return (
    <>
      <Row
        // onResize={setSizes}
        style={{
          justifyContent: "center",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* <Splitter.Panel size={sizes[0]} resizable={true}> */}
        {selectedTestPaperUrl && (
          <Col
            style={{ width: "489px", height: "calc(100vh - 330px)" }}
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
              height: "calc(100vh - 330px)",
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

              height: "calc(100vh - 330px)",
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
              className={
                selectedTestPaper === testPaperItem.uid ? "check-selected" : ""
              }
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
