import {api} from "./services";

export const login = (formdata) => {
  return api.post("/api/signin", formdata).then((res) => res.data);
};
