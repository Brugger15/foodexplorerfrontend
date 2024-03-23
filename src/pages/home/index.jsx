import styled from "styled-components";
import { Container as OriginalContainer, Content as OriginalContent } from "./style";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Food } from "../../components/food";
import { Menu } from "../../components/menu";
import { Section } from "../../components/section";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { api } from "../../services/api";
import bannerMobile from "../../assets/banner-mobile.png";
import homeBanner from "../../assets/home-banner.png";
import { register } from "swiper/element/bundle";

export function Home({ $Isadmin, user_id }) {
  const swiperElRef1 = useRef(null);
  const swiperElRef2 = useRef(null);
  const swiperElRef3 = useRef(null);

  const $isDesktop = useMediaQuery({ minWidth: 1024 });
  const [$ismenuOpen, setIsMenuOpen] = useState(false);

  register();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.swiper) {
          entry.target.swiper && entry.target.swiper.autoplay.start();
        } else {
          entry.target.swiper && entry.target.swiper.autoplay.stop();
        }
      });
    }, options);

    observer.observe(swiperElRef1.current);
    observer.observe(swiperElRef2.current);
    observer.observe(swiperElRef3.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const [dishes, setDishes] = useState({ meals: [], desserts: [], beverages: [] });
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleDetails(id) {
    navigate(`/dish/${id}`);
  }

  useEffect(() => {
    async function fetchDishes() {
      const response = await api.get(`/dishes?search=${search}`);
      const meals = response.data.filter((dish) => dish.category === "meal");
      const desserts = response.data.filter((dish) => dish.category === "dessert");
      const beverages = response.data.filter((dish) => dish.category === "beverage");

      setDishes({ meals, desserts, beverages });
    }

    fetchDishes();
  }, [search]);

  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/favorites");
        const favorites = response.data.map((favorite) => favorite.dish_id);

        setFavorites(favorites);
      } catch (error) {
        console.log("Erro ao buscar favoritos:", error);
      }
    };

    fetchFavorites();
  }, []);

  const [myOrders, setMyOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/myorders");
        const myorders = response.data.map((myorder) => myorder.dish_id);

        setMyOrders(myorders);
      } catch (error) {
        console.log("Erro ao buscar pratos:", error);
      }
    };

    fetchOrders();
  }, []);

  const updateFavorite = async (isFavorite, dishId) => {
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${dishId}`);

        setFavorites((prevFavorites) => prevFavorites.filter((favorite) => favorite !== dishId));
      } else {
        await api.post("/favorites", { dish_id: dishId });
        setFavorites((prevFavorites) => [...prevFavorites, dishId]);
      }
    } catch (error) {
      console.log("Erro ao atualizar favoritos:", error);
    }
  };

  const updateMyOrder = async (isMyorder, dishId) => {
    try {
      if (isMyorder) {
        await api.delete(`/myorders/${dishId}`);

        setMyOrders((prevMyOrders) => prevMyOrders.filter((myorder) => myorder !== dishId));
      } else {
        await api.post("/myorders", { dish_id: dishId });
        setMyOrders((prevMyOrders) => [...prevMyOrders, dishId]);
      }
    } catch (error) {
      console.log("Erro ao att seu pedido", error);
    }
  };

  return (
    <OriginalContainer>
      {!$isDesktop && <Menu $Isadmin={$Isadmin} $ismenuOpen={$ismenuOpen} setIsMenuOpen={setIsMenuOpen} setSearch={setSearch} />}

      <Header $Isadmin={$Isadmin} $ismenuOpen={$ismenuOpen} setIsMenuOpen={setIsMenuOpen} setSearch={setSearch} />

      <main>
        <div>
          <header>
            <img src={$isDesktop ? homeBanner : bannerMobile} alt="Macarons coloridos em tons pastel despencando juntamente com folhas verdes e frutas frescas." />

            <div>
              <h1>Sabores inigualáveis</h1>
              <p>Sinta o cuidado do preparo com ingredientes selecionados</p>
            </div>
          </header>

          <OriginalContent>
            <Section title="Refeições">
              <swiper-container class="swiper-container" ref={swiperElRef1} space-between={$isDesktop ? "27" : "16"} slides-per-view="auto" navigation={$isDesktop ? "true" : "false"} loop="true" grab-cursor="true">
                {dishes.meals.map((dish) => (
                  <swiper-slide key={String(dish.id)}>
                    <Food $Isadmin={$Isadmin} data={dish} isFavorite={favorites.includes(dish.id)} updateFavorite={updateFavorite} isMyorder={myOrders.includes(dish.id)} updateMyOrder={updateMyOrder} user_id={user_id} handleDetails={handleDetails} />
                  </swiper-slide>
                ))}
              </swiper-container>
            </Section>

            <Section title="Sobremesas">
              <swiper-container ref={swiperElRef2} space-between={$isDesktop ? "27" : "16"} slides-per-view="auto" navigation={$isDesktop ? "true" : "false"} loop="true" grab-cursor="true">
                {dishes.desserts.map((dish) => (
                  <swiper-slide key={String(dish.id)}>
                    <Food $Isadmin={$Isadmin} data={dish} isFavorite={favorites.includes(dish.id)} updateFavorite={updateFavorite} isMyorder={myOrders.includes(dish.id)} updateMyOrder={updateMyOrder} user_id={user_id} handleDetails={handleDetails} />
                  </swiper-slide>
                ))}
              </swiper-container>
            </Section>

            <Section title="Bebidas">
              <swiper-container ref={swiperElRef3} space-between={$isDesktop ? "27" : "16"} slides-per-view="auto" navigation={$isDesktop ? "true" : "false"} loop="true" grab-cursor="true">
                {dishes.beverages.map((dish) => (
                  <swiper-slide key={String(dish.id)}>
                    <Food $Isadmin={$Isadmin} data={dish} isFavorite={favorites.includes(dish.id)} updateFavorite={updateFavorite} isMyorder={myOrders.includes(dish.id)} updateMyOrder={updateMyOrder} user_id={user_id} handleDetails={handleDetails} />
                  </swiper-slide>
                ))}
              </swiper-container>
            </Section>
          </OriginalContent>
        </div>
      </main>

      <Footer />
    </OriginalContainer>
  );
}

