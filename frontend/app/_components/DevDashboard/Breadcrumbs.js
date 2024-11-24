import { clsx } from 'clsx';
import Link from 'next/link';

export default function Breadcrumbs({ breadcrumbs }) {
  return (
    <div className='md:mt-6 flow-root md:mx-8 mx-4 md:my-6 my-4 py-2'>
      <nav aria-label='Breadcrumb'>
        <ol className='flex text-base italic md:text-xl underline decoration-gray-500'>
          {breadcrumbs.map((breadcrumb, index) => (
            <li
              key={breadcrumb.href}
              aria-current={breadcrumb.active ? 'page' : undefined}
              className={clsx(breadcrumb.active ? 'text-gray-900' : 'text-gray-500')}
            >
              <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
              {index < breadcrumbs.length - 1 && <span className='mx-3 inline-block'>/</span>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
