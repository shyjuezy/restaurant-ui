"use client";

import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { FavoriteMenuItem } from "@/actions/menu";
import { useCallback, useState } from "react";
import { ImageModal } from "../image-modal";

interface FavoritesSectionProps {
  items: FavoriteMenuItem[];
}

export function FavoritesSection({ items }: FavoritesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FavoriteMenuItem | null>(
    null
  );
  const animationDuration = 200;

  const capitalizeFirstLetter = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleOpenModal = useCallback((item: FavoriteMenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, animationDuration);
  }, []);

  return (
    <section className="container py-8 md:py-12">
      <div className="mx-auto px-8 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-6 font-playfair text-primaryDark">
          Our Favorites
        </h2>
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent className="h-96">
            {items.map((item, index) => (
              <CarouselItem
                key={item.id}
                className="md:basis-1/2 lg:basis-1/3 h-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="p-1 h-full"
                >
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center p-0 rounded-md overflow-hidden h-full">
                      <div
                        onClick={() => handleOpenModal(item)}
                        className="relative w-full aspect-square mb-4 h-48 cursor-pointer"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleOpenModal(item)
                        }
                        tabIndex={0}
                        role="button"
                        aria-label="Open image"
                      >
                        <Image
                          src={item.image_url}
                          alt={item.image_alt_text}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col items-center p-4 flex-1">
                        <CardTitle className="mb-2 self-start">
                          {capitalizeFirstLetter(item.name)}
                        </CardTitle>
                        <p className="text-gray-600 text-sm mb-2 self-start">
                          {item.short_description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      {isModalOpen && (
        <ImageModal
          src={selectedItem?.image_url ?? ""}
          alt={selectedItem?.image_alt_text ?? ""}
          isClosing={isClosing}
          handleClose={handleCloseModal}
        />
      )}
    </section>
  );
}
