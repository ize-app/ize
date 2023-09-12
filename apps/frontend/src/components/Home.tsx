import styled from '@emotion/styled';
import Button from '@mui/material/Button';

import { ConnectToDiscord } from "./ConnectToDiscord";

const PageContainer = styled.div`
    display: flex;
    padding: 0px 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    flex: 1 0 0;
    align-self: stretch;
    height: 100%;
`

const Subtitle = styled.div`
    color: #000;
/* M3/title/large */
font-family: Roboto;
font-size: 22px;
font-style: normal;
font-weight: 400;
line-height: 28px; /* 127.273% */
`

const Logo = styled.div`
    color: var(--m-3-sys-light-primary, #6750A4);
    text-align: center;
    font-family: Roboto;
    font-size: 120px;
    font-style: italic;
    font-weight: 700;
    line-height: 120px; /* 100% */
`

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
`


export const Home = () => <PageContainer>
    <Logo>Cults</Logo>
    <Subtitle>Process is king</Subtitle>
    <ButtonsContainer>
        <Button variant='contained' color="primary" href="/api/auth/discord/login">Join Alpha Waitlist</Button>
        <ConnectToDiscord/>
    </ButtonsContainer>
    </PageContainer>;
