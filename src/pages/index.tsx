// src/FrontPage.js
import React from "react";
import Link from "next/link";
import Head from "next/head";
import returnkey from "@/components/env";
//import { useDispatch, useSelector } from 'react-redux';
//import { authAction } from '../store';

const HomePage = () => {
  // Example movie data for "New Movies in Theaters" and "New Movies on OTT"
  const newMoviesInTheaters = [
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
    // Add more movies as needed
  ];

  const newMoviesOnOTT = [
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
    // Add more movies as needed
  ];

  return (
    <>
      <Head>
        <title>True review</title>
        <meta
          name="description"
          content="The best movie review Dapp out there"
        />
      </Head>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl text-gray-800 font-semibold mb-4">
            New Movies in Theaters
          </h1>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {newMoviesInTheaters.map((movie) => (
              <div key={movie.id} className="bg-white p-4 rounded-lg shadow-md">
                <Link href={`/movies/${movie.id}`}>
                  <img
                    src={movie.posterUrl}
                    alt={movie.name}
                    className="w-full h-48 object-cover mb-2"
                  />
                  <h2 className="text-gray-600 text-lg font-semibold">
                    {movie.name}
                  </h2>
                  <p className="text-gray-600">Rating: {movie.rating}</p>
                </Link>
              </div>
            ))}
          </div>

          <h1 className="text-3xl text-gray-800 font-semibold mt-8 mb-4">
            New Movies on OTT
          </h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {newMoviesOnOTT.map((movie) => (
              <div key={movie.id} className="bg-white p-4 rounded-lg shadow-md">
                <Link href={`/movies/${movie.id}`}>
                  <img
                    src={movie.posterUrl}
                    alt={movie.name}
                    className="w-full h-48 object-cover mb-2"
                  />
                  <h2 className="text-gray-600 text-lg font-semibold">
                    {movie.name}
                  </h2>
                  <p className="text-gray-600">Rating: {movie.rating}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
