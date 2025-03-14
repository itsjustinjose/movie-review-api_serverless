import { marshall } from "@aws-sdk/util-dynamodb";
import { movieReview } from "./types";

export const generateMovieReviewItem = (review: movieReview) => {
  return {
    PutRequest: {
      Item: marshall(review),
    },
  };
};

export const generateBatch = (data: movieReview[]) => {
  return data.map((e) => {
    return generateMovieReviewItem(e);
  });
};