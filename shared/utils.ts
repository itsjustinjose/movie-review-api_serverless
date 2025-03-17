import { marshall } from "@aws-sdk/util-dynamodb";
import { MovieReview } from "./types";
import { CognitoJwtVerifier } from "aws-jwt-verify";

export const generateMovieReviewItem = (review: MovieReview) => {
  return {
    PutRequest: {
      Item: marshall(review),
    },
  };
};

export const generateBatch = (data: MovieReview[]) => {
  return data.map((e) => {
    return generateMovieReviewItem(e);
  });
};

export const getFormattedDate = () => {
  // Create a new Date object
  const date = new Date();

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits for day
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so add 1
  const year = date.getFullYear();

  // Combine into DD-MM-YYYY format
  return `${day}-${month}-${year}`;
};

// Verifier that expects valid access tokens:
export const JWTVerifier = CognitoJwtVerifier.create({
  userPoolId: "eu-west-1_7FobIxYV2",
  tokenUse: "id",
  clientId: "4iqe2s2a613upgg70oqa68d6c5",
});
