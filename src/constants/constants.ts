import { Ball } from "../components/BilliardsGame";

export const RESTITUTION = 0.95;
export const BALL_SPEED = 15;
export const MIN_BALL_SPEED = 0.07;

export enum Colors {
  Orange = "#DC7633",
  Gold = "#D4AC0D",
  BlueGray = "#283747",
  DarkGreen = "#145A32",
}

export const INITIAL_BALLS: Ball[] = [
  {
    id: 1,
    x: 100,
    y: 100,
    radius: 30,
    color: Colors.Orange,
    dx: 0,
    dy: 0,
  },
  {
    id: 2,
    x: 300,
    y: 100,
    radius: 40,
    color: Colors.Gold,
    dx: 0,
    dy: 0,
  },
  {
    id: 3,
    x: 300,
    y: 400,
    radius: 40,
    color: Colors.BlueGray,
    dx: 0,
    dy: 0,
  },
];
