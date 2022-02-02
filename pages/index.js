import Head from 'next/head';
import Link from 'next/link';
import DateComponent from '../components/date';

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

  res.items.sort((a, b) => {
    return new Date(b.fields.date) - new Date(a.fields.date);
  });

  return {
    props: {
      posts: res.items,
    },
  };
}

export default function Home({ posts }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>I'm learning web development and writing about my journey.</p>
        <small>
          This blog was created using NextJS and uses static site generation.
          Posts are managed by Contentful Headless CMS.
        </small>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {posts.map(({ sys, fields }) => (
            <li className={utilStyles.listItem} key={sys.id}>
              <Link href={`/posts/${fields.slug}`}>
                <a>{fields.title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <DateComponent dateString={fields.date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
