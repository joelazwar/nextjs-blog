import useSWR from "swr";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Head from "next/head";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  Container,
  Row,
  Col,
  Spinner,
  Card,
  Modal,
  Button,
} from "react-bootstrap";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const shimmer = (w, h) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#333" offset="20%" />
        <stop stop-color="#222" offset="50%" />
        <stop stop-color="#333" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#333" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export function Content({ startDate, date }) {
  const { data, error } = useSWR(
    `https://api.nasa.gov/planetary/apod?start_date=${startDate}&end_date=${date}&thumbs=true&api_key=LcijitMlKSXA5pCXiyTIw51yLv1Eg0imGpBo8pOQ`,
    fetcher
  );
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (error) return <div>failed to load</div>;
  if (!data)
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );

  if (data.code === 400) {
    return <div>{data.msg}</div>;
  }

  return data.map(
    (
      { copyright, date, explanation, hdurl, url, title, thumbnail_url },
      index
    ) => (
      <Row>
        <Col md={12}>
          <Card>
            <a href={hdurl}>
              <Image
                src={thumbnail_url ? thumbnail_url : url}
                alt={copyright}
                width="100%"
                height="50%"
                layout="responsive"
                objectFit="cover"
                objectPosition="center"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(700, 475)
                )}`}
              />
            </a>
            <article>
              <a onClick={handleShow}>
                <h1 className={utilStyles.headingLg}>{title}</h1>
              </a>
              <time datetime={date}>{date}</time>
              <br />
              <small className={utilStyles.lightText}>{explanation}</small>
            </article>
            <br />
          </Card>
          <br />
        </Col>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{siteTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image
              src={thumbnail_url ? thumbnail_url : url}
              alt={copyright}
              width="100%"
              height="100"
              layout="responsive"
              objectFit="cover"
              objectPosition="center"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(700, 475)
              )}`}
            />
            <article>
              <h1 className={utilStyles.headingLg}>{title}</h1>
              <time datetime={date}>{date}</time>
              <br />
              <small className={utilStyles.lightText}>{explanation}</small>
            </article>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    )
  );
}

export const dateFormat = (d) =>
  d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

export default function Page() {
  const [startDate, setStartDate] = useState(new Date());
  const [date, setDate] = useState(new Date());

  return (
    <Layout>
      <Head>
        <title>NASA APOD</title>
      </Head>
      <Container>
        <Row>
          <Col xs={6}>Start Date</Col>
          <Col xs={6}>End Date</Col>
        </Row>
        <Row>
          <Col xs={6}>
            <DatePicker
              selected={startDate}
              onChange={(startDate) => setStartDate(startDate)}
            />
          </Col>
          <Col xs={6}>
            <DatePicker selected={date} onChange={(date) => setDate(date)} />
          </Col>
        </Row>
      </Container>
      <br />
      <Container fluid>
        <Content startDate={dateFormat(startDate)} date={dateFormat(date)} />
      </Container>
    </Layout>
  );
}
