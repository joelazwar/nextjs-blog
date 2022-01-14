import useSWR from "swr";
import Layout from "../components/layout";
import Link from "next/link";
import Date from "../components/date";
import utilStyles from "../styles/utils.module.css";
import Head from "next/head";
import Image from "next/image";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Content() {
  const { data, error } = useSWR(
    "https://api.nasa.gov/planetary/apod?start_date=2022-01-02&api_key=LcijitMlKSXA5pCXiyTIw51yLv1Eg0imGpBo8pOQ",
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  console.log(data);
  // render data
  return (
    <ul>
      {data.map(({ copyright, date, explanation, url, title }, index) => (
        <li className={utilStyles.listItem} key={index}>
          <Image
            src={url}
            alt={copyright}
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="contain"
          />
          <Head>
            <title>{title}</title>
          </Head>
          <article>
            <h1 className={utilStyles.headingXl}>{data.title}</h1>
            <div className={utilStyles.lightText}>
              <Date dateString={date} />
            </div>
          </article>
          <Link href="/">
            <a>{title}</a>
          </Link>
          <br />
          <small className={utilStyles.lightText}></small>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <Layout>
      <div className="container">
        <Content />
      </div>
    </Layout>
  );
}
