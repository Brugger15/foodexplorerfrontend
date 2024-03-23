import { Container } from "./style";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import { Header } from '../../components/header';
import { Search } from '../search';
import { ButtonText } from '../ButtonText';

export function Menu({ $Isadmin, $ismenuOpen, setIsMenuOpen, setSearch, isDisabled }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  function handleNew() {
    navigate("/new");
  }

  function handleFavorites() {
    navigate('/favorites');
  }

  function handleSignOut() {
    navigate('/');
    signOut();
  }

  return (
    <Container $ismenuOpen={$ismenuOpen}>
      <Header $Isadmin={$Isadmin} $ismenuOpen={$ismenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main>
        <Search isDisabled={isDisabled} setSearch={setSearch} />

        {$Isadmin && (
          <ButtonText onClick={handleNew}>
            Novo Prato
          </ButtonText>
        )}

        <ButtonText onClick={handleFavorites}>
          Meus favoritos
        </ButtonText>

        <ButtonText onClick={handleSignOut}>
          Sair
        </ButtonText>
      </main>
    </Container>
  );
}
