import React, { useState } from "react";
import { Button, Flex, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import type { UploadFile } from "antd";
import { RcFile } from "antd/es/upload";
import { FileData } from "./types";
import { UploadProps } from "antd/lib/upload";

export const AnswerKeyUploaderStep = ({
  fileData,
  fileList,
  onChange,
  onUpload,
  onRemove,
}: {
  fileData?: FileData;
  fileList?: UploadFile[];
  onChange: UploadProps["onChange"];
  onUpload: (fileData: FileData) => void;
  onRemove: () => void;
}) => {
  const handleBeforeUpload = (file: RcFile): boolean => {
    const maxSizeMB = 5; // Set the maximum size in MB
    if (file.size / 1024 / 1024 > maxSizeMB) {
      alert(`File is too large! Maximum size is ${maxSizeMB} MB.`);
      return false;
    }
    return true;
  };
  return (
    <Flex justify="center" align="center" style={{ height: "100%" }}>
      <ImgCrop rotationSlider>
        <Upload
          beforeUpload={handleBeforeUpload}
          name="images"
          customRequest={async ({ file: fileItem, onSuccess }) => {
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
            onUpload(data[0]);
            onSuccess!("ok");
          }}
          listType="picture-card"
          maxCount={1}
          fileList={fileList}
          // fileList={fileListAK}
          // onPreview={handlePreview}
          onChange={onChange}
          onRemove={async () => {
            const body = fileData;

            const response = await fetch(
              "http://127.0.0.1:8000/delete-images",
              {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
              }
            );

            if (response.ok) {
              onRemove();
            } else {
              console.error("Failed to delete image on server.");
            }

            const data = await response.json();
            console.log(data[0]);
            return true;
          }}

          //disabled={fileListAK?.some((fileItem) => fileItem.status === "done")}
        >
          <Button
            style={{ background: "none", border: 0 }}
            icon={<PlusOutlined />}
          >
            Upload
          </Button>
        </Upload>
      </ImgCrop>
    </Flex>
  );
};
