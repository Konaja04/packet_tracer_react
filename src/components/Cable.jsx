import React, { useState } from "react";
import TextField from "@mui/material/TextField";

const Cable = ({ from, to, peso }) => {
  const [weight, setWeight] = useState("");

  if (!to) return null;

  const x1 = from.x;
  const y1 = from.y;
  const x2 = to.x;
  const y2 = to.y;
  const abbreviateInterface = (interfaceName) => {
    if (interfaceName.startsWith("GigabitEthernet")) {
      return `G${interfaceName.slice(15)}`;
    } else if (interfaceName.startsWith("FastEthernet")) {
      return `F${interfaceName.slice(12)}`;
    }
    return interfaceName;
  };
  const abbreviatedFromInterface = abbreviateInterface(from.interface);
  const abbreviatedToInterface = abbreviateInterface(to.interface);
  const offset = 80;
  const angle = Math.atan2(y2 - y1, x2 - x1);

  const fromTextX = x1 + Math.cos(angle) * offset;
  const fromTextY = y1 + Math.sin(angle) * offset;
  const toTextX = x2 - Math.cos(angle) * offset;
  const toTextY = y2 - Math.sin(angle) * offset;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // const handleWeightChange = (e) => {
  //   setWeight(e.target.value);
  //   onWeightChange(e.target.value);
  // };

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="3" />
      <text x={fromTextX} y={fromTextY} fill="red" dx="5" dy="-5">
        {abbreviatedFromInterface}
      </text>
      <text x={toTextX} y={toTextY} fill="blue" dx="5" dy="-5">
        {abbreviatedToInterface}
      </text>


      <text x={midX - 20} y={midY - 10} fill="red" dx="5" dy="-5">
        {peso}
      </text>

    </svg>
  );
};

export default Cable;
