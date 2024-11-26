import { Col, Image, Row, Spin } from "antd";
import { useMemo } from "react";
import { FileData } from "./types";
import { AnswerKeyForm, TestInfo } from "./AnswerKeyForm";

export const AnswerKeyParserStep = ({
  answerKeyFile,
  parsedAnswerKey,
  onParse,
  onSubmit,
}: {
  answerKeyFile: FileData;
  parsedAnswerKey: TestInfo;
  onParse: (keys: TestInfo) => void;
  onSubmit: (values: { [key: string]: string }) => void;
}) => {
  const fileUrl = useMemo(() => {
    const answerKeyData = answerKeyFile.data || {};
    return Object.keys(answerKeyData).reduce((url, currentKey) => {
      if (
        typeof answerKeyData[currentKey] === "object" &&
        "original_image" in answerKeyData[currentKey]
      ) {
        return answerKeyData[currentKey].original_image;
      }
      return url;
    }, "");
  }, [answerKeyFile]);

  return (
    <Row
      style={{
        justifyContent: "center",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* <Splitter.Panel size={sizes[0]} resizable={true}> */}
      {fileUrl && (
        <Col
          style={{ width: "489px", height: "calc(100vh - 330px)" }}
          className="answer-key-img"
        >
          <Image src={fileUrl} className="answer-key-img" />
        </Col>
      )}
      {/* </Splitter.Panel> */}
      {/* <Splitter.Panel
        style={{ padding: "24px", background: "white" }}
        resizable={true}
      > */}
      {!parsedAnswerKey && (
        <Col
          style={{
            display: "flex",
            width: "489px",
            height: "calc(100vh - 330px)",
            background: "white",
          }}
        >
          <Spin size="large" style={{ width: "100%", alignSelf: "center" }} />
        </Col>
      )}

      {parsedAnswerKey && (
        <Col
          style={{
            overflowY: "scroll",
            padding: "48px",
            background: "white",
            width: "489px",
            height: "calc(100vh - 330px)",
            // width: "100%",
          }}
        >
          <AnswerKeyForm
            tests={parsedAnswerKey.Question_pair.tests}
            onSubmit={onSubmit}
          />
        </Col>
      )}
      {/* </Splitter.Panel> */}
    </Row>
  );
};
