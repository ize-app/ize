import styled from '@emotion/styled';
import {Button, Typography} from '@mui/material'

import { ConnectToDiscord } from "./ConnectToDiscord";
import { Logo } from "./Logo";

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

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
`

export const Home = () => <PageContainer>
    <Logo fontSize={200}>Cults</Logo>
    <Typography variant='h3'>Process is King</Typography>
    <ButtonsContainer>
        <Button variant='contained' color="primary" href="/api/auth/discord/login">Join Alpha Waitlist</Button>
        <ConnectToDiscord/>
    </ButtonsContainer>
    </PageContainer>;
