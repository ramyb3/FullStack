import { useEffect, useState } from "react";

export default function Comp(props) {
  const [check, setCheck] = useState(false);

  useEffect(() => {
    for (let i = 0; i < props.subs.length; i++) {
      for (let j = 0; j < props.subs[i].Movies.length; j++) {
        if (props.subs[i].Movies[j].MovieId == props.data._id) {
          setCheck(true);
          break;
        }
      }

      if (check) {
        break;
      }
    }
  }, [props]);

  return (
    <div>
      {check ? (
        <> The Members Who Watched This Movie:</>
      ) : (
        <> No One Watched This Movie!!</>
      )}
    </div>
  );
}
