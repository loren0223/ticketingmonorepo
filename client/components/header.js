import Link from 'next/link';

export default ({ currentuser }) => {
  // Amazing code to constructor the navigation bar
  const Links = [
    !currentuser && {
      label: 'Sign In',
      href: '/auth/signin',
      style: 'nav-link',
    },
    !currentuser && {
      label: 'Sign Up',
      href: '/auth/signup',
      style: 'nav-link btn btn-outline-primary',
    },
    currentuser && {
      label: 'Sell Tickets',
      href: '/tickets/new',
      style: 'nav-link',
    },
    currentuser && {
      label: 'My Orders',
      href: '/orders',
      style: 'nav-link',
    },
    currentuser && {
      label: 'Sign Out',
      href: '/auth/signout',
      style: 'nav-link',
    },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href, style }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className={style}>{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">AGREE Tix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{Links}</ul>
      </div>
    </nav>
  );
};
