import axios from "axios";

export async function apiCalls(method, url, data) {
  const resp = await axios({
    method,
    url: `${process.env.REACT_APP_API_SERVER}/${url}`,
    ...(data && { data }),
  });

  return resp.data;
}
