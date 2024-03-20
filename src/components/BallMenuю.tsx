import { useEffect, useState } from "react";
import { Ball } from "./BilliardsGame";

interface BallMenuProps {
  ball: Ball;
  onSelectColor: (color: string, ballID: number) => void;
}

const BallMenu: React.FC<BallMenuProps> = ({ ball, onSelectColor }) => {
  const [color, setColor] = useState<string>(ball.color);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSelectColor(color, ball.id);
    }, 200);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
  };

  const menuX = ball.x + ball.radius + 10;
  const menuY = ball.y - ball.radius;

  return (
    <div
      className="ball-menu"
      style={{
        left: menuX,
        top: menuY,
      }}
    >
      <input
        type="color"
        id="body"
        name="body"
        value={color}
        onChange={handleColorChange}
      />
    </div>
  );
};

export default BallMenu;
