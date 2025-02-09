"server-only";

import { Resource } from "sst";

export function getURL(path: string): string {
  if (Resource.App.stage === "kylemonteiro") {
    return "http://localhost:3000" + path;
  }
  return Resource.MyWeb.url + path;
}
