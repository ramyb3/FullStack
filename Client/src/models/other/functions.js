import axios from "axios";
import { useNavigate } from "react-router-dom";

export async function apiCalls(method, url, data) {
  const resp = await axios({
    method,
    url: `${process.env.REACT_APP_API_SERVER}/${url}`,
    ...(data && { data }),
  });

  return resp.data;
}

export function useSessionCheck() {
  const navigate = useNavigate();

  const sessionCheck = (data) => {
    if (data.name != "admin") {
      if (Date.now() - data.time >= data.timeOut) {
        alert("YOUR TIME IS UP!!");
        navigate("/");
      }
    }
  };

  return { sessionCheck };
}
