import { useEffect, useState } from "react";

export default function Comp(props) {
  const [check, setCheck] = useState(false);

  useEffect(() => {
    for (var i = 0; i < props.subs.length; i++) {
      for (var j = 0; j < props.subs[i].Movies.length; j++) {
        if (props.subs[i].Movies[j].MovieId == props.props._id) {
          setCheck(true);
          break;
        }
      }

      if (check == true) break;
    }
  }, [props]);

  return (
    <div>
      {check == true ? (
        <> The Members Who Watched This Movie:</>
      ) : (
        <> No One Watched This Movie!!</>
      )}
    </div>
  );
}
