import axios from "axios";
import { saveAs } from "file-saver";
import { getAppData } from "@core/utils/store";
import { ApiError } from "./ApiError";
import { API_URL } from "./apiWrapper";

interface Props {
  savePath?: string;
  fileName?: string;
}

export async function fileDownload({ savePath, fileName }: Props) {
  const file = await axios.get<any>(`${API_URL}/v1/s3/download?savePath=${savePath}&fileName=${fileName}`, {
    responseType: "blob",
    headers: {
      Authorization: "Bearer " + getAppData()?.authorization,
      credentials: true,
      "Access-Control-Expose-Headers": "Content-Disposition",
      exposedHeaders: ["Content-Disposition"],
    },
  });

  const res = await file.data.text();
  if (res.substring(0, 8) === '{"error"') {
    const parseString = JSON.parse(res);
    throw new ApiError(parseString.error.code, parseString.error.data);
  }

  saveAs(file.data as Blob, fileName ?? "");
}
