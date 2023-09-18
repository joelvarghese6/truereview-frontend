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
import { useWallet } from "@solana/wallet-adapter-react";
import toast, { Toaster } from "react-hot-toast";
import Head from "next/head";
import { createTokenAccount, transferTokens, burnTokens } from "@/components/metaplex";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import returnkey from "@/components/env";

interface MovieReview {
  id: string;
  user: string;
  rating: number;
  text: string;
  upvotes: number;
  downvotes: number;
  pubkey: string;
}

interface Movie {
  id: string;
  name: string;
  rating: number;
  posterUrl: string;
}

const ReviewPage: React.FC = () => {
  const { connected, publicKey } = useWallet();
  // Example movie reviews data
  const [reviews, setReviews] = useState<MovieReview[]>([
    {
      id: "one",
      user: "User1",
      rating: 4,
      text: "This movie is amazing!",
      upvotes: 10,
      downvotes: 2,
      pubkey: "kl",
    },
    {
      id: "two",
      user: "User2",
      rating: 2,
      text: "I didn't like this movie at all.",
      upvotes: 5,
      downvotes: 3,
      pubkey: "jk",
    },
    // Add more reviews as needed
  ]);

  const movies = [
    {
      id: "one",
      name: "Morbius",
      rating: 4.5,
      posterUrl:
        "https://e1.pxfuel.com/desktop-wallpaper/49/663/desktop-wallpaper-new-movie-posters-hollywood-movie-2022.jpg",
    },
    {
      id: "two",
      name: "Fast X",
      rating: 4.2,
      posterUrl:
        "https://filmjabber.com/movie-poster-thumbs/fast-x-movie-poster-7113.jpg",
    },
    {
      id: "three",
      name: "Kraven the Hunter",
      rating: 4.8,
      posterUrl:
        "https://www.joblo.com/wp-content/uploads/2022/05/kraven-the-hunter-poster-400x600.jpg",
    },
    {
      id: "four",
      name: "Bhoot Police",
      rating: 4.0,
      posterUrl:
        "https://e1.pxfuel.com/desktop-wallpaper/322/698/desktop-wallpaper-upcoming-hindi-film-movie-posters-bollywood-2022-movie.jpg",
    },
  ];

  const router = useRouter();
  const id = router.query.movieID;
  const [movie, setMovie] = useState<Movie>({
    id: "four",
    name: "Bhoot Police",
    rating: 4.0,
    posterUrl:
      "https://e1.pxfuel.com/desktop-wallpaper/322/698/desktop-wallpaper-upcoming-hindi-film-movie-posters-bollywood-2022-movie.jpg",
  });

  useEffect(() => {
    const movieId = id;
    const foundMovie = movies.find((m) => m.id === movieId);
    if (foundMovie) {
      setMovie(foundMovie);
    }
  }, [id]);

  useEffect(() => {
    const url =
      "https://m0xr4lz01f.execute-api.ap-south-1.amazonaws.com/helius-get-reviews";
    const movieId = id;
    fetch(url, { method: "POST", body: JSON.stringify({ movieId }) })
      .then((response) => response.json())
      .then((data) => {
        const items = data.Items;
        const newArray = items.map((e: any) => {
          return {
            id: e.SK,
            user: e.tokenAcc,
            rating: e.rating,
            text: e.review,
            upvotes: e.upvote,
            downvotes: e.downvote,
            pubkey: e.userPubKey,
          }
        })
        setReviews(newArray)
      });
  },[]);

  function generateRandomString(length: number) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset.charAt(randomIndex);
    }
  
    return randomString;
  }

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
    if (!connected) {
      toast("Connect you wallet first", { duration: 1800 });
      return;
    }
    setOpenDialog(true);
  }

  // Function to upvote a review
  const upvoteReview = async (ids: string) => {
    if (!connected) {
      toast("connect your wallet")
      return
    }
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"), {
      commitment: "confirmed",
    });

    const mintaddr = "8UB2WSuBdRRRN4QzPPVTNFDph3cVLMPSA1Noe6SbnorC";
    const mint = new web3.PublicKey(mintaddr);
    const secret = returnkey();
    const secretKey = Uint8Array.from(secret);
    const user = web3.Keypair.fromSecretKey(secretKey);

    const pubKey = new web3.PublicKey(publicKey!.toString());

    const tokenAccount = await createTokenAccount(
      connection,
      user,
      mint,
      user.publicKey // Associating our address with the token account
    );

    const receiverTokenAccount = await createTokenAccount(
      connection,
      user,
      mint,
      pubKey // Associating our address with the token account
    );
    await transferTokens(
      connection,
      user,
      tokenAccount.address,
      receiverTokenAccount.address,
      user.publicKey,
      10,
      mint
  )
    const updatedReviews = reviews.map((review) => {
      if (review.id === ids) {
        const url = "https://m0xr4lz01f.execute-api.ap-south-1.amazonaws.com/helius-upvote-downvote"
        const movieId = id
        const userPubKey = publicKey?.toString()
        fetch(url, {method: "POST", body: JSON.stringify({vote: "up", movieId, userPubKey})})
        return { ...review, upvotes: review.upvotes + 1 };
      }
      return review;
    });
    setReviews(updatedReviews);
  };

  // Function to downvote a review
  const downvoteReview = async (ids: string) => {
    if (!connected) {
      toast("connect your wallet")
      return
    }
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"), {
      commitment: "confirmed",
    });

    const mintaddr = "8UB2WSuBdRRRN4QzPPVTNFDph3cVLMPSA1Noe6SbnorC";
    const mint = new web3.PublicKey(mintaddr);
    const secret = returnkey();
    const secretKey = Uint8Array.from(secret);
    const user = web3.Keypair.fromSecretKey(secretKey);

    const pubKey = new web3.PublicKey(publicKey!.toString());

    const tokenAccount = await createTokenAccount(
      connection,
      user,
      mint,
      pubKey // Associating our address with the token account
    );

    await burnTokens(connection, user, tokenAccount.address, mint, user, 5)
    const updatedReviews = reviews.map((review) => {
      if (review.id === ids) {
        const url = "https://m0xr4lz01f.execute-api.ap-south-1.amazonaws.com/helius-upvote-downvote"
        const movieId = id
        const userPubKey = publicKey?.toString()
        fetch(url, {method: "POST", body: JSON.stringify({vote: "down", movieId, userPubKey})})
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

  const addNewReview = async (korr: Movie) => {
    const date = new Date();
    const url =
      "https://m0xr4lz01f.execute-api.ap-south-1.amazonaws.com/helius-add-new-review";
    await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        userPubKey: publicKey?.toString(),
        rating: newReview.rating,
        review: newReview.text,
        timestamp: date.getTime(),
        movieId: korr?.id,
        pubkey: publicKey?.toString(),
      }),
    });

    if (newReview.text.length === 0) {
      toast("Review field is empty", { duration: 1800 });
      return;
    }
    setOpenDialog(false);
    const movie = {
      id: generateRandomString(10),
      user: "User2",
      rating: newReview.rating,
      text: newReview.text,
      upvotes: 0,
      downvotes: 0,
      pubkey: "hj",
    };
    setReviews((prevList) => [...prevList, movie]);
    setNewReview({ rating: 1, text: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Head>
        <title>{movie.name}</title>
        <meta
          name="description"
          content="The best movie review Dapp out there"
        />
      </Head>
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
        <DialogTitle>Add new review</DialogTitle>
        <DialogContent>
          <DialogContentText>Here you can add your review</DialogContentText>
          <div className="mb-4">
            <label className="block text-gray-700">Rating:</label>
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={(e) => {
                if (Number(e.target.value) > 5) {
                  setNewReview({ ...newReview, rating: 5 });
                } else {
                  setNewReview({
                    ...newReview,
                    rating: Number(e.target.value),
                  });
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Review Text:</label>
            <textarea
              name="text"
              value={newReview.text}
              onChange={(e) =>
                setNewReview({ ...newReview, text: e.target.value })
              }
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => addNewReview(movie)}
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
