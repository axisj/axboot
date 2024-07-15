import { UploadOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { FileDto } from "@types";
import type { UploadProps } from "antd";
import { Button, Upload } from "antd";
import React from "react";

interface Props {
  files?: FileDto[];
  onChangeFile?: (files?: FileDto[]) => void;
  disabled?: boolean;
}

const props: UploadProps = {
  action: "//jsonplaceholder.typicode.com/posts/",
  listType: "text",
  previewFile(file) {
    console.log("Your upload file:", file);
    // Your process logic. Here we just mock to the same file
    return fetch("https://next.json-generator.com/api/json/get/4ytyBoLK8", {
      method: "POST",
      body: file,
    })
      .then((res) => res.json())
      .then(({ thumbnail }) => thumbnail);
  },
};

function MultiFileUploader({ files, onChangeFile, disabled }: Props) {
  return (
    <Container>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </Container>
  );
}

const Container = styled.div`
  .upload-list-inline .ant-upload-list-item {
    float: left;
    width: 200px;
    margin-inline-end: 8px;
  }

  .ant-upload-rtl.upload-list-inline .ant-upload-list-item {
    float: right;
  }
`;

export { MultiFileUploader };
