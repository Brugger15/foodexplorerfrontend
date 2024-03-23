import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { api } from '../../services/api';

import { useNavigate } from 'react-router-dom';
import { RxCaretLeft } from 'react-icons/rx';

import { Container, Content } from './style';

import { Menu } from '../../components/menu';
import { Header } from '../../components/header';
import { ButtonText } from '../../components/ButtonText';
import { Footer } from '../../components/footer';
import { Order } from '../../components/order';
import { NumberPicker } from '../../components/NumberPicker';

export function MyOrders({ $Isadmin }) {
  const $isDesktop = useMediaQuery({ minWidth: 1024 });

  const [$ismenuOpen, setIsMenuOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/myorders');
        setOrders(response.data);
        calculateTotal(response.data);
      } catch (error) {
        console.log('Erro ao buscar pedidos:', error);
      }
    };

    fetchOrders();
    fetchCartQuantity(); // Chama a função para buscar a quantidade do carrinho
  }, []);

  const fetchCartQuantity = async () => {
    try {
      const response = await api.get('/cart/quantity');
      console.log('Quantidade do carrinho:', response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // A rota /cart/quantity não foi encontrada, mas isso é esperado.
        // Você pode lidar com isso silenciosamente aqui, se desejar.
      } else {
        // Outro tipo de erro ocorreu, imprima no console para depuração.
        console.error('Erro ao buscar quantidade do carrinho:', error);
      }
    }
  };

  const cancelMyOrder = async (dishId) => {
    try {
      await api.delete(`/myorders/${dishId}`);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== dishId)
      );
      calculateTotal(orders.filter((order) => order.id !== dishId));
    } catch (error) {
      console.log('Erro ao cancelar o pedido:', error);
    }
  };

  const calculateTotal = (orders) => {
    const newTotalPrice = orders.reduce(
      (total, order) => total + (order.price * (order.quantity || 1)),
      0
    );
    const newTotalQuantity = orders.reduce(
      (total, order) => total + (order.quantity || 1),
      0
    );
    setTotalPrice(newTotalPrice);
    setTotalQuantity(newTotalQuantity);
  };

  const updateTotalPrice = (newPrice, newQuantity) => {
    const newTotalPrice = totalPrice + newPrice;
    const newTotalQuantity = totalQuantity + newQuantity;
    setTotalPrice(newTotalPrice);
    setTotalQuantity(newTotalQuantity);
  };

  const removeOrderItem = async (dishId) => {
    try {
      await api.delete(`/myorders/${dishId}`);
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.filter((order) => order.id !== dishId);
        calculateTotal(updatedOrders);
        return updatedOrders;
      });
    } catch (error) {
      console.log('Erro ao remover o pedido:', error);
    }
  };
  return (
    <Container>
      {!$isDesktop && (
        <Menu
          $Isadmin={$Isadmin}
          $ismenuOpen={$ismenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      <Header
        $Isadmin={$Isadmin}
        $ismenuOpen={$ismenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {orders && (
        <main>
          <div>
            <header>
              <ButtonText onClick={handleBack}>
                <RxCaretLeft />
                voltar
              </ButtonText>

              <h1> Meus Pedidos</h1>

              <p>Preço Total: R$ {totalPrice.toFixed(2).replace('.', ',')}</p>
              <p>Quantidade Total: {totalQuantity}</p>
            </header>

            <Content>
              {orders.map((order) => (
                <Order
                  key={order.id}
                  data={order}
                  cancelMyOrder={cancelMyOrder}
                  updateTotalPrice={updateTotalPrice}
                  removeOrderItem={removeOrderItem}
                  api={api} // Passando a instância da API como propriedade
                />
              ))}
            </Content>
          </div>
        </main>
      )}

      <Footer />
    </Container>
  );
}
