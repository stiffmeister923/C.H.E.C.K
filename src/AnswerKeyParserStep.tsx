import { Col, Flex, Image, Row, Skeleton, Space, Spin, Splitter } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FileData } from "./types";
import { AnswerKeyForm, TestInfo } from "./AnswerKeyForm";

export const AnswerKeyParserStep = ({
  answerKeyFile,
  parsedAnswerKey,
  onParse,
}: {
  answerKeyFile: FileData;
  parsedAnswerKey: TestInfo;
  onParse: (keys: TestInfo) => void;
}) => {
  const [sizes, setSizes] = useState<(number | string)[]>(["40%", "60%"]);

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
      // onResize={setSizes}
      style={{
        height: "calc(100vh - 512px)",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* <Splitter.Panel size={sizes[0]} resizable={true}> */}
      {fileUrl && (
        <Col
          style={{ width: "489px", height: "100%" }}
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
            width: "489px",
            height: "100%",
            display: "flex",
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
            height: "calc(100vh - 512px)",
            padding: "48px",
            background: "white",
            // width: "100%",
            width: "489px",
          }}
        >
          <AnswerKeyForm
            tests={parsedAnswerKey.Question_pair.tests}
            onSubmit={(values) => console.log(values)}
          />
        </Col>
      )}
      {/* </Splitter.Panel> */}
    </Row>
  );
};
