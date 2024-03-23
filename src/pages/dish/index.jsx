import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../../services/api';
import { Button } from '../../components/button';
import { ButtonText } from '../../components/ButtonText';
import { Footer } from '../../components/footer';
import { Header } from '../../components/header';
import { Menu } from '../../components/menu';
import { NumberPicker } from '../../components/NumberPicker';
import { RxCaretLeft } from 'react-icons/rx';
import { Container, Content } from './style';
import { Tag } from '../../components/tag';
import { useMediaQuery } from 'react-responsive';

export function Dish({ $Isadmin, user_id }) {
  const $isDesktop = useMediaQuery({ minWidth: 1024 });
  const [$ismenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const [quantityOfItemsInTheCart, setQuantityOfItemsInTheCart] = useState(0);
  const [number, setNumber] = useState(1);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleBack() {
    navigate(-1);
  }

  function handleEdit() {
    navigate(`/edit/${params.id}`);
  }

  async function handleInclude() {
    setLoading(true);
    try {
      setQuantityOfItemsInTheCart((prevCount) => prevCount + 1);
      const cartItem = { dish_id: data.id, name: data.name, quantity: number };
      const response = await api.get('/carts', { params: { created_by: user_id } });
      const cart = response.data[0];
      if (cart) {
        await api.patch(`/carts/${cart.id}`, { cart_items: [cartItem] });
      } else {
        const createResponse = await api.post('/carts', { cart_items: [cartItem], created_by: user_id });
        const createdCart = createResponse.data;
        setCartId(createdCart.id);
      }
      Swal.fire({ position: "center", icon: "success", title: 'Prato adicionado ao carrinho!', showConfirmButton: false, timer: 1500 });
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        Swal.fire({ position: "center", icon: "error", title: 'Não foi possível adicionar ao carrinho.', showConfirmButton: false, timer: 1500 });
        console.log('Erro ao adicionar ao carrinho:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchDish() {
      const response = await api.get(`/dishes/${params.id}`);
      setData(response.data);
    }
    fetchDish();
  }, []);

  return (
    <Container>
      {!$isDesktop && <Menu $Isadmin={$Isadmin} isDisabled={true} $ismenuOpen={$ismenuOpen} setIsMenuOpen={setIsMenuOpen} />}
      <Header $Isadmin={$Isadmin} isDisabled={true} $ismenuOpen={$ismenuOpen} setIsMenuOpen={setIsMenuOpen} />
      {data &&
        <main>
          <div>
            <header>
              <ButtonText onClick={handleBack}><RxCaretLeft /> voltar</ButtonText>
            </header>
            <Content>
              <img src={`${api.defaults.baseURL}/files/${data.image}`} alt={data.name} />
              <div>
                <h1>{data.name}</h1>
                <p>{data.description}</p>
                {data.ingredients &&
                  <section>
                    {data.ingredients.map(ingredient => <Tag key={String(ingredient.id)} title={ingredient.name} />)}
                  </section>}
                <div className='buttons'>
                  {$Isadmin ?
                    <Button title='Editar prato' className='edit' onClick={handleEdit} loading={loading} /> :
                    <>
                      <NumberPicker number={number} setNumber={setNumber} />
                      <Button title={$isDesktop ? `incluir ∙ R$ ${(data.price * number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` :
                        `pedir ∙ R$ ${(data.price * number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        className='include'
                        isCustomer={!$isDesktop}
                        onClick={handleInclude}
                        loading={loading}
                        value={quantityOfItemsInTheCart}
                      />
                    </>
                  }
                </div>
              </div>
            </Content>
          </div>
        </main>}
      <Footer />
    </Container>
  );
}
