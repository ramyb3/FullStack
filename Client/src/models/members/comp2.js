import { useEffect, useState } from "react";

export default function Comp(props) {
  const [check, setCheck] = useState(false);

  useEffect(() => {
    for (let i = 0; i < props.subs.length; i++) {
      if (props.subs[i].MemberId == props.data._id) {
        setCheck(true);
        break;
      }
    }
  }, [props]);

  return check
    ? "The Movies This Member Watched:"
    : "This Member Didn't Watched Any Movie!!";
}
