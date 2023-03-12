import axios from "axios";
import { useNavigate } from "react-router-dom";

export async function apiCalls(method, url, data) {
  try {
    const resp = await axios({
      method,
      url: `${process.env.REACT_APP_API_SERVER}/${url}`,
      ...(data && { data }),
    });

    return resp.data;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export function useFunctions() {
  const navigate = useNavigate();

  const sessionCheck = (data) => {
    if (data.name !== "admin") {
      if (Date.now() - data.time >= data.timeOut) {
        alert("YOUR TIME IS UP!!");
        navigate("/");
      }
    }
  };

  const movieReq = async (link, movie, method, refresh, setLoading) => {
    if (movie.name !== "" && movie.genres.length > 0 && movie.date !== "") {
      setLoading(true);
      await apiCalls("post", `${method}Movie`, movie);

      setTimeout(() => {
        refresh();
        navigate(link);
      }, 5000);
    } else {
      alert("YOU MUST FILL ALL THE FORM!!");
    }
  };

  const memberReq = async (link, member, method, refresh, setLoading) => {
    if (member.name !== "" && member.email !== "" && member.city !== "") {
      setLoading(true);
      await apiCalls("post", `${method}Member`, member);

      setTimeout(() => {
        refresh();
        navigate(link);
      }, 5000);
    } else {
      alert("YOU MUST FILL ALL THE FORM!!");
    }
  };

  const userReq = async (link, user, method, setAdd, setLoading, perm) => {
    if (
      user.Fname !== "" &&
      user.Lname !== "" &&
      user.Uname !== "" &&
      user.session != 0
    ) {
      setLoading(true);

      const obj = { ...user, ...(link !== "" && { perm }) };
      await apiCalls("post", `${method}User`, obj);
      setAdd();
      navigate(link);
    } else {
      alert("YOU MUST FILL ALL THE FORM!!");
    }
  };

  return { sessionCheck, movieReq, memberReq, userReq };
}
