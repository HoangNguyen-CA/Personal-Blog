import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const name = 'Hoang Nguyen';
export const siteTitle = 'Hoang Nguyen Blog';

export default function Layout({ children, home }) {
  return (
    <div className='max-w-xl mx-auto px-4 mt-12 mb-24'>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='Hoang Nguyen Blog' />
      </Head>
      <header className='flex flex-col items-center mb-4'>
        {home ? (
          <>
            <Image
              priority
              src='/images/profile.jpg'
              className='object-cover object-center rounded-full'
              height={144}
              width={144}
              alt={name}
            />
            <h1 className='text-5xl font-bold my-5'>{name}</h1>
          </>
        ) : (
          <>
            <Link href='/'>
              <a>
                <Image
                  priority
                  src='/images/profile.jpg'
                  className='object-cover object-center rounded-full'
                  height={108}
                  width={108}
                  alt={name}
                />
              </a>
            </Link>
            <h2 className='text-3xl font-bold my-5'>
              <Link href='/'>
                <a className='text-inherit'>{name}</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className='mt-12'>
          <Link href='/'>
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
}
