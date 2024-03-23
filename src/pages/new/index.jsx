import { Container, Form, Image, Category } from "./style";
import { Header } from '../../components/header';
import { Menu } from "../../components/menu";
import { Section } from "../../components/section";
import { FoodItem } from "../../components/FoodItem";
import { Footer } from "../../components/footer";
import { ButtonText } from "../../components/ButtonText";
import { Input } from "../../components/input";
import { Textarea } from '../../components/textarea';
import { Button } from "../../components/button";
import { RxCaretLeft } from "react-icons/rx";
import { FiUpload } from "react-icons/fi";
import { RiArrowDownSLine } from "react-icons/ri";
import { useState } from 'react'; 
import { useMediaQuery } from "react-responsive";
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import Swal from 'sweetalert2';

export function New({ $Isadmin }) {
  const $isDesktop = useMediaQuery({ minWidth: 1024 });
  const [$ismenuOpen, setIsMenuOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('');

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);
    setFileName(file.name);
  }

  function handleAddTag() {
    setTags((prevState) => [...prevState, newTag]);
    setNewTag('');
  }

  function handleRemoveTag(deleted) {
    setTags((prevState) => prevState.filter((tag) => tag !== deleted));
  }

  async function handleNewDish() {
    if (!image) {
      return Swal.fire({
        position: 'center-end',
        icon: 'warning',
        title: 'Selecione a imagem do prato.',
        showConfirmButton: false,
        timer: 3500
      });
    }

    if (!name) {
      return Swal.fire({
        position: 'center-end',
        icon: 'warning',
        title: 'Digite o nome do prato.',
        showConfirmButton: false,
        timer: 3500
      }); 
    }

    if (!category) {
      return Swal.fire({
        position: 'center-end',
        icon: 'warning',
        title: 'Selecione a categoria do prato.',
        showConfirmButton: false,
        timer: 3500
      });
    }

    if (tags.length === 0) {
      return Swal.fire({
        position: 'center-end',
        icon: 'warning',
        title: 'Informe pelo menos um ingrediente do prato.',
        showConfirmButton: false,
        timer: 3500
      });
    }

    if (newTag) {
      return Swal.fire({
        position: 'center-end',
        icon: 'warning',
        title: 'Você deixou um ingrediente no campo para adicionar, mas não clicou em adicionar. Clique para adicionar ou deixe o campo vazio.',
        showConfirmButton: false,
        timer: 3500
      });
    }

    if (!price) {
      return Swal.fire({
        position: 'center-end',
        icon: 'warning',
        title: 'Digite o preço do prato.',
        showConfirmButton: false,
        timer: 3500
      });
    }

    if (!description) {
      return Swal.fire({
        position: 'center-end',
        icon: 'warning',
        title: 'Digite a descrição do prato.',
        showConfirmButton: false,
        timer: 3500
      });
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('description', description);

    formData.append('ingredients', JSON.stringify(tags));

    try {
      await api.post('/dishes', formData);
      return Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Prato cadastrado com sucesso!',
        showConfirmButton: false,
        timer: 3500
      }),
      navigate(-1);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Não foi possível cadastrar o prato.',
          showConfirmButton: false,
          timer: 3500});
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      {!$isDesktop &&
        <Menu 
          $Isadmin={$Isadmin}
          isDisabled={true} 
          $ismenuOpen={$ismenuOpen} 
          setIsMenuOpen={setIsMenuOpen}
        />
      }

      <Header 
        $Isadmin={$Isadmin} 
        isDisabled={true}
        $ismenuOpen={$ismenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
      />

      <main>
        <Form>
          <header>
            <ButtonText onClick={handleBack}>
              <RxCaretLeft/>
              voltar
            </ButtonText>

            <h1>Adicionar prato</h1>
          </header>

          <div>
            <div className='image'>
              <Section title ='Imagem do prato'>
                <Image className="image">
                  <label htmlFor="image">
                    <FiUpload size={'2.4rem'}/>
                    <span>{fileName||'Selecione Imagem'}</span> 
                    <input 
                      id='image'
                      type="file" 
                      onChange={handleImageChange} 
                    />  
                  </label>
                </Image>
              </Section>
            </div>

            <Section title='Nome'>
              <Input 
                className="name"
                placeholder="Ex.: Salada Ceasar"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Section>

            <Section title="Categoria">
              <Category className="category">
                <label htmlFor="category">
                  <select 
                    id ='category'
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value=''>Selecionar</option>
                    <option value='meal'>Refeição</option>
                    <option value='dessert'>Sobremesa</option>
                    <option value='beverage'>Bebida</option>
                  </select>
                  <RiArrowDownSLine size={'2.4rem'}/>
                </label>
              </Category>
            </Section>
          </div>

          <div>
            <Section title='Ingredientes'>
              <div className="tags">
                {tags.map((tag, index) => (
                  <FoodItem
                    key={String(index)}
                    value={tag}
                    onClick={() => handleRemoveTag(tag)}
                  />
                ))}
                <FoodItem
                  $isnew
                  placeholder='Adicionar'
                  onChange={(e) => setNewTag(e.target.value)}
                  value={newTag}
                  onClick={handleAddTag}
                />
              </div>
            </Section>

            <Section title='Preço'>
              <Input 
                className='price'
                placeholder='R$ 00,00'
                type='number'
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </Section>
          </div>

          <Section title='Descrição'>
            <Textarea
              placeholder='Fale brevemente sobre o prato, seus ingredientes e composição' 
              onChange={(e) => setDescription(e.target.value)}
            />   
          </Section>

          <div className='save'>
            <Button
              title='Salvar alterações'
              onClick={handleNewDish}
              loading={loading}
            />
          </div>
        </Form>
      </main>

      <Footer/> 
    </Container>
  );
}
