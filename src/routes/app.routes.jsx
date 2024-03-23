import { Routes, Route } from "react-router-dom";
import { New } from "./../pages/new";
import { Edit } from "./../pages/edit";
import { Dish } from "./../pages/dish";
import { Home } from "./../pages/home";
import { Favorites } from "../pages/favorites";
import { MyOrders } from "../pages/MyOrders";

export function AppRoutes({ $Isadmin }) {
  return (
    <Routes>
      <Route path="/" element={<Home $Isadmin={$Isadmin} />} />
      <Route path="/new" element={<New $Isadmin={$Isadmin} />} />
      <Route path="/edit/:id" element={<Edit $Isadmin={$Isadmin} />} />
      <Route path="/dish/:id" element={<Dish $Isadmin={$Isadmin} />} />
      <Route path="/favorites" element={<Favorites $Isadmin={$Isadmin} />} />
      <Route path="/myorders" element={<MyOrders $Isadmin={$Isadmin} />} />
    </Routes>
  );
}

