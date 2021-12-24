import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

const Card = ({ name, value, benchmark, info, compareType }) => {
  const resultType = useSelector((state) => state.data.resultType);

  let finalValue;
  let colorName="green";
  console.log(resultType, compareType);

  // if (compareType === "yes or no") {
  //   colorName = value.toLowerCase() === "yes" ? "green" : "red";
  // } else if (compareType === "present or not prensent") {
  //   colorName = value.toLowerCase() === "present" ? "green" : "red";
  // } else if (compareType === "applicable or not applicable") {
  //   // ? spelling mistake, applicable! not aplicable
  //   colorName = value.toLowerCase() === "aplicable" ? "green" : "red";
  // } else if (compareType === "high medium or low") {
  //   colorName =
  //     value.toLowerCase() === "high" || value.toLowerCase() === "medium"
  //       ? "green"
  //       : "red";
  // } else if (compareType === "grater") {
  //   colorName = value >= benchmark ? "green" : "red";
  // }

  console.log(colorName, "colorName");

  return (
    <div className="card">
      <div className="card__text">
        <h5 className="card__text--heading">{name}</h5>

        <div className="card__text--info">
          <p>{info}</p>
        </div>
        {/* //!Error if value not presen */}
        {value !== "working on it" && (
          <div className={`value ${colorName}`}>{value===undefined?"working on it":value}</div>
        )}
        {value === "working on it" && (
          <div className=''>working on it...</div>
        )}
      </div>
      {/* <Link
        to={`${name.replace(/\s/g, "")}`}
        state={{
          name,
          value,
          benchmark,
          // compareThen,
          // videoLink,
          // recommendations,
          // type,
        }}
        className="card__btn"
      >
        <span className="card__btn--text">Know more</span>
        <AiOutlineRight className="card__btn--icon" />
      </Link> */}
    </div>
  );
};

export default Card;
