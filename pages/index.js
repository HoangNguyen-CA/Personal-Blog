import Head from 'next/head';
import Link from 'next/link';
import DateComponent from '../components/date';

import Layout, { siteTitle } from '../components/layout';

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
      <section>
        <p className='text-2xl'>
          I'm learning web development and writing about my journey.
        </p>
        <br />
        <p className='text-xl'>
          This blog was created using NextJS and uses static site generation.
          Posts are managed by Contentful Headless CMS.
        </p>
      </section>

      <section className='text-xl pt-1'>
        <h2 className='text-2xl my-4'>Blog</h2>
        <ul>
          {posts.map(({ sys, fields }) => (
            <li className='mb-5' key={sys.id}>
              <Link href={`/posts/${fields.slug}`}>
                <a>{fields.title}</a>
              </Link>
              <br />
              <small className='text-slate-700'>
                <DateComponent dateString={fields.date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
