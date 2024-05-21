import { HOST, PORT, V1 } from "../configs.js";

const apiRes = (resource, kind) => {
  return {
    collection: (contents) => {
      return {
        kind: "Collection",
        self: `${HOST}:${PORT}/${V1}/${resource}`,
        contents,
      };
    },
    one: (data) => {
      return {
        kind,
        self: `${HOST}:${PORT}/${V1}/${resource}/${data.id}`,
        ...data,
      };
    },
  };
};

export { apiRes };
