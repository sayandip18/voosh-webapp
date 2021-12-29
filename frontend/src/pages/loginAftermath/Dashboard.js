import React from "react";
import Card from "../../components/loginAftermath/Card";
import { BsBagCheckFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { getTopSuggestionsProvider } from "../../utils/getTopSuggestionsProvider";

const Dashboard = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const resultType = useSelector((state) => state.data.resultType);

  const operationHealth = data[currentProductIndex]["operationHealth"];
  const { operationHealthMain, operationHealthData } = operationHealth;

  const { listingScoreMain, listingScoreData } =
    data[currentProductIndex]["listingScore"];
  const revenue = data[currentProductIndex]["revenue"];

  // ! get top 5 suggestions
  let getTopSuggestions = getTopSuggestionsProvider(
    operationHealthData,
    listingScoreData
  );
  getTopSuggestions =
    getTopSuggestions.length > 5
      ? getTopSuggestions.slice(0, 5)
      : getTopSuggestions;
  const topSuggestions = [...getTopSuggestions];

  // console.log(topSuggestions, "top suggestions");

  return (
    <>
      <div className="dashboard-cards">
        {/* //? Revenue */}
        <Card
          iconName={"bar"}
          name={"Revenue"}
          info={"Get your Revenue and Deduction Details!"}
          cardStatistics={{
            // ! if prev month is null then show 0
            value: revenue.value,
            change: null,
            benchmark: null,
            changeTypeDirection: "up",
            type: "money",
            isDataPresent: revenue.value !== "data not present",
          }}
        />
        {/* //? Operation Health */}
        <Card
          iconName={"bar"}
          name={"Operation Health"}
          info={"Understand your Operation Health and Metrics!"}
          cardStatistics={{
            value: operationHealthMain.value,
            benchmark: operationHealthMain.benchmark,
            type: operationHealthMain.type,
            changeTypeDirection: !operationHealthMain.isDataPresent
              ? "up"
              : operationHealthMain.value >= operationHealthMain.benchmark
              ? "up"
              : "down",
            change: operationHealthMain.benchmark,
            isDataPresent: operationHealthMain.isDataPresent,
          }}
        />
        {/* //?List Score */}
        <Card
          iconName={"bar"}
          name={"Listing Score"}
          info={"Understand how your online Swiggy listing is performing!"}
          cardStatistics={{
            value: listingScoreMain.value,
            benchmark: listingScoreMain.benchmark,
            type: listingScoreMain.type,
            changeTypeDirection: !listingScoreMain.isDataPresent
              ? "up"
              : listingScoreMain.value >= listingScoreMain.benchmark
              ? "up"
              : "down",
            // changeTypeDirection: listingScoreMain - 90 > 0 ? "up" : "down",
            change: listingScoreMain.benchmark,
            isDataPresent: listingScoreMain.isDataPresent,
          }}
        />
      </div>
      <div className="dashboard-bottom">
        <div className="dashboard-bottom__heading">
          Some tutorials for your business
        </div>
        <div className="dashboard-bottom__videos">
          <div className="single-video">
            <ReactPlayer
              // className="single-video"
              url="https://www.youtube.com/watch?v=MIsi4vdzjgk"
              controls
              playbackRate={1}
              width="100%"
              height="240px"
            />
          </div>
          <div className="single-video">
            <ReactPlayer
              // className="single-video"
              url="https://www.youtube.com/watch?v=QN1GGCNMOY4"
              controls
              playbackRate={1}
              width="310px"
              height="240px"
            />
          </div>
          <div className="single-video">
            <ReactPlayer
              // className="single-video"
              url="https://www.youtube.com/watch?v=w3RqWoQa19M"
              controls
              playbackRate={1}
              width="310px"
              height="240px"
            />
          </div>
     
        </div>
        <div className="recomendation">
          <div className="recomendation__heading">
            <span className="icon">
              <BsBagCheckFill />
            </span>
            <span className="text">Top Suggestion</span>
          </div>
          {topSuggestions.length > 0 &&
            topSuggestions.map((item, index) => {
              return (
                <div key={index} className="recomendation__list">
                  {item}
                </div>
              );
            })}
          {topSuggestions.length === 0 && (
            <div className="no_recomendation">
              <div className="">
                <span className="text_1">Your business is doing great!</span>
                <br />
                <span className="text_2">
                  No Suggestions for you in this {resultType}.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
