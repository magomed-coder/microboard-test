import { Ball } from "../components/BilliardsGame";
import {
  BALL_SPEED,
  Colors,
  MIN_BALL_SPEED,
  RESTITUTION,
} from "../constants/constants";

export const handleBallClick = (
  clickX: number,
  clickY: number,
  balls: Ball[],
  startBallMovement: (ball: Ball, clickX: number, clickY: number) => void
) => {
  balls.forEach((ball) => {
    const distance = Math.sqrt((clickX - ball.x) ** 2 + (clickY - ball.y) ** 2);

    if (distance <= ball.radius) {
      startBallMovement(ball, clickX, clickY);
    }
  });
};

export const startBallMovement = (
  ball: Ball,
  clickX: number,
  clickY: number
) => {
  const dx = clickX - ball.x;
  const dy = clickY - ball.y;
  const distance = Math.sqrt(dx ** 2 + dy ** 2);
  ball.dx = (dx / distance) * BALL_SPEED;
  ball.dy = (dy / distance) * BALL_SPEED;
};

export const updateBalls = (
  balls: Ball[],
  setBalls: React.Dispatch<React.SetStateAction<Ball[]>>,
  width: number,
  height: number,
  restitution: number
) => {
  setBalls((prevBalls) =>
    prevBalls.map((ball, index) => {
      handleBallMovement(ball);
      handleBoundaryCollision(ball, width, height, restitution);
      handleBallCollision(ball, balls, index);

      return ball;
    })
  );
};

const handleBallMovement = (ball: Ball) => {
  ball.x += ball.dx;
  ball.y += ball.dy;
};

export const drawCanvas = (
  context: CanvasRenderingContext2D,
  balls: Ball[],
  canvasWidth: number,
  canvasHeight: number
) => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = Colors.DarkGreen;
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  balls.forEach((ball) => {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = ball.color;
    context.fill();
    context.closePath();
  });
};

export const handleBoundaryCollision = (
  ball: Ball,
  canvasWidth: number,
  canvasHeight: number,
  restitution: number
) => {
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvasWidth) {
    ball.dx *= -restitution;
    ball.x >= canvasWidth - ball.radius
      ? (ball.x = canvasWidth - ball.radius)
      : (ball.x = 0 + ball.radius);

    if (Math.abs(ball.dx) < MIN_BALL_SPEED) ball.dx = 0;
  }
  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvasHeight) {
    ball.dy *= -restitution;
    ball.y > canvasHeight - ball.radius
      ? (ball.y = canvasHeight - ball.radius)
      : (ball.y = 0 + ball.radius);

    if (Math.abs(ball.dy) < MIN_BALL_SPEED) ball.dy = 0;
  }
};

const handleBallCollision = (ball: Ball, balls: Ball[], index: number) => {
  for (let i = index + 1; i < balls.length; i++) {
    const otherBall = balls[i];
    const dx = otherBall.x - ball.x;
    const dy = otherBall.y - ball.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    if (distance <= ball.radius + otherBall.radius) {
      handleCollision(ball, otherBall, dx, dy);
    }
  }
};

export const handleCollision = (
  ball: Ball,
  otherBall: Ball,
  dx: number,
  dy: number
) => {
  const angle = Math.atan2(dy, dx);
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  const v1n = ball.dx * cos + ball.dy * sin;
  const v2n = otherBall.dx * cos + otherBall.dy * sin;

  const v1nFinal =
    ((ball.radius - otherBall.radius) * v1n + 2 * otherBall.radius * v2n) /
    (ball.radius + otherBall.radius);
  const v2nFinal =
    ((otherBall.radius - ball.radius) * v2n + 2 * ball.radius * v1n) /
    (ball.radius + otherBall.radius);

  const v1nAfter = v1nFinal * RESTITUTION;
  const v2nAfter = v2nFinal * RESTITUTION;

  ball.dx = v1nAfter * cos - ball.dy * sin;
  ball.dy = v1nAfter * sin + ball.dy * cos;
  otherBall.dx = v2nAfter * cos - otherBall.dy * sin;
  otherBall.dy = v2nAfter * sin + otherBall.dy * cos;
};
