import Head from 'next/head';
import Link from 'next/link';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { Content, dateFormat } from './apod.js';
import { Button } from 'react-bootstrap';
import { useState } from 'react';

function randomDate() {
  return new Date(
    new Date('Jun 16, 1995').getTime() +
      Math.random() * (new Date().getTime() - new Date('Jun 16, 1995').getTime())
  );
}

export default function Home() {
  const [date, setDate] = useState(randomDate());

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <p className={utilStyles.paragraph}>
          This website is made to utilize the NASA API for the Astronomy Picture of the Day (APOD)
        </p>
        <br />
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" onClick={() => setDate(randomDate())}>
            Give me another picture!
          </Button>
        </div>
      </section>
      <br />
      <Content startDate={dateFormat(date)} date={dateFormat(date)} />
      <br />
      <Link href="/apod">
        <a>
          <h1 className={utilStyles.headingMd} style={{ textAlign: 'center' }}>
            Click Here for more!
          </h1>
        </a>
      </Link>
    </Layout>
  );
}
