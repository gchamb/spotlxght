"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Check } from "lucide-react";

type GenreSelectorProps = {
  selectedGenres: string[];
  setSelectedGenres: Dispatch<SetStateAction<string[]>>;
};

const availableGenres: { genre: string; image: string; alt: string }[] = [
  {
    genre: "Jazz",
    image: "jazz.jpg",
    alt: "guy playing jazz music",
  },
  {
    genre: "Rock",
    image: "rock.jpg",
    alt: "guy playing rock music",
  },
  {
    genre: "EDM",
    image: "edm.jpg",
    alt: "dj playing edm music",
  },
  {
    genre: "Country",
    image: "country.jpg",
    alt: "woman playing country music",
  },
  {
    genre: "Pop",
    image: "pop.jpg",
    alt: "woman singing pop music",
  },
  {
    genre: "Hip Hop",
    image: "hip hop.jpg",
    alt: "man rapping",
  },
  {
    genre: "R&B",
    image: "r&b.jpg",
    alt: "woman singing r&b music",
  },
  {
    genre: "Indie",
    image: "indie.jpg",
    alt: "indie band playing music",
  },
];

export default function GenreSelector({
  selectedGenres,
  setSelectedGenres,
}: GenreSelectorProps) {
  const [matches, setMatches] = useState(false);

  // This is done to conditional render the carousal (horizontal or vertical) based on screen size
  useEffect(() => {
    window
      .matchMedia("(max-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));

    return () =>
      window
        .matchMedia("(max-width: 768px)")
        .removeEventListener("change", () => {});
  }, []);

  const handleGenreSelect = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(
        selectedGenres.filter((anonGenre) => anonGenre != genre),
      );
      return;
    }

    if (selectedGenres.length === 3) {
      return;
    }

    setSelectedGenres([...selectedGenres, genre]);
  };

  return (
    <div className="mx-auto flex w-11/12 flex-col gap-y-16 xl:gap-10">
      <div>
        <h2 className="text-center text-xl">Select your genre</h2>
      </div>

      <Carousel
        className="mx-auto max-w-xl xl:max-w-none"
        orientation={matches ? "vertical" : "horizontal"}
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="h-mobile max-h-mobile -mt-1 xl:-ml-2 xl:-ml-4 xl:h-auto xl:max-h-none xl:p-4">
          {availableGenres.map((genreObj, index) => {
            const shouldShrink = index % 2 === 0;
            const isSelected = selectedGenres.includes(genreObj.genre);
            return (
              <CarouselItem
                key={genreObj.genre}
                className={`relative w-full pt-4 xl:aspect-auto xl:min-h-[600px] xl:max-w-[380px] xl:pl-2 xl:pl-4 ${shouldShrink ? "xl:mt-10" : "xl:pb-10"} cursor-pointer  rounded-xl`}
                onClick={() => handleGenreSelect(genreObj.genre)}
              >
                {isSelected && (
                  <div className="absolute left-4 right-0 top-1/2 z-30 flex justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white">
                      <Check className="text-black" size={36} />
                    </div>
                  </div>
                )}

                <div
                  className={`absolute bottom-16 left-4 right-0  ${!shouldShrink && "bottom-32"} z-20`}
                >
                  <h2 className="text-center text-2xl font-semibold">
                    {genreObj.genre}
                  </h2>
                </div>
                <img
                  className={`h-full w-full rounded-xl object-cover transition duration-150 ease-in  xl:hover:scale-105 ${isSelected && "opacity-60"}`}
                  src={`/images/${genreObj.image}`}
                  alt={genreObj.alt}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
