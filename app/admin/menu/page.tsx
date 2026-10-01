"use client";

import { useEffect, useMemo, useState } from "react";

type MenuItem = {
  id?: string;
  name?: string;
  description?: string;
  price?: string | number;
  category?: string;
  image?: string;
  available?: boolean;
};

type MenuCategory = {
  id?: string;
  name?: string;
  image?: string;
  order?: number;
  visible?: boolean;
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function categoryMatches(
  categoryName: string,
  routeSlug: string
) {
  return (
    slugify(categoryName) ===
    slugify(routeSlug)
  );
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{
    category: string;
  }>;
}) {
  const [categorySlug, setCategorySlug] =
    useState("");

  const [menuItems, setMenuItems] =
    useState<MenuItem[]>([]);

  const [categories, setCategories] =
    useState<MenuCategory[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      const resolvedParams =
        await params;

      if (!active) {
        return;
      }

      const slug =
        decodeURIComponent(
          resolvedParams.category || ""
        );

      setCategorySlug(slug);

      const rawMenu =
        readStorage<any[]>(
          "nababi-menu",
          []
        );

      const rawCategories =
        readStorage<any[]>(
          "nababi-categories",
          []
        );

      const normalizedMenu =
        Array.isArray(rawMenu)
          ? rawMenu
          : [];

      const normalizedCategories: MenuCategory[] =
        Array.isArray(rawCategories)
          ? rawCategories
              .map(
                (
                  category: any,
                  index
                ) => ({
                  id:
                    String(
                      category?.id ||
                        slugify(
                          String(
                            category?.name ||
                              category?.title ||
                              ""
                          )
                        ) ||
                        `category-${index}`
                    ),

                  name:
                    typeof category ===
                    "string"
                      ? category
                      : String(
                          category?.name ||
                            category?.title ||
                            ""
                        ),

                  image:
                    typeof category ===
                    "string"
                      ? ""
                      : category?.image ||
                        "",

                  order:
                    typeof category?.order ===
                    "number"
                      ? category.order
                      : index,

                  visible:
                    typeof category ===
                    "string"
                      ? true
                      : category?.visible !==
                        false,
                })
              )
              .filter(
                (category) =>
                  category.name
              )
          : [];

      if (!active) {
        return;
      }

      setMenuItems(
        normalizedMenu
      );

      setCategories(
        normalizedCategories
      );

      setLoading(false);
    }

    loadPage();

    return () => {
      active = false;
    };
  }, [params]);

  const currentCategory =
    useMemo(() => {
      return categories.find(
        (category) =>
          categoryMatches(
            category.name || "",
            categorySlug
          )
      );
    }, [
      categories,
      categorySlug,
    ]);

  const categoryName =
    currentCategory?.name ||
    categorySlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

  /**
   * IMPORTANT:
   * Only products whose category exactly
   * matches the current category are shown.
   */
  const categoryProducts =
    useMemo(() => {
      if (!categoryName) {
        return [];
      }

      return menuItems.filter(
        (item) => {
          if (
            item.available === false
          ) {
            return false;
          }

          const productCategory =
            String(
              item.category || ""
            ).trim();

          return categoryMatches(
            productCategory,
            categoryName
          );
        }
      );
    }, [
      menuItems,
      categoryName,
    ]);

  const categoryImage =
    currentCategory?.image || "";

  if (loading) {
    return (
      <>
        <style jsx global>{`
          body {
            margin: 0;
            background: #080706;
          }
        `}</style>

        <main className="loadingPage">
          <div className="loader">
            NABABI
          </div>
        </main>

        <style jsx>{`
          .loadingPage {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background:
              radial-gradient(
                circle at center,
                rgba(
                  217,
                  164,
                  65,
                  0.08
                ),
                transparent 40%
              ),
              #080706;
          }

          .loader {
            color: #f6cf70;
            letter-spacing: 5px;
            font-family:
              Georgia,
              serif;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #080706;
          color: #f6f0e4;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }
      `}</style>

      <main className="categoryPage">
        {/* HEADER */}
        <header className="pageHeader">
          <div className="headerInner">
            <a
              href="/"
              className="brand"
            >
              <div className="brandMark">
                N
              </div>

              <div>
                <strong>
                  NABABI RISTORANTE
                </strong>

                <span>
                  Italian · Bengali · Luxury
                </span>
              </div>
            </a>

            <a
              href="/"
              className="backButton"
            >
              ← Back to Home
            </a>
          </div>
        </header>

        {/* CATEGORY HERO */}
        <section className="categoryHero">
          {categoryImage ? (
            <img
              src={categoryImage}
              alt={categoryName}
            />
          ) : null}

          <div className="heroOverlay" />

          <div className="heroContent">
            <div className="eyebrow">
              NABABI RISTORANTE
            </div>

            <h1>
              {categoryName}
            </h1>

            <div className="goldLine" />

            <p>
              Discover our carefully
              selected {categoryName}{" "}
              dishes.
            </p>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="productsSection">
          <div className="sectionHeader">
            <span>
              {categoryProducts.length}{" "}
              {categoryProducts.length ===
              1
                ? "Item"
                : "Items"}
            </span>

            <h2>
              {categoryName} Menu
            </h2>

            <p>
              Only dishes from the{" "}
              <strong>
                {categoryName}
              </strong>{" "}
              category are displayed
              here.
            </p>
          </div>

          {categoryProducts.length >
          0 ? (
            <div className="productGrid">
              {categoryProducts.map(
                (
                  item,
                  index
                ) => (
                  <article
                    className="productCard"
                    key={
                      item.id ||
                      `${item.name}-${index}`
                    }
                  >
                    <div className="imageWrap">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={
                            item.name ||
                            categoryName
                          }
                        />
                      ) : (
                        <div className="noImage">
                          NABABI
                        </div>
                      )}
                    </div>

                    <div className="productBody">
                      <div className="productTop">
                        <h3>
                          {item.name ||
                            "Menu Item"}
                        </h3>

                        {item.price !==
                          undefined &&
                          item.price !==
                            "" && (
                            <span className="price">
                              €
                              {
                                item.price
                              }
                            </span>
                          )}
                      </div>

                      {item.description && (
                        <p>
                          {
                            item.description
                          }
                        </p>
                      )}

                      <div className="categoryLabel">
                        {categoryName}
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptyIcon">
                🍽
              </div>

              <h3>
                No {categoryName} items
                available
              </h3>

              <p>
                There are currently no
                available dishes in this
                category.
              </p>

              <a
                href="/"
                className="goldButton"
              >
                ← Back to Menu
              </a>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footerInner">
            <div>
              <div className="footerBrand">
                NABABI RISTORANTE
              </div>

              <div className="footerText">
                Where Italian elegance
                meets the soul of Bengal.
              </div>
            </div>

            <a
              href="/"
              className="footerHome"
            >
              ← Home
            </a>
          </div>
        </footer>
      </main>

      <style jsx>{`
        .categoryPage {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 20% 15%,
              rgba(
                217,
                164,
                65,
                0.07
              ),
              transparent 28%
            ),
            radial-gradient(
              circle at 85% 50%,
              rgba(
                217,
                164,
                65,
                0.045
              ),
              transparent 30%
            ),
            #080706;
          color: #f6f0e4;
        }

        .pageHeader {
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid
            rgba(
              217,
              164,
              65,
              0.18
            );
          background: rgba(
            8,
            7,
            6,
            0.94
          );
          backdrop-filter: blur(15px);
        }

        .headerInner {
          width: min(
            1180px,
            calc(100% - 36px)
          );
          min-height: 78px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brandMark {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid
            #d9a441;
          color: #f6cf70;
          font-family:
            Georgia,
            serif;
          font-size: 20px;
        }

        .brand strong {
          display: block;
          color: #f6cf70;
          font-size: 17px;
          letter-spacing: 1.5px;
        }

        .brand span {
          display: block;
          margin-top: 3px;
          color: #81796e;
          font-size: 9px;
          letter-spacing: 2.2px;
          text-transform: uppercase;
        }

        .backButton {
          border: 1px solid
            rgba(
              217,
              164,
              65,
              0.4
            );
          border-radius: 999px;
          padding: 10px 16px;
          color: #f6cf70;
          font-size: 13px;
          transition: 0.25s;
        }

        .backButton:hover {
          background: #d9a441;
          color: #17120a;
        }

        .categoryHero {
          min-height: 470px;
          position: relative;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #100d0a;
        }

        .categoryHero img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .heroOverlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              rgba(8, 7, 6, 0.35),
              rgba(8, 7, 6, 0.88)
            ),
            radial-gradient(
              circle at center,
              transparent 10%,
              rgba(
                0,
                0,
                0,
                0.55
              )
            );
        }

        .heroContent {
          position: relative;
          z-index: 2;
          width: min(
            850px,
            calc(100% - 36px)
          );
          text-align: center;
          padding: 80px 0;
        }

        .eyebrow {
          color: #f6cf70;
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .heroContent h1 {
          margin: 0;
          color: #fff5df;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(
            48px,
            8vw,
            82px
          );
          font-weight: 500;
          text-transform: capitalize;
        }

        .goldLine {
          width: 70px;
          height: 1px;
          background: #d9a441;
          margin: 21px auto;
        }

        .heroContent p {
          margin: 0;
          color: #c8beaf;
          line-height: 1.8;
          font-size: 15px;
        }

        .productsSection {
          width: min(
            1180px,
            calc(100% - 36px)
          );
          margin: auto;
          padding: 90px 0 110px;
        }

        .sectionHeader {
          text-align: center;
          margin-bottom: 45px;
        }

        .sectionHeader > span {
          display: inline-block;
          color: #d9a441;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .sectionHeader h2 {
          margin: 0;
          color: #fff2d6;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(
            35px,
            5vw,
            52px
          );
          font-weight: 500;
          text-transform: capitalize;
        }

        .sectionHeader p {
          max-width: 650px;
          margin: 15px auto 0;
          color: #8f877b;
          line-height: 1.8;
          font-size: 14px;
        }

        .sectionHeader strong {
          color: #d9a441;
        }

        .productGrid {
          display: grid;
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );
          gap: 22px;
        }

        .productCard {
          overflow: hidden;
          border: 1px solid
            rgba(
              217,
              164,
              65,
              0.16
            );
          border-radius: 15px;
          background: #100e0b;
          transition:
            transform 0.3s,
            border-color 0.3s,
            box-shadow 0.3s;
        }

        .productCard:hover {
          transform: translateY(-6px);
          border-color: rgba(
            217,
            164,
            65,
            0.55
          );
          box-shadow:
            0 18px 50px
              rgba(
                0,
                0,
                0,
                0.3
              );
        }

        .imageWrap {
          width: 100%;
          aspect-ratio: 1.25;
          overflow: hidden;
          background: #17130f;
        }

        .imageWrap img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.45s;
        }

        .productCard:hover
          .imageWrap
          img {
          transform: scale(1.06);
        }

        .noImage {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          color: #6e665a;
          font-family:
            Georgia,
            serif;
          letter-spacing: 4px;
        }

        .productBody {
          padding: 21px;
        }

        .productTop {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
        }

        .productTop h3 {
          margin: 0;
          color: #fff0d0;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 22px;
          font-weight: 500;
        }

        .price {
          color: #f6cf70;
          white-space: nowrap;
          font-weight: 700;
          font-size: 15px;
        }

        .productBody p {
          color: #928a7e;
          font-size: 13px;
          line-height: 1.7;
          margin: 11px 0 14px;
        }

        .categoryLabel {
          display: inline-block;
          border: 1px solid
            rgba(
              217,
              164,
              65,
              0.2
            );
          border-radius: 999px;
          padding: 5px 9px;
          color: #a99161;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .emptyState {
          max-width: 650px;
          margin: auto;
          padding: 65px 25px;
          border: 1px dashed
            rgba(
              217,
              164,
              65,
              0.25
            );
          border-radius: 16px;
          text-align: center;
          background: rgba(
            15,
            13,
            11,
            0.7
          );
        }

        .emptyIcon {
          font-size: 38px;
          margin-bottom: 15px;
        }

        .emptyState h3 {
          margin: 0;
          color: #fff0d0;
          font-family:
            Georgia,
            serif;
          font-size: 25px;
          font-weight: 500;
        }

        .emptyState p {
          color: #81796d;
          line-height: 1.7;
          margin: 10px auto 25px;
        }

        .goldButton {
          display: inline-block;
          border: 1px solid
            #d9a441;
          border-radius: 999px;
          padding: 12px 20px;
          background: #d9a441;
          color: #17120a;
          font-weight: 700;
          font-size: 13px;
          transition: 0.25s;
        }

        .goldButton:hover {
          background: #f6cf70;
        }

        .footer {
          border-top: 1px solid
            rgba(
              217,
              164,
              65,
              0.15
            );
          padding: 34px 0;
        }

        .footerInner {
          width: min(
            1180px,
            calc(100% - 36px)
          );
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .footerBrand {
          color: #f6cf70;
          font-family:
            Georgia,
            serif;
          font-size: 20px;
        }

        .footerText {
          margin-top: 5px;
          color: #70695f;
          font-size: 12px;
        }

        .footerHome {
          color: #c4a15f;
          font-size: 13px;
        }

        @media (max-width: 900px) {
          .productGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }
        }

        @media (max-width: 620px) {
          .headerInner {
            min-height: 68px;
          }

          .brand strong {
            font-size: 14px;
          }

          .brand span {
            font-size: 7px;
            letter-spacing: 1.5px;
          }

          .brandMark {
            width: 38px;
            height: 38px;
          }

          .backButton {
            padding: 8px 12px;
            font-size: 11px;
          }

          .categoryHero {
            min-height: 390px;
          }

          .productsSection {
            padding: 65px 0 80px;
          }

          .productGrid {
            grid-template-columns: 1fr;
          }

          .footerInner {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}
