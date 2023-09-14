// src/ReviewPage.tsx
import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/router";

interface MovieReview {
  id: number;
  user: string;
  rating: number;
  text: string;
  upvotes: number;
  downvotes: number;
}

interface Movie {
  id: number;
  name: string;
  rating: number;
  posterUrl: string;
}

const ReviewPage: React.FC = () => {
  // Example movie reviews data
  const [reviews, setReviews] = useState<MovieReview[]>([
    {
      id: 1,
      user: "User1",
      rating: 4,
      text: "This movie is amazing!",
      upvotes: 10,
      downvotes: 2,
    },
    {
      id: 2,
      user: "User2",
      rating: 2,
      text: "I didn't like this movie at all.",
      upvotes: 5,
      downvotes: 3,
    },
    // Add more reviews as needed
  ]);

  const movies = [
    {
      id: 1,
      name: "Morbius",
      rating: 4.5,
      posterUrl:
        "https://e1.pxfuel.com/desktop-wallpaper/49/663/desktop-wallpaper-new-movie-posters-hollywood-movie-2022.jpg",
    },
    {
      id: 2,
      name: "Fast X",
      rating: 4.2,
      posterUrl:
        "https://filmjabber.com/movie-poster-thumbs/fast-x-movie-poster-7113.jpg",
    },
    {
      id: 3,
      name: "Kraven the Hunter",
      rating: 4.8,
      posterUrl:
        "https://www.joblo.com/wp-content/uploads/2022/05/kraven-the-hunter-poster-400x600.jpg",
    },
    {
      id: 4,
      name: "Bhoot Police",
      rating: 4.0,
      posterUrl:
        "https://e1.pxfuel.com/desktop-wallpaper/322/698/desktop-wallpaper-upcoming-hindi-film-movie-posters-bollywood-2022-movie.jpg",
    },
  ];

  const router = useRouter();
  console.log(router.query.movieID);
  const id = router.query.movieID;
  const [movie, setMovie] = useState<Movie>({
    id: 4,
    name: "Bhoot Police",
    rating: 4.0,
    posterUrl:
      "https://e1.pxfuel.com/desktop-wallpaper/322/698/desktop-wallpaper-upcoming-hindi-film-movie-posters-bollywood-2022-movie.jpg",
  });

  useEffect(() => {
    // Ensure "id" is a number (or parse it)
    if (typeof id === "string" && !isNaN(Number(id))) {
      const movieId = Number(id);
      // Find the movie object in the array based on "id"
      const foundMovie = movies.find((m) => m.id === movieId);
      if (foundMovie) {
        setMovie(foundMovie);
      }
    }
  }, [id]);

  //const movie = {name: "hello", posterUrl: "/njjn"}

  console.log(movie);
  // Modal state
  const [openDialog, setOpenDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 1, // Default rating
    text: "",
  });

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  function handleOpenDialog() {
    setOpenDialog(true);
  }

  // Function to upvote a review
  const upvoteReview = (id: number) => {
    const updatedReviews = reviews.map((review) => {
      if (review.id === id) {
        return { ...review, upvotes: review.upvotes + 1 };
      }
      return review;
    });
    setReviews(updatedReviews);
  };

  // Function to downvote a review
  const downvoteReview = (id: number) => {
    const updatedReviews = reviews.map((review) => {
      if (review.id === id) {
        return { ...review, downvotes: review.downvotes + 1 };
      }
      return review;
    });
    setReviews(updatedReviews);
  };

  // Sort reviews by upvotes (highest to lowest)
  const sortedReviews = [...reviews].sort((a, b) => b.upvotes - a.upvotes);

  // Function to handle changes in the new review form
  const handleReviewChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //setOpenDialog(false);
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={movie.posterUrl}
            alt={movie.name}
            className="w-24 h-32 object-cover"
          />
          <h1 className="text-3xl text-gray-800 font-semibold">{movie.name}</h1>
        </div>
        <h2 className="text-2xl text-gray-800 font-semibold mb-4">
          Movie Reviews
        </h2>
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{review.user}</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => upvoteReview(review.id)}
                    className="text-green-600 hover:text-green-800 focus:outline-none"
                  >
                    &#9650; {review.upvotes}
                  </button>
                  <button
                    onClick={() => downvoteReview(review.id)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    &#9660; {review.downvotes}
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mt-2">{review.text}</p>
              <p className="text-gray-600 mt-2">Rating: {review.rating}</p>
            </div>
          ))}
        </div>
        <button
          onClick={handleOpenDialog}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200"
        >
          Add New Review
        </button>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle></DialogTitle>
        <DialogContent>
          <DialogContentText>Add Review</DialogContentText>
          <div className="mb-4">
            <label className="block text-gray-700">Rating:</label>
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={handleReviewChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Review Text:</label>
            <textarea
              name="text"
              value={newReview.text}
              onChange={handleReviewChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleCloseDialog}
          >
            Add review
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleCloseDialog}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReviewPage;
