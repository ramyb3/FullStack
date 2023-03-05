import { useEffect, useState } from "react";

export default function Subscriptions(props) {
  const [check, setCheck] = useState(false);

  useEffect(() => {
    for (let i = 0; i < props.subs.length; i++) {
      if (props.subs[i].MemberId == props.data._id) {
        setCheck(true);
        break;
      }
    }
  }, [props]);

  return (
    <b>
      {check
        ? "The Movies This Member Watched:"
        : "This Member Didn't Watched Any Movie!!"}
    </b>
  );
}
