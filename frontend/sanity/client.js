import { createClient } from "@sanity/client";

export default createClient({
  projectId: "rsg8mxls", 
  dataset: "production", 
  useCdn: true,
  apiVersion: "2023-01-01",
});
