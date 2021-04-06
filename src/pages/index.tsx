import React from 'react'
import Head from 'next/head'

import NextLogo from '../assets/nextjs.svg'

import { Container } from '../styles/pages/Home'

import Link from 'next/link'

const Home: React.FC = () => {
  return (
    <Container>
      <Head>
        <title>Home Page</title>
      </Head>
      
      <NextLogo />
      <h1>Wellcome to Next.js</h1>
      <p>Project that consumes a laravel API and render with Next.js + Styled Components</p>

      <br /><br />
      <Link href="/categories/list">Categorias</Link>
    </Container>
  )
}

export default Home