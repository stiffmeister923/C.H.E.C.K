import React, { useCallback, useMemo, useState } from "react";
import { Button, message, Steps, theme, UploadProps } from "antd";
import { AnswerKeyUploaderStep } from "./AnswerKeyUploaderStep";
import { FileData } from "./types";
import { UploadFile } from "antd/lib/upload";
import { AnswerKeyParserStep } from "./AnswerKeyParserStep";
import { TestInfo } from "./AnswerKeyForm";

export const TestChecker = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [answerKeyFileList, setAnswerKeyFileList] = useState<UploadFile[]>();
  const [answerKeyFile, setAnswerKeyFile] = useState<FileData>();
  const [parsedAnswerKey, setParsedAnswerKey] = useState<TestInfo>();

  const onAnswerKeyRemove = () => {
    setAnswerKeyFile(undefined);
    setParsedAnswerKey(undefined);
  };

  const onAnswerKeyChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setAnswerKeyFileList(newFileList);
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleParse = useCallback(async () => {
    const response = await fetch("http://127.0.0.1:8000/parse-images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([answerKeyFile]),
    });

    if (!response.ok) {
      throw new Error("Failed to parse images");
    }

    const responseData = await response.json();
    return responseData.results;
  }, [answerKeyFile]);

  const onAnswerKeyParse = useCallback(async () => {
    try {
      const data = await handleParse();
      setParsedAnswerKey(data[0]);
    } catch (error) {
      console.error("Error parsing images:", error);
    }
  }, [handleParse]);

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
        />
      ),
      // content: current === 1 && answerKey && <
      // content: <AnswerKeyUploader />,
    },
    {
      title: "Upload Test Papers",
      description: "Upload test papers to check",
      content: "Second-content",
    },
    {
      title: "Check Test Papers",
      description: "Check test papers against answer key",
      content: "Last-content",
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    minHeight: "calc(100% - 50px)",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const preventNext = useMemo(() => {
    return current === 0 && !answerKeyFile;
  }, [current, answerKeyFile]);

  return (
    <>
      <Steps current={current} items={items} style={{ width: "100%" }} />
      <div style={contentStyle}>{steps[current].content}</div>
      <div style={{ marginTop: 24 }}>
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => {
              console.log(answerKeyFile, parsedAnswerKey);
              if (
                current === 0 &&
                answerKeyFile?.uid !== parsedAnswerKey?.generated_uid
              ) {
                onAnswerKeyParse();
              }
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
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
      </div>
    </>
  );
};
