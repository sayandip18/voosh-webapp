const { MongoClient } = require("mongodb");
const { video_urls } = require("../utils/traning_video_urls");
const { RDC_video, Serviceability_video, MFR_video, Ratings_video } =
  video_urls;
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const documentName = "operationsdb";

// ! serviceability_score fix krna hai cuz right now it is config manually
const operationalHealthMongoDBData = async (
  res_id,
  number,
  resultType,
  startDate,
  endDate,
  year
) => {
  let query = {};
  let rdc_query = {};
  let mfr_query = {};
  let ratings_query = {};
  // ! temp use
  let serviceability_query = {};

  // ? Query for week
  if (resultType === "week") {
    rdc_query = {
      zomato_res_id: `${res_id}`,
      week_no: parseInt(number),
      year: parseInt(year),
    };
    mfr_query = {
      zomato_res_Id: `${res_id}`,
      week_no: parseInt(number),
      year: parseInt(year),
    };
    ratings_query = {
      zomato_id: parseInt(res_id),
      week_no: parseInt(number),
      // week_no:2,
      year_no: parseInt(year),
    };
    // ! temp use
    serviceability_query = {
      // nomenclature:"Chettinad food house",
      nomenclature:
        parseInt(res_id) === 256302 || parseInt(res_id) === 56834
          ? "Chettinad food house"
          : "No nomenclature",
      week_no: parseInt(number),
      year_no: parseInt(year),
    };
  }
  // ? Query for month
  else if (resultType === "month") {
    rdc_query = {
      zomato_res_id: `${res_id}`,
      month_no: parseInt(number),
      year: parseInt(year),
    };
    mfr_query = {
      zomato_res_Id: `${res_id}`,
      month_no: parseInt(number),
      year: parseInt(year),
    };
    ratings_query = {
      zomato_id: parseInt(res_id),
      month_no: parseInt(number),
      year_no: parseInt(year),
    };
    // ! temp use
    serviceability_query = {
      // nomenclature:"Chettinad food house",
      nomenclature:
        parseInt(res_id) === 256302 || parseInt(res_id) === 56834
          ? "Chettinad food house"
          : "No nomenclature",
      month_no: parseInt(number),
      year_no: parseInt(year),
    };
  }
  // ? Query for Custom Range
  else if (resultType === "Cumstom Range") {
    rdc_query = {
      zomato_res_id: `${res_id}`,
      date: { $gte: startDate, $lte: endDate },
    };
    mfr_query = {
      zomato_res_Id: `${res_id}`,
      date: { $gte: startDate, $lte: endDate },
    };
  }
  // ? Error while providing wrong query
  else {
    query = {
      dataPresent: false,
    };
  }

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    // console.log(query, "query");
    // console.log(mfr_query, "mfr_query");
    // console.log(serviceability_query, "serviceability_query");
    // console.log(rdc_query, "rdc_query");
    console.log(ratings_query, "ratings_query");

    // ! Operational Health Serviceability
    const serviceability = await db
      .collection("zomato_kitchen_servicibility_products")
      .aggregate([
        {
          $match: serviceability_query,
        },
        {
          $group: {
            _id: "$nomenclature",
            oh_serviceability: { $avg: "$kicthen_servicibility" },
          },
        },
      ])
      .toArray();

    // !Operational Health RDC
    const rdc_score = await db
      .collection("zomato_rdc_products_test")
      .aggregate([
        {
          $match: rdc_query,
        },
        {
          $group: {
            _id: "$zomato_res_id",
            rdc_score: { $avg: "$rdc" },
          },
        },
      ])
      .toArray();

    // ! Operational Health Rating
    const rating = await db
      .collection("zomato_static_rating_products")
      .aggregate([
        {
          $match: ratings_query,
        },
        // {
        //   $group: {
        //     _id: "$zomato_id",
        //     rating_score: { $avg: "$delivery_ratings" },

        //   },
        // },
      ])
      .toArray();

    // !Operational Health MFR
    const mfr_score = await db
      .collection("zomato_mfr_products_test")
      .aggregate([
        {
          $match: mfr_query,
        },
        {
          $group: {
            _id: "$zomato_res_Id",
            mfr_score: { $avg: "$mfr" },
          },
        },
      ])
      .toArray();

    console.log("*****************--------------------********************");
    console.log("serviceability: ", serviceability);
    console.log("rdc_score", rdc_score);
    console.log("mfr_score", mfr_score);
    console.log("rating", rating);
    console.log(
      "****************-------------------------*********************"
    );

    client.close();

    return {
      serviceability_score: serviceability[0]?.oh_serviceability,
      rdc_score: rdc_score[0]?.rdc_score,
      mfr_score: mfr_score[0]?.mfr_score,
    };
  } catch (err) {
    console.log(err);
    return {
      error: err,
    };
  }
};

const operationHealthDataFormatter = async (
  res_id,
  number,
  resultType,
  startDate,
  endDate,
  year
) => {
  try {
    const data = await operationalHealthMongoDBData(
      res_id,
      number,
      resultType,
      startDate,
      endDate,
      year
    );
    const { rdc_score, mfr_score, serviceability_score, oh_score } = data;

    const ohManually = calculateOHScoreManually({
      rdc_score,
      mfr_score,
      serviceability_score,
    });

    console.log("ohManually", ohManually);

    const operationHealth = {
      operationHealthMain: {
        name: "Operation Health",
        type: "percentage",
        info: "Operation Health >= 95% Gets more orders",
        benchmark: 95,
        value:
          oh_score === undefined
            ? ohManually != 0 && ohManually === ohManually
              ? ohManually
              : 0
            : oh_score * 16.67,
        isDataPresent:
          oh_score === undefined
            ? ohManually != 0 && ohManually === ohManually
              ? true
              : false
            : true,
      },
      operationHealthData: [
        // ?Swiggy_Kitchen_Servicibility
        {
          name: "Rest. Serviceability",
          type: "percentage",
          // info: "if your restaurent serviceability score is greater than 99% then it will get more orders",
          info: "Operation Health >= 99% Gets more orders",
          benchmark: 99,
          compareThen: "grater",
          videoLink: Serviceability_video,
          recommendations: ["Get the serviceability notification service"],
          value:
            serviceability_score === undefined
              ? "Please wait! We are working on It."
              : parseInt(serviceability_score),
          isDataPresent: serviceability_score === undefined ? false : true,
        },
        // ?Swiggy_RDC
        {
          name: "Rest. Cancellations",
          type: "percentage",
          // info: "if your restaurent cancellation score is less than 5% then it will get more orders",
          info: "Cancellation Charges <= 5% Gets more orders",
          benchmark: 5,
          compareThen: "less",
          videoLink: RDC_video,
          recommendations: [
            "Ensure Restaurant open at the given timings to swiggy and zomato",
            "Ensure stock of best seller items always ready. Click <<here>> for list of items that are getting cancelled often because of stock outs",
          ],
          value:
            rdc_score === undefined
              ? "Please wait! We are working on It."
              : parseInt(rdc_score * 100),
          isDataPresent: rdc_score === undefined ? false : true,
        },
        // ?Swiggy_MFR
        {
          name: "MFR Accuracy",
          type: "percentage",
          // info: "MFR Accuracy grate than 95% to get more orders",
          info: "MFR Accuracy >=95 Gets more orders",
          benchmark: 95,
          compareThen: "grater",
          videoLink: MFR_video,
          recommendations: [
            "Press food ready button only when food prepared, not before",
            "If you forget to mark food ready, take the MFR calling service. Tap here!",
          ],
          value:
            mfr_score === undefined
              ? "Please wait! We are working on It."
              : parseInt(mfr_score),
          isDataPresent: mfr_score === undefined ? false : true,
        },
      ],
    };
    return operationHealth;
  } catch (err) {
    return {
      error: err,
      Error_: "Error in operationHealthDataFormatter",
    };
  }
};

module.exports = {
  operationHealthDataFormatter,
};

function calculateOHScoreManually({
  serviceability_score,
  rdc_score,
  igcc_score,
  rating_score,
  mfr_score,
  acceptance_score,
}) {
  console.log("*****************--------------------********************");
  console.log("serviceability_score", serviceability_score);
  console.log("rdc_score", rdc_score);
  console.log("igcc_score", igcc_score);
  console.log("rating_score", rating_score);
  console.log("mfr_score", mfr_score);
  console.log("acceptance_score", acceptance_score);
  console.log("****************-------------------------*********************");
  let score = 0;
  let count = 0;
  if (serviceability_score !== undefined) {
    count += 1;
    if (serviceability_score >= 95) {
      score += 0.5;
    } else {
      score += 0;
    }
  }

  if (rdc_score !== undefined) {
    count += 1;
    if (rdc_score < 5) {
      score += 0.5;
    } else {
      score += 0;
    }
  }

  if (rating_score !== undefined) {
    count += 1;
    if (rating_score >= 4.5) {
      score += 0.5;
    } else {
      score += 0;
    }
  }

  if (mfr_score !== undefined) {
    count += 1;
    if (mfr_score >= 95) {
      score += 0.5;
    } else {
      score += 0;
    }
  }

  if (igcc_score !== undefined) {
    count += 1;
    if (igcc_score <= 1) {
      score += 0.5;
    } else {
      score += 0;
    }
  }

  if (acceptance_score !== undefined) {
    count += 1;
    if (acceptance_score >= 99) {
      score += 0.5;
    } else {
      score += 0;
    }
  }

  console.log("score", score);
  console.log("count", count);
  // ! if Nan then no data is present
  console.log(score * (200 / count));

  return score * (200 / count);
}
