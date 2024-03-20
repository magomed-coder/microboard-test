import React, { useRef, useState, useEffect } from "react";
import { INITIAL_BALLS, RESTITUTION } from "../constants/constants";
import {
  drawCanvas,
  handleBallClick,
  startBallMovement,
  updateBalls,
} from "../utils/utils";
import BallMenu from "./BallMenuю";

export interface Ball {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  dx: number;
  dy: number;
}

const BilliardsGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState<Ball[]>(INITIAL_BALLS);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedBall, setSelectedBall] = useState<Ball>({} as Ball);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const handleAnimationFrame = () => {
      updateBalls(
        balls,
        setBalls,
        canvasRef.current!.width,
        canvasRef.current!.height,
        RESTITUTION
      );

      drawCanvas(
        context,
        balls,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
    };

    requestAnimationFrame(handleAnimationFrame);

    const canvasCleanup = () => {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("contextmenu", handleMouseClick);
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("contextmenu", handleMouseClick);

    return canvasCleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balls]);

  const handleSelectColor = (color: string, ballID: number): void => {
    setBalls((prevBalls) =>
      prevBalls.map((ball) =>
        ball.id === ballID ? { ...ball, color: color } : ball
      )
    );
  };

  const handleClick = (event: MouseEvent) => {
    setShowMenu(false);

    const { offsetX, offsetY } = event;
    handleBallClick(offsetX, offsetY, balls, startBallMovement);
  };

  const handleMouseClick = (event: MouseEvent) => {
    event.preventDefault();

    const { offsetX, offsetY } = event;
    handleRightClick(offsetX, offsetY, balls);
  };

  const handleRightClick = (clickX: number, clickY: number, balls: Ball[]) => {
    balls.forEach((ball) => {
      const distance = Math.sqrt(
        (clickX - ball.x) ** 2 + (clickY - ball.y) ** 2
      );

      if (distance <= ball.radius) {
        setShowMenu(true);
        setSelectedBall(ball);
      }
    });
  };

  return (
    <div className="contaiter">
      <div className="wrapper">
        <canvas
          ref={canvasRef}
          id="billiardsCanvas"
          width={800}
          height={600}
        ></canvas>

        {showMenu && (
          <BallMenu
            onSelectColor={(color: string, ballID: number) =>
              handleSelectColor(color, ballID)
            }
            ball={selectedBall}
          />
        )}
      </div>
    </div>
  );
};

export default BilliardsGame;
