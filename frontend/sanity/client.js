import sanityClient from "@sanity/client";

export default sanityClient({
  projectId: "rsg8mxls", 
  dataset: "production", 
  useCdn: true,
  apiVersion: "2023-01-01",
});
