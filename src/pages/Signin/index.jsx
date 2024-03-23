import { Container, Form, Brand } from './style';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Section } from '../../components/section';
import brand from '../../assets/brand.svg';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/auth';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  function handleSignIn() {
    setLoading(true);
    signIn({ email, password }).finally(() => setLoading(false));
  }

  return (
    <Container>
      <Brand>
        <img src={brand} alt='Logo' />
      </Brand>

      <Form>
        <h2>Faça seu login</h2>

        <Section title='Email'>
          <Input
            placeholder='Seu email'
            type='text'
            onChange={e => setEmail(e.target.value)}
          />
        </Section>

        <Section title='Senha'>
          <Input
            placeholder='No mínimo 6 caracteres'
            type='password'
            onChange={e => setPassword(e.target.value)}
          />
        </Section>

        <Button title='Entrar' onClick={handleSignIn} loading={loading} />

        <Link to='/register'>
          Criar uma conta
        </Link>
      </Form>
    </Container>
  );
}
