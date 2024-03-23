import { Container } from './style';
import { FiSearch } from 'react-icons/fi';
import { Input } from '../../components/input';

export function Search({ setSearch, isDisabled }) {
    return (
        <Container>
            <Input
                placeholder='Busque por pratos ou ingredientes'
                icon={FiSearch}
                disabled={isDisabled}
                onChange={(e) => setSearch(e.target.value)}
            />
        </Container>
    );
}
