import Head from 'next/head';
import Link from 'next/link';
import Date from '../components/date';

import Layout, { siteTitle } from '../components/layout';

import utilStyles from '../styles/utils.module.css';

import { createClient } from 'contentful';

export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

  const res = await client.getEntries({
    content_type: 'blogPost',
  });

  return {
    props: {
      posts: res.items,
    },
  };
}

export default function Home({ posts }) {
  console.log(posts);
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>I'm learning web development and writing about my journey.</p>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
      </section>
    </Layout>
  );
}
