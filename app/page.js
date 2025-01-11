'use client'

import Container from '@/components/layout/container';
import Navbar from './components/Navbar';

export default async function Home() {

    return (
        <>
            <Navbar />
            <Container>
                <h1>Home</h1>
            </Container>
        </>
    );
}
