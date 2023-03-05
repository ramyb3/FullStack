import { useEffect, useState } from "react";

export default function Comp(props) {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(props.movies);

    const arr = [];
    const sub = props.subs.find((data) => data.MemberId == props.data._id);

    if (sub) {
      for (let i = 0; i < sub.Movies.length; i++) {
        arr.push(sub.Movies[i].MovieId);
      }

      setList(props.movies.filter((data) => !arr.includes(data._id)));
    }
  }, [props]);

  return (
    <select onChange={(e) => props.callback(e)}>
      <option value="">--Select Movie--</option>

      {list.map((data, index) => {
        return (
          <option key={index} value={data.Name}>
            {data.Name}
          </option>
        );
      })}
    </select>
  );
}
