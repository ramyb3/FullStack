import { useEffect, useState } from "react";

export default function Comp(props) {
  const [check, setCheck] = useState(false);

  useEffect(() => {
    for (var i = 0; i < props.subs.length; i++) {
      if (props.subs[i].MemberId == props.props._id) {
        setCheck(true);
        break;
      }
    }
  }, [props]);

  return (
    <div>
      {check == true ? (
        <> The Movies This Member Watched:</>
      ) : (
        <> This Member Didn't Watched Any Movie!!</>
      )}
    </div>
  );
}
