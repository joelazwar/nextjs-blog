import useSWR from "swr";
import Layout from "../components/layout";
import Date from "../components/date";
import utilStyles from "../styles/utils.module.css";
import Head from "next/head";
import Image from "next/image";
import DatePicker from "react-datepicker"

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const myLoader = ({ src, date, startDate }) => ``;

function Content() {
  const { data, error } = useSWR(
    "https://api.nasa.gov/planetary/apod?start_date=2022-01-02&api_key=LcijitMlKSXA5pCXiyTIw51yLv1Eg0imGpBo8pOQ",
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div>
      {data.map(
        ({ copyright, date, explanation, hdurl, url, title }, index) => (
          <li className={utilStyles.listItem} key={index}>
            <a href={hdurl}>
              <Image
                loader={myLoader}
                src={url}
                alt={copyright}
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="contain"
              />
            </a>
            <article>
              <h1 className={utilStyles.headingXl}>{data.title}</h1>
              <div className={utilStyles.lightText}>
                <Date dateString={date} />
              </div>
            </article>
            <a href={hdurl}>{title}</a>
            <br />
            <small className={utilStyles.lightText}></small>
          </li>
        )
      )}
    </div>
  );
}

export default function Page() {

  const [startDate, setStartDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  
  return (
    <Layout>
      <Head>
        <title>NASA APOD</title>
      </Head>
      <div>
        <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
        />
        <DatePicker
        selected={startDate}
        onChange={(startDate) => setStartDate(startDate)}
        />
      </div>
      <div className="container">
        <Content />
      </div>
    </Layout>
  );
}
