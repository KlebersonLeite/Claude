import "./index.css";
import { Composition } from "remotion";
import { OnCredPromo } from "./OnCredPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OnCredPromo"
        component={OnCredPromo}
        durationInFrames={450}
        fps={30}
        width={720}
        height={1280}
      />
    </>
  );
};
