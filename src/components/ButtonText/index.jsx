import { Container } from "./style";

export function ButtonText ({children, ...rest}){
    return(
        <Container
        type="button"
        {...rest}
        >
            {children}
        </Container>
    );

}