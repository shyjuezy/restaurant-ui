"use client";

import Image from "next/image";
import { type MenuItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback, useEffect } from "react";
import { ImageModal } from "@/components/image-modal";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

interface MenuItemCardProps {
  item: MenuItem;
}

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const animationDuration = 200;

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, animationDuration);
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, handleClose]);

  const hasVegetarianOptions =
    item.has_protein_options &&
    item.menu_item_proteins.some(
      (protein) => protein.protein_options.is_vegetarian
    );

  const hasNonVegetarianOptions =
    item.has_protein_options &&
    item.menu_item_proteins.some(
      (protein) => !protein.protein_options.is_vegetarian
    );

  return (
    <>
      <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md flex flex-col">
        <div className="flex flex-row items-center justify-start gap-2">
          <div
            onClick={handleOpenModal}
            onKeyDown={(e) => e.key === "Enter" && handleOpenModal()}
            tabIndex={0}
            role="button"
            aria-label="Open image"
            className="relative aspect-square self-start h-[6rem] w-[8rem] cursor-pointer"
          >
            <Image
              src={item.image_url || "/placeholder.svg"}
              alt={item.image_alt_text}
              fill
              sizes="(max-width: 768px) 8rem, 6rem"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-start justify-start self-start basis-2/3">
            <h3 className="text-lg font-semibold mb-2">
              {capitalizeWords(item.name)}
            </h3>
            <div className="flex justify-between mb-3 gap-2 self-ends">
              <div className="flex gap-2">
                {hasVegetarianOptions && (
                  <Badge
                    variant="secondary"
                    className="bg-green-500/10 hover:bg-green-500/10 text-green-700"
                  >
                    veg
                  </Badge>
                )}
                {hasNonVegetarianOptions && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 hover:bg-primary/20 text-primaryDark"
                  >
                    non-veg
                  </Badge>
                )}
              </div>
            </div>
            <span className="text-sm font-medium mx-2">
              ${item.base_price.toFixed(2)}
              {item.menu_item_proteins.length > 1 &&
                ` - $${item.max_price.toFixed(2)}`}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex flex-col items-start justify-start gap-2 flex-1">
            <p className="text-xs text-gray-700 mb-2 normal-case">
              {item.short_description
                ? capitalizeFirstLetter(item.short_description)
                : "No description available"}
            </p>
            {item.has_protein_options && item.menu_item_proteins.length > 1 && (
              <div className="flex flex-col items-start justify-start gap-2">
                <h4 className="text-xs">Available in</h4>
                {item.has_protein_options && (
                  <div className="flex flex-row items-center justify-start gap-2 flex-wrap">
                    {item.menu_item_proteins
                      .sort(
                        (a, b) =>
                          a.protein_options.price_addition +
                          item.base_price -
                          (b.protein_options.price_addition + item.base_price)
                      )
                      .map((protein) => (
                        <Badge
                          key={protein.protein_options.name}
                          variant="secondary"
                          className={`${
                            protein.protein_options.is_vegetarian
                              ? "bg-green-500/10 hover:bg-green-500/10 text-green-700"
                              : "bg-orange-500/10 hover:bg-orange-500/10 text-primaryDark"
                          } flex items-center gap-1.5`}
                        >
                          <span>{protein.protein_options.name}</span>
                          <span className="text-gray-500/70">|</span>
                          <span className="text-xs">
                            $
                            {(
                              item.base_price +
                              protein.protein_options.price_addition
                            ).toFixed(2)}
                          </span>
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex mt-auto pt-4">
            <AddToCartButton item={item} />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ImageModal
          src={item.image_url || "/placeholder.svg"}
          alt={item.image_alt_text}
          isClosing={isClosing}
          handleClose={handleClose}
        />
      )}
    </>
  );
}
