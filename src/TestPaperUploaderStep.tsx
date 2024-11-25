import React, { useState } from "react";
import { Button, Flex, Upload, Image, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
//import ImgCrop from "antd-img-crop";
import type { UploadFile } from "antd";
import { RcFile } from "antd/es/upload";
import { FileData } from "./types";
import { UploadProps } from "antd/lib/upload";
import type { GetProp } from "antd";
import "./index.css";
export const TestPaperUploaderStep = ({
  fileData,
  fileList,
  onChange,
  onUpload,
  onRemove,
}: {
  fileData?: FileData[];
  fileList?: UploadFile[];
  onChange: UploadProps["onChange"];
  onUpload: (fileData: FileData) => void;
  onRemove: (fileData: FileData) => void;
}) => {
  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const handleBeforeUpload = (file: RcFile): boolean => {
    const maxSizeMB = 5; // Set the maximum size in MB
    if (file.size / 1024 / 1024 > maxSizeMB) {
      alert(`File is too large! Maximum size is ${maxSizeMB} MB.`);
      return false;
    }
    return true;
  };
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  return (
    <Flex justify="center" align="center" style={{ height: "100%" }}>
      {/* <ImgCrop rotationSlider aspectSlider showGrid showReset> */}
      <Upload
        beforeUpload={handleBeforeUpload}
        name="images"
        multiple={true}
        customRequest={async ({ file: fileItem, onSuccess, onError }) => {
          const formData = new FormData();
          const uid = (fileItem as UploadFile).uid;
          formData.append("images", fileItem);
          formData.append("uid", uid);
          try {
            const response = await fetch(
              "https://eminent-gazelle-vital.ngrok-free.app/process_images",
              {
                method: "POST",
                body: formData,
              }
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Check if the server returned a status of "error"
            if (data[0]?.status === "error") {
              message.error(
                `Processing failed for image : ${
                  data[0].error || "Unknown error occurred"
                }`
              );
              onError?.(new Error(data.error || "Processing error"));
              return;
            }

            // If the response status is successful
            onUpload(data[0]);
            onSuccess?.("ok");
            message.success(`Image uploaded and processed successfully!`);
          } catch (e) {
            message.error(`Failed to process image. Please try again.`);
            onError?.(e as any);
          }
        }}
        listType="picture-card"
        maxCount={35}
        fileList={fileList}
        // fileList={fileListAK}
        onPreview={handlePreview}
        onChange={onChange}
        onRemove={async (fileItem) => {
          const body = fileData?.find(
            (fileDataItem: FileData) => fileDataItem.uid === fileItem.uid
          );
          console.log(fileData, fileItem, body);

          const response = await fetch(
            "https://eminent-gazelle-vital.ngrok-free.app/delete-images",
            {
              method: "POST",
              body: JSON.stringify(body),
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.ok) {
            onRemove(fileItem as unknown as FileData);
            message.success(`Image deleted successfully!`);
          } else {
            message.error(
              `Failed to delete image or image might not be in the server`
            );
          }

          await response.json();
          onRemove(fileItem as unknown as FileData);
          return true;
        }}

        //disabled={fileListAK?.some((fileItem) => fileItem.status === "done")}
      >
        <Button
          //className=".btn-grad"
          style={{
            background: "none",
            border: 0,
            height: "100%",
            color: "white",
          }}
          icon={<PlusOutlined />}
        >
          Upload
        </Button>
      </Upload>
      {/* </ImgCrop> */}
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
    </Flex>
  );
};
